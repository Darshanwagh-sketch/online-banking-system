package com.bank.service;

import com.bank.dto.AccountResponse;
import com.bank.dto.AuditLogResponse;
import com.bank.dto.TransactionResponse;
import com.bank.dto.UserProfileResponse;
import com.bank.enums.AccountStatus;

import java.util.List;

public interface StaffService {
    List<UserProfileResponse> getAllCustomers();
    List<AccountResponse> getAllAccounts();
    AccountResponse updateAccountStatus(Long accountId, AccountStatus status);
    List<TransactionResponse> getAllTransactions();
    List<AuditLogResponse> getSuspiciousAlerts();
}
