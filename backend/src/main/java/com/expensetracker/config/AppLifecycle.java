package com.expensetracker.config;

import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class AppLifecycle {
    private final Instant startTime = Instant.now();

    public long getUptimeSeconds() {
        return Instant.now().getEpochSecond() - startTime.getEpochSecond();
    }
}
