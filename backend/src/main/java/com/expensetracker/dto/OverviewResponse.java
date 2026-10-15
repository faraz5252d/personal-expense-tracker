package com.expensetracker.dto;

public class OverviewResponse {
    private Double totalIncome;
    private Double totalExpense;
    private Double netSavings;
    private int savingsRate;
    private int transactionCount;
    private Double averageExpense;
    private TransactionResponse highestExpense;
    private int healthScore;

    public OverviewResponse() {
    }

    public OverviewResponse(Double totalIncome, Double totalExpense, Double netSavings,
                            int savingsRate, int transactionCount, Double averageExpense,
                            TransactionResponse highestExpense, int healthScore) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.netSavings = netSavings;
        this.savingsRate = savingsRate;
        this.transactionCount = transactionCount;
        this.averageExpense = averageExpense;
        this.highestExpense = highestExpense;
        this.healthScore = healthScore;
    }

    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(Double totalExpense) {
        this.totalExpense = totalExpense;
    }

    public Double getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(Double netSavings) {
        this.netSavings = netSavings;
    }

    public int getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(int savingsRate) {
        this.savingsRate = savingsRate;
    }

    public int getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(int transactionCount) {
        this.transactionCount = transactionCount;
    }

    public Double getAverageExpense() {
        return averageExpense;
    }

    public void setAverageExpense(Double averageExpense) {
        this.averageExpense = averageExpense;
    }

    public TransactionResponse getHighestExpense() {
        return highestExpense;
    }

    public void setHighestExpense(TransactionResponse highestExpense) {
        this.highestExpense = highestExpense;
    }

    public int getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(int healthScore) {
        this.healthScore = healthScore;
    }
}
