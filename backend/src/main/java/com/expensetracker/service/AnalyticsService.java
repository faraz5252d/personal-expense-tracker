package com.expensetracker.service;

import com.expensetracker.dto.*;
import com.expensetracker.model.Category;
import com.expensetracker.model.Transaction;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public AnalyticsService(TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public OverviewResponse getOverview() {
        List<Transaction> transactions = transactionRepository.findAll();
        Map<String, Category> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getId, c -> c, (a, b) -> a));

        double totalIncome = 0.0;
        double totalExpense = 0.0;
        Transaction highestExpenseTx = null;
        int expenseCount = 0;

        for (Transaction tx : transactions) {
            double amt = tx.getAmount() != null ? tx.getAmount() : 0.0;
            if ("income".equalsIgnoreCase(tx.getType())) {
                totalIncome += amt;
            } else {
                totalExpense += amt;
                expenseCount++;
                if (highestExpenseTx == null || amt > (highestExpenseTx.getAmount() != null ? highestExpenseTx.getAmount() : 0.0)) {
                    highestExpenseTx = tx;
                }
            }
        }

        double roundedTotalIncome = Math.round(totalIncome * 100.0) / 100.0;
        double roundedTotalExpense = Math.round(totalExpense * 100.0) / 100.0;
        double netSavings = Math.round((totalIncome - totalExpense) * 100.0) / 100.0;
        int savingsRate = totalIncome > 0 ? (int) Math.round(((totalIncome - totalExpense) / totalIncome) * 100.0) : 0;
        double avgExpense = expenseCount > 0 ? Math.round((totalExpense / expenseCount) * 100.0) / 100.0 : 0.0;

        int healthScore = 50;
        if (savingsRate >= 40) healthScore += 30;
        else if (savingsRate >= 20) healthScore += 20;
        else if (savingsRate >= 0) healthScore += 10;
        else healthScore -= 20;

        if (totalExpense < totalIncome) healthScore += 15;
        if (transactions.size() >= 10) healthScore += 5;
        healthScore = Math.max(10, Math.min(99, healthScore));

        TransactionResponse highestExpenseResponse = null;
        if (highestExpenseTx != null) {
            Category cat = categoryMap.get(highestExpenseTx.getCategoryId());
            if (cat == null) {
                cat = new Category(highestExpenseTx.getCategoryId(), "Expense", "expense", "Tag", "#ef4444", false);
            }
            highestExpenseResponse = new TransactionResponse(
                    highestExpenseTx.getId(),
                    highestExpenseTx.getTitle(),
                    highestExpenseTx.getAmount(),
                    highestExpenseTx.getType(),
                    highestExpenseTx.getCategoryId(),
                    highestExpenseTx.getDate(),
                    highestExpenseTx.getPaymentMethod(),
                    highestExpenseTx.getNotes(),
                    highestExpenseTx.getCreatedAt(),
                    highestExpenseTx.getUpdatedAt(),
                    cat
            );
        }

        return new OverviewResponse(
                roundedTotalIncome,
                roundedTotalExpense,
                netSavings,
                savingsRate,
                transactions.size(),
                avgExpense,
                highestExpenseResponse,
                healthScore
        );
    }

    @Transactional(readOnly = true)
    public List<MonthlyTrendDto> getMonthlyTrend() {
        List<Transaction> transactions = transactionRepository.findAll();
        LinkedHashMap<String, MonthlyTrendDto> monthMap = new LinkedHashMap<>();

        YearMonth currentYearMonth = YearMonth.now();
        DateTimeFormatter labelFormatter = DateTimeFormatter.ofPattern("MMM yyyy", Locale.US);

        for (int i = 5; i >= 0; i--) {
            YearMonth ym = currentYearMonth.minusMonths(i);
            String key = ym.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            String label = ym.format(labelFormatter);
            monthMap.put(key, new MonthlyTrendDto(key, label, 0.0, 0.0, 0.0));
        }

        for (Transaction tx : transactions) {
            if (tx.getDate() != null && tx.getDate().length() >= 7) {
                String mKey = tx.getDate().substring(0, 7);
                MonthlyTrendDto trend = monthMap.get(mKey);
                if (trend != null) {
                    double amt = tx.getAmount() != null ? tx.getAmount() : 0.0;
                    if ("income".equalsIgnoreCase(tx.getType())) {
                        trend.setIncome(trend.getIncome() + amt);
                    } else {
                        trend.setExpense(trend.getExpense() + amt);
                    }
                }
            }
        }

        List<MonthlyTrendDto> result = new ArrayList<>();
        for (MonthlyTrendDto trend : monthMap.values()) {
            double income = Math.round(trend.getIncome() * 100.0) / 100.0;
            double expense = Math.round(trend.getExpense() * 100.0) / 100.0;
            double net = Math.round((income - expense) * 100.0) / 100.0;
            result.add(new MonthlyTrendDto(trend.getMonth(), trend.getLabel(), income, expense, net));
        }

        return result;
    }

    @Transactional(readOnly = true)
    public CategoryBreakdownResponse getCategoryBreakdown(String type) {
        String filterType = (type != null && !type.trim().isEmpty()) ? type.trim().toLowerCase() : "expense";
        List<Transaction> transactions = transactionRepository.findAll().stream()
                .filter(t -> filterType.equalsIgnoreCase(t.getType()))
                .collect(Collectors.toList());

        Map<String, Category> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getId, c -> c, (a, b) -> a));

        Map<String, Double> catSums = new HashMap<>();
        double grandTotal = 0.0;

        for (Transaction tx : transactions) {
            double amt = tx.getAmount() != null ? tx.getAmount() : 0.0;
            grandTotal += amt;
            if (tx.getCategoryId() != null) {
                catSums.put(tx.getCategoryId(), catSums.getOrDefault(tx.getCategoryId(), 0.0) + amt);
            }
        }

        double finalGrandTotal = grandTotal;
        List<CategoryBreakdownDto> breakdown = new ArrayList<>();

        for (Map.Entry<String, Double> entry : catSums.entrySet()) {
            String catId = entry.getKey();
            double rawAmount = entry.getValue();
            double amount = Math.round(rawAmount * 100.0) / 100.0;
            double percentage = finalGrandTotal > 0.0
                    ? Math.round((amount / finalGrandTotal) * 1000.0) / 10.0
                    : 0.0;

            Category cat = categoryMap.get(catId);
            String catName = cat != null ? cat.getName() : "Other";
            String color = cat != null ? cat.getColor() : "#94a3b8";
            String icon = cat != null ? cat.getIcon() : "Tag";

            breakdown.add(new CategoryBreakdownDto(catId, catName, color, icon, amount, percentage));
        }

        breakdown.sort((a, b) -> Double.compare(b.getAmount(), a.getAmount()));

        return new CategoryBreakdownResponse(
                true,
                filterType,
                Math.round(grandTotal * 100.0) / 100.0,
                breakdown
        );
    }

    @Transactional(readOnly = true)
    public PaymentMethodsResponse getPaymentMethodsBreakdown() {
        List<Transaction> transactions = transactionRepository.findAll().stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                .collect(Collectors.toList());

        Map<String, Double> methodSums = new HashMap<>();
        double grandTotal = 0.0;

        for (Transaction tx : transactions) {
            String method = (tx.getPaymentMethod() != null && !tx.getPaymentMethod().trim().isEmpty())
                    ? tx.getPaymentMethod().trim()
                    : "Cash";
            double amt = tx.getAmount() != null ? tx.getAmount() : 0.0;
            grandTotal += amt;
            methodSums.put(method, methodSums.getOrDefault(method, 0.0) + amt);
        }

        double finalGrandTotal = grandTotal;
        List<PaymentMethodDto> data = new ArrayList<>();

        for (Map.Entry<String, Double> entry : methodSums.entrySet()) {
            String method = entry.getKey();
            double rawAmount = entry.getValue();
            double amount = Math.round(rawAmount * 100.0) / 100.0;
            int percentage = finalGrandTotal > 0.0
                    ? (int) Math.round((amount / finalGrandTotal) * 100.0)
                    : 0;
            data.add(new PaymentMethodDto(method, amount, percentage));
        }

        data.sort((a, b) -> Double.compare(b.getAmount(), a.getAmount()));

        return new PaymentMethodsResponse(true, Math.round(grandTotal * 100.0) / 100.0, data);
    }

    @Transactional(readOnly = true)
    public String exportCSV() {
        List<Transaction> transactions = transactionRepository.findAll().stream()
                .sorted((a, b) -> {
                    int c = (b.getDate() != null ? b.getDate() : "").compareTo(a.getDate() != null ? a.getDate() : "");
                    if (c != 0) return c;
                    return (b.getCreatedAt() != null ? b.getCreatedAt() : "")
                            .compareTo(a.getCreatedAt() != null ? a.getCreatedAt() : "");
                })
                .collect(Collectors.toList());

        Map<String, Category> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getId, c -> c, (a, b) -> a));

        StringBuilder sb = new StringBuilder();
        sb.append("ID,Date,Title,Type,Category,Amount,Payment Method,Notes\n");

        for (Transaction tx : transactions) {
            String catName = "Unknown";
            if (tx.getCategoryId() != null && categoryMap.containsKey(tx.getCategoryId())) {
                catName = categoryMap.get(tx.getCategoryId()).getName();
            }

            sb.append('"').append(escapeCsv(tx.getId())).append("\",")
              .append('"').append(escapeCsv(tx.getDate())).append("\",")
              .append('"').append(escapeCsv(tx.getTitle())).append("\",")
              .append('"').append(escapeCsv(tx.getType())).append("\",")
              .append('"').append(escapeCsv(catName)).append("\",")
              .append(tx.getAmount() != null ? tx.getAmount() : 0.0).append(',')
              .append('"').append(escapeCsv(tx.getPaymentMethod() != null ? tx.getPaymentMethod() : "Other")).append("\",")
              .append('"').append(escapeCsv(tx.getNotes() != null ? tx.getNotes() : "")).append("\"\n");
        }

        return sb.toString();
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        return val.replace("\"", "\"\"");
    }
}
