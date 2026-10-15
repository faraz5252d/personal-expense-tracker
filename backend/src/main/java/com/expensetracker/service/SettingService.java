package com.expensetracker.service;

import com.expensetracker.dto.SettingDto;
import com.expensetracker.model.Setting;
import com.expensetracker.repository.SettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingService {

    private final SettingRepository settingRepository;

    public SettingService(SettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    @Transactional(readOnly = true)
    public Setting getSettings() {
        return settingRepository.findById("default")
                .orElseGet(() -> new Setting("default", "$", 3000.0));
    }

    @Transactional
    public Setting updateSettings(SettingDto dto) {
        Setting setting = settingRepository.findById("default")
                .orElseGet(() -> new Setting("default", "$", 3000.0));

        if (dto.getCurrency() != null && !dto.getCurrency().trim().isEmpty()) {
            setting.setCurrency(dto.getCurrency().trim());
        }
        if (dto.getMonthlyBudgetCap() != null) {
            setting.setMonthlyBudgetCap(dto.getMonthlyBudgetCap());
        }

        return settingRepository.save(setting);
    }
}
