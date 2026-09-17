package com.bank.controller;

import com.bank.dto.ApiResponse;
import com.bank.dto.ManagerAnalyticsResponse;
import com.bank.dto.TransactionResponse;
import com.bank.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping("/approvals")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getPendingApprovals() {
        List<TransactionResponse> pending = managerService.getPendingApprovals();
        return ResponseEntity.ok(ApiResponse.success("Pending approvals retrieved successfully", pending));
    }

    @PostMapping("/approvals/{transactionId}")
    public ResponseEntity<ApiResponse<TransactionResponse>> processApproval(
            @PathVariable Long transactionId,
            @RequestParam boolean approve) {
        TransactionResponse response = managerService.processApproval(transactionId, approve);
        String actionMsg = approve ? "Transaction approved successfully" : "Transaction rejected";
        return ResponseEntity.ok(ApiResponse.success(actionMsg, response));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<ManagerAnalyticsResponse>> getAnalytics() {
        ManagerAnalyticsResponse analytics = managerService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Manager analytics retrieved successfully", analytics));
    }
}
