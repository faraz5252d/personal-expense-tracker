package com.expensetracker.dto;

public class BudgetRequest {
    private String categoryId;
    private Double amount;
    private String month;

    public BudgetRequest() {
    }

    public BudgetRequest(String categoryId, Double amount, String month) {
        this.categoryId = categoryId;
        this.amount = amount;
        this.month = month;
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
}
