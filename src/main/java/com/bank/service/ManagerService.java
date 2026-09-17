package com.bank.service;

import com.bank.dto.ManagerAnalyticsResponse;
import com.bank.dto.TransactionResponse;

import java.util.List;

public interface ManagerService {
    List<TransactionResponse> getPendingApprovals();
    TransactionResponse processApproval(Long transactionId, boolean approve);
    ManagerAnalyticsResponse getAnalytics();
}
