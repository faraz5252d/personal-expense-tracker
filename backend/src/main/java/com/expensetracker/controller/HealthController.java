package com.expensetracker.controller;

import com.expensetracker.config.AppLifecycle;
import com.expensetracker.dto.HealthResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final AppLifecycle appLifecycle;

    public HealthController(AppLifecycle appLifecycle) {
        this.appLifecycle = appLifecycle;
    }

    @GetMapping
    public HealthResponse checkHealth() {
        return new HealthResponse(
                "online",
                "Personal Expense Management API",
                Instant.now().toString(),
                appLifecycle.getUptimeSeconds(),
                "1.0.0"
        );
    }
}
