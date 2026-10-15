package com.expensetracker.dto;

import java.util.List;

public class TransactionsPageResponse {
    private boolean success;
    private int totalCount;
    private int count;
    private List<TransactionResponse> data;

    public TransactionsPageResponse() {
    }

    public TransactionsPageResponse(boolean success, int totalCount, int count, List<TransactionResponse> data) {
        this.success = success;
        this.totalCount = totalCount;
        this.count = count;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public List<TransactionResponse> getData() {
        return data;
    }

    public void setData(List<TransactionResponse> data) {
        this.data = data;
    }
}
