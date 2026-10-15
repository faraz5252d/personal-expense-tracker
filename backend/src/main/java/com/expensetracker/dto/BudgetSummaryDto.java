package com.expensetracker.dto;

public class BudgetSummaryDto {
    private Double totalBudget;
    private Double totalSpent;
    private Double totalRemaining;
    private int overallPercent;
    private int alertsCount;

    public BudgetSummaryDto() {
    }

    public BudgetSummaryDto(Double totalBudget, Double totalSpent, Double totalRemaining,
                            int overallPercent, int alertsCount) {
        this.totalBudget = totalBudget;
        this.totalSpent = totalSpent;
        this.totalRemaining = totalRemaining;
        this.overallPercent = overallPercent;
        this.alertsCount = alertsCount;
    }

    public Double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(Double totalBudget) {
        this.totalBudget = totalBudget;
    }

    public Double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(Double totalSpent) {
        this.totalSpent = totalSpent;
    }

    public Double getTotalRemaining() {
        return totalRemaining;
    }

    public void setTotalRemaining(Double totalRemaining) {
        this.totalRemaining = totalRemaining;
    }

    public int getOverallPercent() {
        return overallPercent;
    }

    public void setOverallPercent(int overallPercent) {
        this.overallPercent = overallPercent;
    }

    public int getAlertsCount() {
        return alertsCount;
    }

    public void setAlertsCount(int alertsCount) {
        this.alertsCount = alertsCount;
    }
}
