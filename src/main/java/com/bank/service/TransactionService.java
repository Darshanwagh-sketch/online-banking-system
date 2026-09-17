package com.bank.service;

import com.bank.dto.DepositRequest;
import com.bank.dto.TransactionResponse;
import com.bank.dto.TransferRequest;
import com.bank.dto.WithdrawalRequest;
import org.springframework.data.domain.Page;

public interface TransactionService {
    TransactionResponse deposit(Long accountId, String userEmail, DepositRequest request);
    TransactionResponse withdraw(Long accountId, String userEmail, WithdrawalRequest request);
    TransactionResponse transfer(String userEmail, TransferRequest request);
    Page<TransactionResponse> getUserTransactions(String userEmail, int page, int size);
}
