package com.expensetracker.controller;

import com.expensetracker.dto.*;
import com.expensetracker.service.AnalyticsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<OverviewResponse>> getOverview() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getOverview()));
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<ApiResponse<List<MonthlyTrendDto>>> getMonthlyTrend() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getMonthlyTrend()));
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<CategoryBreakdownResponse> getCategoryBreakdown(
            @RequestParam(required = false, defaultValue = "expense") String type) {
        return ResponseEntity.ok(analyticsService.getCategoryBreakdown(type));
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<PaymentMethodsResponse> getPaymentMethods() {
        return ResponseEntity.ok(analyticsService.getPaymentMethodsBreakdown());
    }

    @GetMapping("/export-csv")
    public ResponseEntity<String> exportCsv() {
        String csv = analyticsService.exportCSV();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"expenses_export.csv\"")
                .body(csv);
    }
}
