package com.expensetracker.dto;

public class BudgetAlertDto {
    private String categoryId;
    private String categoryName;
    private Double budgetAmount;
    private Double spent;
    private int percent;
    private String status;
    private String message;

    public BudgetAlertDto() {
    }

    public BudgetAlertDto(String categoryId, String categoryName, Double budgetAmount,
                          Double spent, int percent, String status, String message) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.budgetAmount = budgetAmount;
        this.spent = spent;
        this.percent = percent;
        this.status = status;
        this.message = message;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Double getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(Double budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public Double getSpent() {
        return spent;
    }

    public void setSpent(Double spent) {
        this.spent = spent;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
