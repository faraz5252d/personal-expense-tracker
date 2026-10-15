package com.expensetracker.service;

import com.expensetracker.dto.*;
import com.expensetracker.model.Budget;
import com.expensetracker.model.Category;
import com.expensetracker.model.Transaction;
import com.expensetracker.repository.BudgetRepository;
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
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(BudgetRepository budgetRepository,
                         CategoryRepository categoryRepository,
                         TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public BudgetListResponse getBudgets(String month) {
        String selectedMonth = (month != null && !month.trim().isEmpty())
                ? month.trim()
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        YearMonth ym = YearMonth.parse(selectedMonth);
        String startDate = selectedMonth + "-01";
        String endDate = selectedMonth + "-" + String.format("%02d", ym.lengthOfMonth());

        List<Budget> budgets = budgetRepository.findByMonthOrMonthIsNull(selectedMonth);
        List<Category> categories = categoryRepository.findAll();
        Map<String, Category> categoryMap = categories.stream()
                .collect(Collectors.toMap(Category::getId, c -> c, (a, b) -> a));

        List<Transaction> transactions = transactionRepository.findAll();
        Map<String, Double> categorySpending = new HashMap<>();

        for (Transaction tx : transactions) {
            if ("expense".equalsIgnoreCase(tx.getType()) && tx.getDate() != null) {
                if (tx.getDate().compareTo(startDate) >= 0 && tx.getDate().compareTo(endDate) <= 0) {
                    if (tx.getCategoryId() != null) {
                        double amt = tx.getAmount() != null ? tx.getAmount() : 0.0;
                        categorySpending.put(tx.getCategoryId(), categorySpending.getOrDefault(tx.getCategoryId(), 0.0) + amt);
                    }
                }
            }
        }

        double totalBudget = 0.0;
        double totalSpent = 0.0;
        List<BudgetResponse> enrichedBudgets = new ArrayList<>();
        List<BudgetAlertDto> alerts = new ArrayList<>();

        for (Budget b : budgets) {
            double budgetAmount = b.getAmount() != null ? b.getAmount() : 0.0;
            double rawSpent = categorySpending.getOrDefault(b.getCategoryId(), 0.0);
            double spent = Math.round(rawSpent * 100.0) / 100.0;
            double remaining = Math.round((budgetAmount - spent) * 100.0) / 100.0;
            int percent = budgetAmount > 0 ? (int) Math.round((spent / budgetAmount) * 100.0) : 0;

            String status = "safe";
            if (percent >= 100) {
                status = "exceeded";
            } else if (percent >= 75) {
                status = "warning";
            }

            totalBudget += budgetAmount;
            totalSpent += spent;

            Category cat = categoryMap.get(b.getCategoryId());
            if (cat == null) {
                cat = new Category(b.getCategoryId(), "Unknown", "expense", "Tag", "#64748b", false);
            }

            BudgetResponse response = new BudgetResponse(
                    b.getId(),
                    b.getCategoryId(),
                    budgetAmount,
                    b.getMonth(),
                    spent,
                    remaining,
                    percent,
                    status,
                    cat
            );
            enrichedBudgets.add(response);

            if ("warning".equals(status) || "exceeded".equals(status)) {
                String message = "exceeded".equals(status)
                        ? String.format(Locale.US, "Budget exceeded by $%.2f in %s", (spent - budgetAmount), cat.getName())
                        : String.format(Locale.US, "Approaching budget limit (%d%% spent) in %s", percent, cat.getName());

                alerts.add(new BudgetAlertDto(
                        b.getCategoryId(),
                        cat.getName(),
                        budgetAmount,
                        spent,
                        percent,
                        status,
                        message
                ));
            }
        }

        double roundedTotalBudget = Math.round(totalBudget * 100.0) / 100.0;
        double roundedTotalSpent = Math.round(totalSpent * 100.0) / 100.0;
        double totalRemaining = Math.round((roundedTotalBudget - roundedTotalSpent) * 100.0) / 100.0;
        int overallPercent = roundedTotalBudget > 0 ? (int) Math.round((roundedTotalSpent / roundedTotalBudget) * 100.0) : 0;

        BudgetSummaryDto summary = new BudgetSummaryDto(
                roundedTotalBudget,
                roundedTotalSpent,
                totalRemaining,
                overallPercent,
                alerts.size()
        );

        return new BudgetListResponse(true, selectedMonth, summary, alerts, enrichedBudgets);
    }

    @Transactional
    public BudgetResponse setBudget(BudgetRequest req) {
        if (req.getCategoryId() == null || req.getCategoryId().trim().isEmpty()) {
            throw new IllegalArgumentException("Category ID is required");
        }
        if (req.getAmount() == null || req.getAmount() < 0) {
            throw new IllegalArgumentException("Valid budget amount is required");
        }

        String month = (req.getMonth() != null && !req.getMonth().trim().isEmpty())
                ? req.getMonth().trim()
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        Budget budget = budgetRepository.findByCategoryIdAndMonth(req.getCategoryId().trim(), month)
                .orElseGet(() -> {
                    String id = "b-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
                    return new Budget(id, req.getCategoryId().trim(), req.getAmount(), month);
                });

        budget.setAmount(req.getAmount());
        budget.setMonth(month);
        Budget saved = budgetRepository.save(budget);

        Category cat = categoryRepository.findById(saved.getCategoryId()).orElse(null);
        return new BudgetResponse(
                saved.getId(),
                saved.getCategoryId(),
                saved.getAmount(),
                saved.getMonth(),
                null, null, 0, null, cat
        );
    }

    @Transactional
    public void deleteBudget(String id) {
        Budget existing = budgetRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Budget record not found"));
        budgetRepository.delete(existing);
    }
}
