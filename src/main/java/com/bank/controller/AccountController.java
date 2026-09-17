package com.bank.controller;

import com.bank.dto.AccountResponse;
import com.bank.dto.ApiResponse;
import com.bank.dto.CreateAccountRequest;
import com.bank.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getCustomerAccounts(@AuthenticationPrincipal UserDetails userDetails) {
        List<AccountResponse> accounts = accountService.getUserAccounts(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Accounts retrieved successfully", accounts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        AccountResponse account = accountService.getAccountById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Account details retrieved successfully", account));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateAccountRequest request) {
        AccountResponse account = accountService.createAccount(userDetails.getUsername(), request);
        return new ResponseEntity<>(ApiResponse.success("Account created successfully", account), HttpStatus.CREATED);
    }
}
