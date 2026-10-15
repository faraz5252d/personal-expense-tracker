package com.expensetracker.dto;

public class MonthlyTrendDto {
    private String month; // "YYYY-MM"
    private String label; // "Oct 2026"
    private Double income;
    private Double expense;
    private Double net;

    public MonthlyTrendDto() {
    }

    public MonthlyTrendDto(String month, String label, Double income, Double expense, Double net) {
        this.month = month;
        this.label = label;
        this.income = income;
        this.expense = expense;
        this.net = net;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getIncome() {
        return income;
    }

    public void setIncome(Double income) {
        this.income = income;
    }

    public Double getExpense() {
        return expense;
    }

    public void setExpense(Double expense) {
        this.expense = expense;
    }

    public Double getNet() {
        return net;
    }

    public void setNet(Double net) {
        this.net = net;
    }
}
