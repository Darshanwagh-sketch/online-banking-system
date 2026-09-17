package com.bank.service;

import com.bank.dto.ManagerAnalyticsResponse;
import com.bank.dto.TransactionResponse;
import com.bank.entity.Account;
import com.bank.entity.Transaction;
import com.bank.enums.TransactionStatus;
import com.bank.enums.TransactionType;
import com.bank.exception.BadRequestException;
import com.bank.exception.InsufficientBalanceException;
import com.bank.exception.ResourceNotFoundException;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Override
    public List<TransactionResponse> getPendingApprovals() {
        List<Transaction> transactions = transactionRepository.findAll();
        return transactions.stream()
                .filter(t -> t.getStatus() == TransactionStatus.PENDING)
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TransactionResponse processApproval(Long transactionId, boolean approve) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", transactionId));

        if (tx.getStatus() != TransactionStatus.PENDING) {
            throw new BadRequestException("Transaction " + tx.getTransactionReference() + " is not pending approval");
        }

        Account fromAccount = tx.getFromAccount();
        Account toAccount = tx.getToAccount();

        if (approve) {
            if (fromAccount != null && fromAccount.getBalance().compareTo(tx.getAmount()) < 0) {
                throw new InsufficientBalanceException("Sender account has insufficient balance for approval");
            }

            if (fromAccount != null) {
                fromAccount.setBalance(fromAccount.getBalance().subtract(tx.getAmount()));
                accountRepository.save(fromAccount);
            }
            if (toAccount != null) {
                toAccount.setBalance(toAccount.getBalance().add(tx.getAmount()));
                accountRepository.save(toAccount);
            }

            tx.setStatus(TransactionStatus.SUCCESS);
            auditLogService.logAction(fromAccount != null ? fromAccount.getUser().getId() : 0L, "HIGH_VALUE_APPROVAL", "Manager approved high-value transfer " + tx.getTransactionReference(), "127.0.0.1");
            if (fromAccount != null) {
                notificationService.createNotification(fromAccount.getUser(), "High-Value Transfer Approved", "Your transfer of ₹" + tx.getAmount() + " has been approved by manager.", com.bank.enums.NotificationType.TRANSACTION);
            }
        } else {
            tx.setStatus(TransactionStatus.FAILED);
            auditLogService.logAction(fromAccount != null ? fromAccount.getUser().getId() : 0L, "HIGH_VALUE_REJECTION", "Manager rejected high-value transfer " + tx.getTransactionReference(), "127.0.0.1");
            if (fromAccount != null) {
                notificationService.createNotification(fromAccount.getUser(), "High-Value Transfer Rejected", "Your transfer of ₹" + tx.getAmount() + " was rejected by manager.", com.bank.enums.NotificationType.TRANSACTION);
            }
        }

        Transaction savedTx = transactionRepository.save(tx);
        return mapToTransactionResponse(savedTx);
    }

    @Override
    public ManagerAnalyticsResponse getAnalytics() {
        List<Transaction> allTx = transactionRepository.findAll();

        BigDecimal totalVolume = allTx.stream()
                .filter(t -> t.getStatus() == TransactionStatus.SUCCESS)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal depositVolume = allTx.stream()
                .filter(t -> t.getStatus() == TransactionStatus.SUCCESS && t.getTransactionType() == TransactionType.DEPOSIT)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal withdrawVolume = allTx.stream()
                .filter(t -> t.getStatus() == TransactionStatus.SUCCESS && t.getTransactionType() == TransactionType.WITHDRAWAL)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingCount = allTx.stream().filter(t -> t.getStatus() == TransactionStatus.PENDING).count();

        return ManagerAnalyticsResponse.builder()
                .totalCustomers(userRepository.count())
                .totalAccounts(accountRepository.count())
                .totalTransactionsCount(allTx.size())
                .totalTransactionVolume(totalVolume)
                .totalDepositVolume(depositVolume)
                .totalWithdrawalVolume(withdrawVolume)
                .pendingApprovalsCount(pendingCount)
                .build();
    }

    private TransactionResponse mapToTransactionResponse(Transaction tx) {
        return TransactionResponse.builder()
                .id(tx.getId())
                .transactionReference(tx.getTransactionReference())
                .fromAccountNumber(tx.getFromAccount() != null ? tx.getFromAccount().getAccountNumber() : "N/A")
                .fromCustomerName(tx.getFromAccount() != null ? tx.getFromAccount().getUser().getName() : "EXTERNAL")
                .toAccountNumber(tx.getToAccount() != null ? tx.getToAccount().getAccountNumber() : "N/A")
                .toCustomerName(tx.getToAccount() != null ? tx.getToAccount().getUser().getName() : "EXTERNAL")
                .amount(tx.getAmount())
                .transactionType(tx.getTransactionType())
                .status(tx.getStatus())
                .description(tx.getDescription())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
