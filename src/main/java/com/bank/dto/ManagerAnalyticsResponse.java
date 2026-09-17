package com.bank.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManagerAnalyticsResponse {

    private long totalCustomers;
    private long totalAccounts;
    private long totalTransactionsCount;
    private BigDecimal totalTransactionVolume;
    private BigDecimal totalDepositVolume;
    private BigDecimal totalWithdrawalVolume;
    private long pendingApprovalsCount;
}
