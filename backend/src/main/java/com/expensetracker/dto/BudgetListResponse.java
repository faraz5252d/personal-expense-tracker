package com.expensetracker.dto;

import java.util.List;

public class BudgetListResponse {
    private boolean success;
    private String month;
    private BudgetSummaryDto summary;
    private List<BudgetAlertDto> alerts;
    private List<BudgetResponse> data;

    public BudgetListResponse() {
    }

    public BudgetListResponse(boolean success, String month, BudgetSummaryDto summary,
                              List<BudgetAlertDto> alerts, List<BudgetResponse> data) {
        this.success = success;
        this.month = month;
        this.summary = summary;
        this.alerts = alerts;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public BudgetSummaryDto getSummary() {
        return summary;
    }

    public void setSummary(BudgetSummaryDto summary) {
        this.summary = summary;
    }

    public List<BudgetAlertDto> getAlerts() {
        return alerts;
    }

    public void setAlerts(List<BudgetAlertDto> alerts) {
        this.alerts = alerts;
    }

    public List<BudgetResponse> getData() {
        return data;
    }

    public void setData(List<BudgetResponse> data) {
        this.data = data;
    }
}
