package com.expensetracker.dto;

import java.util.List;

public class CategoryBreakdownResponse {
    private boolean success;
    private String type;
    private Double total;
    private List<CategoryBreakdownDto> data;

    public CategoryBreakdownResponse() {
    }

    public CategoryBreakdownResponse(boolean success, String type, Double total, List<CategoryBreakdownDto> data) {
        this.success = success;
        this.type = type;
        this.total = total;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public List<CategoryBreakdownDto> getData() {
        return data;
    }

    public void setData(List<CategoryBreakdownDto> data) {
        this.data = data;
    }
}
