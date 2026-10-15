package com.expensetracker.controller;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.BudgetListResponse;
import com.expensetracker.dto.BudgetRequest;
import com.expensetracker.dto.BudgetResponse;
import com.expensetracker.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<BudgetListResponse> getBudgets(@RequestParam(required = false) String month) {
        return ResponseEntity.ok(budgetService.getBudgets(month));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> setBudget(@RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.setBudget(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Budget set successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(@PathVariable String id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok(ApiResponse.successMsg("Budget removed successfully"));
    }
}
