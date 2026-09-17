package com.bank.controller;

import com.bank.dto.AccountResponse;
import com.bank.dto.ApiResponse;
import com.bank.dto.AuditLogResponse;
import com.bank.dto.TransactionResponse;
import com.bank.dto.UserProfileResponse;
import com.bank.enums.AccountStatus;
import com.bank.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasAnyRole('STAFF', 'MANAGER', 'ADMIN')")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllCustomers() {
        List<UserProfileResponse> customers = staffService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success("All customers retrieved successfully", customers));
    }

    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts() {
        List<AccountResponse> accounts = staffService.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.success("All accounts retrieved successfully", accounts));
    }

    @PutMapping("/accounts/{accountId}/status")
    public ResponseEntity<ApiResponse<AccountResponse>> updateAccountStatus(
            @PathVariable Long accountId,
            @RequestParam AccountStatus status) {
        AccountResponse account = staffService.updateAccountStatus(accountId, status);
        return ResponseEntity.ok(ApiResponse.success("Account status updated successfully", account));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAllTransactions() {
        List<TransactionResponse> transactions = staffService.getAllTransactions();
        return ResponseEntity.ok(ApiResponse.success("System transactions retrieved successfully", transactions));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getSuspiciousAlerts() {
        List<AuditLogResponse> alerts = staffService.getSuspiciousAlerts();
        return ResponseEntity.ok(ApiResponse.success("Suspicious alerts retrieved successfully", alerts));
    }
}
