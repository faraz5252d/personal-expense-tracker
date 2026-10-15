package com.expensetracker.dto;

public class PaymentMethodDto {
    private String method;
    private Double amount;
    private int percentage;

    public PaymentMethodDto() {
    }

    public PaymentMethodDto(String method, Double amount, int percentage) {
        this.method = method;
        this.amount = amount;
        this.percentage = percentage;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }
}
