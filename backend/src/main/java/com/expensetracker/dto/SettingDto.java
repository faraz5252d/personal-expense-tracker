package com.expensetracker.dto;

public class SettingDto {
    private String currency;
    private Double monthlyBudgetCap;

    public SettingDto() {
    }

    public SettingDto(String currency, Double monthlyBudgetCap) {
        this.currency = currency;
        this.monthlyBudgetCap = monthlyBudgetCap;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Double getMonthlyBudgetCap() {
        return monthlyBudgetCap;
    }

    public void setMonthlyBudgetCap(Double monthlyBudgetCap) {
        this.monthlyBudgetCap = monthlyBudgetCap;
    }
}
