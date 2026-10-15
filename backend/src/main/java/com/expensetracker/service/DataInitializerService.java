package com.expensetracker.service;

import com.expensetracker.model.Budget;
import com.expensetracker.model.Category;
import com.expensetracker.model.Setting;
import com.expensetracker.model.Transaction;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.SettingRepository;
import com.expensetracker.repository.TransactionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DataInitializerService implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final SettingRepository settingRepository;

    public DataInitializerService(CategoryRepository categoryRepository,
                                  BudgetRepository budgetRepository,
                                  TransactionRepository transactionRepository,
                                  SettingRepository settingRepository) {
        this.categoryRepository = categoryRepository;
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.settingRepository = settingRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            resetToDemoData();
        }
    }

    @Transactional
    public Map<String, Object> resetToDemoData() {
        transactionRepository.deleteAllInBatch();
        budgetRepository.deleteAllInBatch();
        categoryRepository.deleteAllInBatch();
        settingRepository.deleteAllInBatch();

        // 1. Categories
        List<Category> categories = getDefaultCategories();
        categoryRepository.saveAll(categories);

        // 2. Budgets
        String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        List<Budget> budgets = getDefaultBudgets(currentMonth);
        budgetRepository.saveAll(budgets);

        // 3. Settings
        Setting setting = new Setting("default", "$", 3000.0);
        settingRepository.save(setting);

        // 4. Seed Transactions
        List<Transaction> transactions = getSeedTransactions();
        transactionRepository.saveAll(transactions);

        Map<String, Object> result = new HashMap<>();
        result.put("categories", categories);
        result.put("budgets", budgets);
        result.put("transactions", transactions);
        result.put("settings", setting);
        return result;
    }

    public List<Category> getDefaultCategories() {
        return List.of(
            new Category("cat-housing", "Housing & Rent", "expense", "Home", "#6366f1", true),
            new Category("cat-groceries", "Groceries", "expense", "ShoppingBag", "#10b981", true),
            new Category("cat-dining", "Food & Dining", "expense", "Utensils", "#f59e0b", true),
            new Category("cat-transport", "Transportation", "expense", "Car", "#3b82f6", true),
            new Category("cat-utilities", "Utilities & Bills", "expense", "Zap", "#ec4899", true),
            new Category("cat-entertainment", "Entertainment", "expense", "Film", "#8b5cf6", true),
            new Category("cat-health", "Healthcare & Fitness", "expense", "Activity", "#ef4444", true),
            new Category("cat-shopping", "Shopping & Gear", "expense", "Package", "#14b8a6", true),
            new Category("cat-education", "Education & Books", "expense", "BookOpen", "#06b6d4", true),
            new Category("cat-other-exp", "Miscellaneous", "expense", "Tag", "#64748b", true),
            new Category("cat-salary", "Salary", "income", "Briefcase", "#22c55e", true),
            new Category("cat-freelance", "Freelance & Contract", "income", "Laptop", "#3b82f6", true),
            new Category("cat-investment", "Investments & Dividends", "income", "TrendingUp", "#8b5cf6", true),
            new Category("cat-other-inc", "Other Income", "income", "DollarSign", "#10b981", true)
        );
    }

    public List<Budget> getDefaultBudgets(String month) {
        return List.of(
            new Budget("b-housing", "cat-housing", 1200.0, month),
            new Budget("b-groceries", "cat-groceries", 450.0, month),
            new Budget("b-dining", "cat-dining", 250.0, month),
            new Budget("b-transport", "cat-transport", 200.0, month),
            new Budget("b-utilities", "cat-utilities", 180.0, month),
            new Budget("b-entertainment", "cat-entertainment", 150.0, month),
            new Budget("b-shopping", "cat-shopping", 200.0, month)
        );
    }

    public List<Transaction> getSeedTransactions() {
        LocalDate today = LocalDate.now();
        List<Transaction> txs = new ArrayList<>();

        // Incomes
        txs.add(createSeedTx("Monthly Salary Deposit", 4200.00, "income", "cat-salary", today.minusDays(12), "Bank Transfer", "Primary payroll direct deposit"));
        txs.add(createSeedTx("Freelance UI/UX Project", 850.00, "income", "cat-freelance", today.minusDays(6), "Bank Transfer", "Mobile app client payout"));
        txs.add(createSeedTx("Stock Dividend Yield", 120.00, "income", "cat-investment", today.minusDays(18), "Bank Transfer", "Quarterly index fund dividend"));

        // Expenses
        txs.add(createSeedTx("Apartment Rent", 1150.00, "expense", "cat-housing", today.minusDays(11), "Bank Transfer", "Monthly lease payment"));
        txs.add(createSeedTx("Whole Foods Supermarket", 134.50, "expense", "cat-groceries", today.minusDays(2), "Credit Card", "Weekly grocery restocking"));
        txs.add(createSeedTx("Trader Joe's Essentials", 86.20, "expense", "cat-groceries", today.minusDays(8), "Debit Card", "Snacks & organic staples"));
        txs.add(createSeedTx("Electric & Power Utility", 92.40, "expense", "cat-utilities", today.minusDays(10), "Bank Transfer", "Electric bill"));
        txs.add(createSeedTx("High-Speed Fiber Internet", 65.00, "expense", "cat-utilities", today.minusDays(14), "Credit Card", "Fiber broadband"));
        txs.add(createSeedTx("Italian Bistro Dinner", 74.50, "expense", "cat-dining", today.minusDays(3), "Credit Card", "Dinner with teammates"));
        txs.add(createSeedTx("Blue Bottle Specialty Coffee", 18.25, "expense", "cat-dining", today.minusDays(1), "UPI", "Coffee and bakery pastry"));
        txs.add(createSeedTx("Subway & Transit Pass", 45.00, "expense", "cat-transport", today.minusDays(5), "Debit Card", "Monthly metro card reload"));
        txs.add(createSeedTx("Shell Fuel Station", 52.80, "expense", "cat-transport", today.minusDays(9), "Credit Card", "Gas refill"));
        txs.add(createSeedTx("Cinema IMAX Tickets", 34.00, "expense", "cat-entertainment", today.minusDays(4), "Credit Card", "Weekend movie premiere"));
        txs.add(createSeedTx("Spotify Premium Subscription", 10.99, "expense", "cat-entertainment", today.minusDays(15), "Credit Card", "Family music plan"));
        txs.add(createSeedTx("Fitness Gym Membership", 55.00, "expense", "cat-health", today.minusDays(13), "Debit Card", "Monthly gym dues"));
        txs.add(createSeedTx("Running Shoes & Socks", 110.00, "expense", "cat-shopping", today.minusDays(7), "Credit Card", "Sportswear purchase"));
        txs.add(createSeedTx("Online Cloud Course", 29.99, "expense", "cat-education", today.minusDays(16), "Credit Card", "Fullstack certification"));

        return txs;
    }

    private Transaction createSeedTx(String title, Double amount, String type, String categoryId,
                                     LocalDate date, String paymentMethod, String notes) {
        String isoDate = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
        String isoDateTime = date.atStartOfDay(ZoneId.of("UTC")).format(DateTimeFormatter.ISO_INSTANT);
        return new Transaction(UUID.randomUUID().toString(), title, amount, type, categoryId,
                isoDate, paymentMethod, notes, isoDateTime);
    }
}
