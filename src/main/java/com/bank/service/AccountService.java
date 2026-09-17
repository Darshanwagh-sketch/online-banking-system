package com.bank.service;

import com.bank.dto.AccountResponse;
import com.bank.dto.CreateAccountRequest;

import java.util.List;

public interface AccountService {
    List<AccountResponse> getUserAccounts(String email);
    AccountResponse getAccountById(Long accountId, String currentUserEmail);
    AccountResponse createAccount(String email, CreateAccountRequest request);
}
