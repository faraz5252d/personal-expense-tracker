package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.SettingDto;
import com.expensetracker.model.Setting;
import com.expensetracker.service.SettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingController {

    private final SettingService settingService;

    public SettingController(SettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Setting>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success(settingService.getSettings()));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Setting>> updateSettings(@RequestBody SettingDto request) {
        Setting updated = settingService.updateSettings(request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Settings saved"));
    }
}
