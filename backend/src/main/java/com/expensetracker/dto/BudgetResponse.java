package com.expensetracker.dto;

import com.expensetracker.model.Category;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BudgetResponse {
    private String id;
    private String categoryId;
    private Double amount;
    private String month;
    private Double spent;
    private Double remaining;
    private int percent;
    private String status; // "safe", "warning", "exceeded"
    private Category category;

    public BudgetResponse() {
    }

    public BudgetResponse(String id, String categoryId, Double amount, String month,
                          Double spent, Double remaining, int percent, String status, Category category) {
        this.id = id;
        this.categoryId = categoryId;
        this.amount = amount;
        this.month = month;
        this.spent = spent;
        this.remaining = remaining;
        this.percent = percent;
        this.status = status;
        this.category = category;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Double getSpent() {
        return spent;
    }

    public void setSpent(Double spent) {
        this.spent = spent;
    }

    public Double getRemaining() {
        return remaining;
    }

    public void setRemaining(Double remaining) {
        this.remaining = remaining;
    }

    public int getPercent() {
        return percent;
    }

    public void setPercent(int percent) {
        this.percent = percent;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
