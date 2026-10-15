package com.expensetracker.service;

import com.expensetracker.dto.TransactionRequest;
import com.expensetracker.dto.TransactionResponse;
import com.expensetracker.dto.TransactionsPageResponse;
import com.expensetracker.model.Category;
import com.expensetracker.model.Transaction;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public TransactionsPageResponse getTransactions(String type, String categoryId, String startDate,
                                                    String endDate, String paymentMethod, String search,
                                                    Integer limit, Integer page) {
        List<Transaction> all = transactionRepository.findAll();
        Map<String, Category> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getId, c -> c, (a, b) -> a));

        List<Transaction> filtered = all.stream().filter(tx -> {
            if (type != null && !type.trim().isEmpty() && !tx.getType().equalsIgnoreCase(type.trim())) {
                return false;
            }
            if (categoryId != null && !categoryId.trim().isEmpty() && !categoryId.trim().equals(tx.getCategoryId())) {
                return false;
            }
            if (startDate != null && !startDate.trim().isEmpty() && tx.getDate().compareTo(startDate.trim()) < 0) {
                return false;
            }
            if (endDate != null && !endDate.trim().isEmpty() && tx.getDate().compareTo(endDate.trim()) > 0) {
                return false;
            }
            if (paymentMethod != null && !paymentMethod.trim().isEmpty() &&
                    (tx.getPaymentMethod() == null || !tx.getPaymentMethod().equalsIgnoreCase(paymentMethod.trim()))) {
                return false;
            }
            if (search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean matchesTitle = tx.getTitle() != null && tx.getTitle().toLowerCase().contains(q);
                boolean matchesNotes = tx.getNotes() != null && tx.getNotes().toLowerCase().contains(q);
                if (!matchesTitle && !matchesNotes) {
                    return false;
                }
            }
            return true;
        }).sorted((a, b) -> {
            int dateCmp = (b.getDate() != null ? b.getDate() : "").compareTo(a.getDate() != null ? a.getDate() : "");
            if (dateCmp != 0) return dateCmp;
            String createdB = b.getCreatedAt() != null ? b.getCreatedAt() : "";
            String createdA = a.getCreatedAt() != null ? a.getCreatedAt() : "";
            return createdB.compareTo(createdA);
        }).collect(Collectors.toList());

        List<TransactionResponse> enriched = filtered.stream()
                .map(tx -> enrich(tx, categoryMap))
                .collect(Collectors.toList());

        int totalCount = enriched.size();
        List<TransactionResponse> pagedResult = enriched;

        if (page != null && limit != null) {
            int p = Math.max(1, page);
            int l = Math.max(1, limit);
            int start = (p - 1) * l;
            if (start >= totalCount) {
                pagedResult = Collections.emptyList();
            } else {
                int end = Math.min(start + l, totalCount);
                pagedResult = enriched.subList(start, end);
            }
        }

        return new TransactionsPageResponse(true, totalCount, pagedResult.size(), pagedResult);
    }

    @Transactional(readOnly = true)
    public Optional<TransactionResponse> getTransactionById(String id) {
        return transactionRepository.findById(id).map(tx -> {
            Category category = tx.getCategoryId() != null ? categoryRepository.findById(tx.getCategoryId()).orElse(null) : null;
            return enrich(tx, category);
        });
    }

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest req) {
        if (req.getTitle() == null || req.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (req.getAmount() == null || req.getAmount() <= 0) {
            throw new IllegalArgumentException("Valid positive amount is required");
        }
        if (req.getCategoryId() == null || req.getCategoryId().trim().isEmpty()) {
            throw new IllegalArgumentException("Category is required");
        }

        String id = UUID.randomUUID().toString();
        String title = req.getTitle().trim();
        Double amount = req.getAmount();
        String type = req.getType() != null && !req.getType().trim().isEmpty() ? req.getType().trim() : "expense";
        String categoryId = req.getCategoryId().trim();
        String date = req.getDate() != null && !req.getDate().trim().isEmpty()
                ? req.getDate().trim()
                : LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        String paymentMethod = req.getPaymentMethod() != null && !req.getPaymentMethod().trim().isEmpty()
                ? req.getPaymentMethod().trim()
                : "Credit Card";
        String notes = req.getNotes() != null ? req.getNotes().trim() : "";
        String createdAt = Instant.now().toString();

        Transaction tx = new Transaction(id, title, amount, type, categoryId, date, paymentMethod, notes, createdAt);
        Transaction saved = transactionRepository.save(tx);

        Category category = categoryRepository.findById(categoryId).orElse(null);
        return enrich(saved, category);
    }

    @Transactional
    public TransactionResponse updateTransaction(String id, TransactionRequest req) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Transaction not found"));

        if (req.getAmount() != null && req.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be a positive number");
        }

        if (req.getTitle() != null && !req.getTitle().trim().isEmpty()) {
            existing.setTitle(req.getTitle().trim());
        }
        if (req.getAmount() != null) {
            existing.setAmount(req.getAmount());
        }
        if (req.getType() != null) {
            existing.setType(req.getType());
        }
        if (req.getCategoryId() != null && !req.getCategoryId().trim().isEmpty()) {
            existing.setCategoryId(req.getCategoryId().trim());
        }
        if (req.getDate() != null && !req.getDate().trim().isEmpty()) {
            existing.setDate(req.getDate().trim());
        }
        if (req.getPaymentMethod() != null) {
            existing.setPaymentMethod(req.getPaymentMethod());
        }
        if (req.getNotes() != null) {
            existing.setNotes(req.getNotes().trim());
        }
        existing.setUpdatedAt(Instant.now().toString());

        Transaction saved = transactionRepository.save(existing);
        Category category = categoryRepository.findById(saved.getCategoryId()).orElse(null);
        return enrich(saved, category);
    }

    @Transactional
    public void deleteTransaction(String id) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Transaction not found"));
        transactionRepository.delete(existing);
    }

    private TransactionResponse enrich(Transaction tx, Map<String, Category> categoryMap) {
        Category category = categoryMap.get(tx.getCategoryId());
        return enrich(tx, category);
    }

    private TransactionResponse enrich(Transaction tx, Category category) {
        if (category == null) {
            category = new Category(
                tx.getCategoryId() != null ? tx.getCategoryId() : "cat-unknown",
                "Uncategorized",
                tx.getType() != null ? tx.getType() : "expense",
                "Tag",
                "#94a3b8",
                false
            );
        }
        return new TransactionResponse(
                tx.getId(),
                tx.getTitle(),
                tx.getAmount(),
                tx.getType(),
                tx.getCategoryId(),
                tx.getDate(),
                tx.getPaymentMethod(),
                tx.getNotes(),
                tx.getCreatedAt(),
                tx.getUpdatedAt(),
                category
        );
    }
}
