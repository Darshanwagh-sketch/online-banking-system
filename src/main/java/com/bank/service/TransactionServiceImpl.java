package com.bank.service;

import com.bank.dto.DepositRequest;
import com.bank.dto.TransactionResponse;
import com.bank.dto.TransferRequest;
import com.bank.dto.WithdrawalRequest;
import com.bank.entity.Account;
import com.bank.entity.Transaction;
import com.bank.entity.User;
import com.bank.enums.AccountStatus;
import com.bank.enums.RoleType;
import com.bank.enums.TransactionStatus;
import com.bank.enums.TransactionType;
import com.bank.exception.BadRequestException;
import com.bank.exception.InsufficientBalanceException;
import com.bank.exception.ResourceNotFoundException;
import com.bank.exception.UnauthorizedException;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public TransactionResponse deposit(Long accountId, String userEmail, DepositRequest request) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));

        validateAccountOwnershipOrStaff(account, currentUser);
        validateAccountIsActive(account);

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionReference(generateTransactionReference())
                .fromAccount(null)
                .toAccount(account)
                .amount(request.getAmount())
                .transactionType(TransactionType.DEPOSIT)
                .status(TransactionStatus.SUCCESS)
                .description(request.getDescription() != null ? request.getDescription() : "Simulated Cash Deposit")
                .build();

        Transaction savedTx = transactionRepository.save(transaction);

        auditLogService.logAction(currentUser.getId(), "DEPOSIT", "Deposited ₹" + request.getAmount() + " to account " + account.getAccountNumber(), "127.0.0.1");
        notificationService.createNotification(account.getUser(), "Deposit Successful", "₹" + request.getAmount() + " deposited to account " + account.getAccountNumber(), com.bank.enums.NotificationType.TRANSACTION);

        TransactionResponse response = mapToTransactionResponse(savedTx);
        broadcastTransactionUpdate(account.getAccountNumber(), response);
        return response;
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(Long accountId, String userEmail, WithdrawalRequest request) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));

        validateAccountOwnershipOrStaff(account, currentUser);
        validateAccountIsActive(account);

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient account balance. Available: ₹" + account.getBalance());
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionReference(generateTransactionReference())
                .fromAccount(account)
                .toAccount(null)
                .amount(request.getAmount())
                .transactionType(TransactionType.WITHDRAWAL)
                .status(TransactionStatus.SUCCESS)
                .description(request.getDescription() != null ? request.getDescription() : "Simulated ATM Withdrawal")
                .build();

        Transaction savedTx = transactionRepository.save(transaction);

        auditLogService.logAction(currentUser.getId(), "WITHDRAWAL", "Withdrew ₹" + request.getAmount() + " from account " + account.getAccountNumber(), "127.0.0.1");
        notificationService.createNotification(account.getUser(), "Withdrawal Successful", "₹" + request.getAmount() + " withdrawn from account " + account.getAccountNumber(), com.bank.enums.NotificationType.TRANSACTION);

        TransactionResponse txResponse = mapToTransactionResponse(savedTx);
        broadcastTransactionUpdate(account.getAccountNumber(), txResponse);
        return txResponse;
    }

    @Override
    @Transactional
    public TransactionResponse transfer(String userEmail, TransferRequest request) {
        if (request.getFromAccountNumber().equals(request.getToAccountNumber())) {
            throw new BadRequestException("Sender and Receiver account numbers cannot be the same");
        }

        User sender = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Source Account", "accountNumber", request.getFromAccountNumber()));

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Destination Account", "accountNumber", request.getToAccountNumber()));

        validateAccountOwnershipOrStaff(fromAccount, sender);
        validateAccountIsActive(fromAccount);
        validateAccountIsActive(toAccount);

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient account balance in source account. Available: ₹" + fromAccount.getBalance());
        }

        boolean isHighValue = request.getAmount().compareTo(new BigDecimal("100000.00")) > 0;
        TransactionStatus txStatus = isHighValue ? TransactionStatus.PENDING : TransactionStatus.SUCCESS;

        if (!isHighValue) {
            fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
            toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));
            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
        }

        Transaction transaction = Transaction.builder()
                .transactionReference(generateTransactionReference())
                .fromAccount(fromAccount)
                .toAccount(toAccount)
                .amount(request.getAmount())
                .transactionType(TransactionType.TRANSFER)
                .status(txStatus)
                .description(request.getDescription() != null ? request.getDescription() : (isHighValue ? "High-Value Transfer (Pending Approval)" : "Internal Funds Transfer"))
                .build();

        Transaction savedTx = transactionRepository.save(transaction);

        if (isHighValue) {
            auditLogService.logAction(sender.getId(), "HIGH_VALUE_TRANSFER_SUBMITTED", "Transferred ₹" + request.getAmount() + " (Pending Manager Approval)", "127.0.0.1");
            notificationService.createNotification(sender, "Transfer Pending Approval", "High-value transfer of ₹" + request.getAmount() + " requires manager approval.", com.bank.enums.NotificationType.TRANSACTION);
        } else {
            auditLogService.logAction(sender.getId(), "TRANSFER", "Transferred ₹" + request.getAmount() + " from " + fromAccount.getAccountNumber() + " to " + toAccount.getAccountNumber(), "127.0.0.1");
            notificationService.createNotification(sender, "Transfer Debit", "₹" + request.getAmount() + " transferred to account " + toAccount.getAccountNumber(), com.bank.enums.NotificationType.TRANSACTION);
            notificationService.createNotification(toAccount.getUser(), "Transfer Credit", "₹" + request.getAmount() + " received from account " + fromAccount.getAccountNumber(), com.bank.enums.NotificationType.TRANSACTION);
        }

        TransactionResponse response = mapToTransactionResponse(savedTx);
        broadcastTransactionUpdate(fromAccount.getAccountNumber(), response);
        broadcastTransactionUpdate(toAccount.getAccountNumber(), response);

        return response;
    }

    private void broadcastTransactionUpdate(String accountNumber, TransactionResponse response) {
        try {
            messagingTemplate.convertAndSend("/topic/accounts/" + accountNumber + "/transactions", response);
        } catch (Exception ex) {
            // Ignore if no WebSocket client is connected
        }
    }

    @Override
    public Page<TransactionResponse> getUserTransactions(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Pageable pageable = PageRequest.of(page, size);
        Page<Transaction> transactions = transactionRepository.findByUserId(user.getId(), pageable);
        return transactions.map(this::mapToTransactionResponse);
    }

    private void validateAccountOwnershipOrStaff(Account account, User user) {
        boolean isStaffOrAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleType.STAFF || r.getName() == RoleType.MANAGER || r.getName() == RoleType.ADMIN);

        if (!account.getUser().getId().equals(user.getId()) && !isStaffOrAdmin) {
            throw new UnauthorizedException("You are not authorized to perform operations on this account");
        }
    }

    private void validateAccountIsActive(Account account) {
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Account " + account.getAccountNumber() + " is " + account.getStatus() + " and cannot process transactions");
        }
    }

    private String generateTransactionReference() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int randomDigits = 1000 + new Random().nextInt(9000);
        return "TXN" + timestamp + randomDigits;
    }

    private TransactionResponse mapToTransactionResponse(Transaction tx) {
        return TransactionResponse.builder()
                .id(tx.getId())
                .transactionReference(tx.getTransactionReference())
                .fromAccountNumber(tx.getFromAccount() != null ? tx.getFromAccount().getAccountNumber() : "N/A")
                .fromCustomerName(tx.getFromAccount() != null ? tx.getFromAccount().getUser().getName() : "EXTERNAL / CASH")
                .toAccountNumber(tx.getToAccount() != null ? tx.getToAccount().getAccountNumber() : "N/A")
                .toCustomerName(tx.getToAccount() != null ? tx.getToAccount().getUser().getName() : "EXTERNAL / CASH")
                .amount(tx.getAmount())
                .transactionType(tx.getTransactionType())
                .status(tx.getStatus())
                .description(tx.getDescription())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
