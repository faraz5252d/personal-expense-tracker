package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.service.DataInitializerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reset")
public class ResetController {

    private final DataInitializerService dataInitializerService;

    public ResetController(DataInitializerService dataInitializerService) {
        this.dataInitializerService = dataInitializerService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> resetDemoData() {
        Map<String, Object> freshData = dataInitializerService.resetToDemoData();
        return ResponseEntity.ok(ApiResponse.success(freshData, "Database reset to demo state"));
    }
}
