package com.expensetracker.service;

import com.expensetracker.dto.CategoryRequest;
import com.expensetracker.dto.CategoryResponse;
import com.expensetracker.model.Category;
import com.expensetracker.model.Transaction;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public CategoryService(CategoryRepository categoryRepository, TransactionRepository transactionRepository) {
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<Transaction> transactions = transactionRepository.findAll();

        Map<String, int[]> stats = new HashMap<>(); // [count, total * 100 as long/double]
        Map<String, Double> totals = new HashMap<>();
        Map<String, Integer> counts = new HashMap<>();

        for (Transaction tx : transactions) {
            if (tx.getCategoryId() != null) {
                counts.put(tx.getCategoryId(), counts.getOrDefault(tx.getCategoryId(), 0) + 1);
                totals.put(tx.getCategoryId(), totals.getOrDefault(tx.getCategoryId(), 0.0) + (tx.getAmount() != null ? tx.getAmount() : 0.0));
            }
        }

        List<CategoryResponse> responseList = new ArrayList<>();
        for (Category cat : categories) {
            int count = counts.getOrDefault(cat.getId(), 0);
            double total = totals.getOrDefault(cat.getId(), 0.0);
            double roundedTotal = Math.round(total * 100.0) / 100.0;
            responseList.add(new CategoryResponse(
                cat.getId(),
                cat.getName(),
                cat.getType(),
                cat.getIcon(),
                cat.getColor(),
                cat.getIsDefault(),
                count,
                roundedTotal
            ));
        }

        return responseList;
    }

    @Transactional(readOnly = true)
    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }

    @Transactional
    public Category createCategory(CategoryRequest request) {
        String id = "cat-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String name = request.getName() != null ? request.getName().trim() : "";
        String type = request.getType() != null ? request.getType() : "expense";
        String icon = request.getIcon() != null ? request.getIcon() : "Tag";
        String color = request.getColor() != null ? request.getColor() : "#3b82f6";

        Category cat = new Category(id, name, type, icon, color, false);
        return categoryRepository.save(cat);
    }

    @Transactional
    public Optional<Category> updateCategory(String id, CategoryRequest request) {
        return categoryRepository.findById(id).map(existing -> {
            if (request.getName() != null && !request.getName().trim().isEmpty()) {
                existing.setName(request.getName().trim());
            }
            if (request.getType() != null) {
                existing.setType(request.getType());
            }
            if (request.getIcon() != null) {
                existing.setIcon(request.getIcon());
            }
            if (request.getColor() != null) {
                existing.setColor(request.getColor());
            }
            return categoryRepository.save(existing);
        });
    }

    @Transactional
    public void deleteCategory(String id) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Category not found"));

        if (Boolean.TRUE.equals(existing.getIsDefault())) {
            throw new IllegalArgumentException("Default categories cannot be deleted.");
        }

        categoryRepository.delete(existing);
    }
}
