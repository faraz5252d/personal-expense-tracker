package com.expensetracker.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "settings")
public class Setting {

    @Id
    @Column(length = 50)
    private String id = "default";

    @Column(length = 10)
    private String currency = "$";

    @Column(name = "monthly_budget_cap")
    private Double monthlyBudgetCap = 3000.0;

    public Setting() {
    }

    public Setting(String id, String currency, Double monthlyBudgetCap) {
        this.id = id != null ? id : "default";
        this.currency = currency != null ? currency : "$";
        this.monthlyBudgetCap = monthlyBudgetCap != null ? monthlyBudgetCap : 3000.0;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
