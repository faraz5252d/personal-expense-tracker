package com.expensetracker.dto;

import java.util.List;

public class PaymentMethodsResponse {
    private boolean success;
    private Double total;
    private List<PaymentMethodDto> data;

    public PaymentMethodsResponse() {
    }

    public PaymentMethodsResponse(boolean success, Double total, List<PaymentMethodDto> data) {
        this.success = success;
        this.total = total;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public List<PaymentMethodDto> getData() {
        return data;
    }

    public void setData(List<PaymentMethodDto> data) {
        this.data = data;
    }
}
