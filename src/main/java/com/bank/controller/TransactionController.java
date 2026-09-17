package com.bank.controller;

import com.bank.dto.*;
import com.bank.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/accounts/{accountId}/deposit")
    public ResponseEntity<ApiResponse<TransactionResponse>> deposit(
            @PathVariable Long accountId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DepositRequest request) {
        TransactionResponse response = transactionService.deposit(accountId, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Deposit processed successfully", response));
    }

    @PostMapping("/accounts/{accountId}/withdraw")
    public ResponseEntity<ApiResponse<TransactionResponse>> withdraw(
            @PathVariable Long accountId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody WithdrawalRequest request) {
        TransactionResponse response = transactionService.withdraw(accountId, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Withdrawal processed successfully", response));
    }

    @PostMapping("/transactions/transfer")
    public ResponseEntity<ApiResponse<TransactionResponse>> transfer(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TransferRequest request) {
        TransactionResponse response = transactionService.transfer(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Fund transfer completed successfully", response));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<TransactionResponse> transactions = transactionService.getUserTransactions(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Transaction history retrieved successfully", transactions));
    }
}
