package com.bank.service;

import com.bank.dto.AccountResponse;
import com.bank.dto.AuditLogResponse;
import com.bank.dto.TransactionResponse;
import com.bank.dto.UserProfileResponse;
import com.bank.entity.Account;
import com.bank.entity.AuditLog;
import com.bank.entity.Transaction;
import com.bank.entity.User;
import com.bank.enums.AccountStatus;
import com.bank.enums.RoleType;
import com.bank.exception.ResourceNotFoundException;
import com.bank.repository.AccountRepository;
import com.bank.repository.AuditLogRepository;
import com.bank.repository.TransactionRepository;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Override
    public List<UserProfileResponse> getAllCustomers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName() == RoleType.CUSTOMER))
                .map(this::mapToProfileResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccountResponse> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream().map(this::mapToAccountResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AccountResponse updateAccountStatus(Long accountId, AccountStatus status) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));

        account.setStatus(status);
        Account savedAccount = accountRepository.save(account);

        auditLogService.logAction(account.getUser().getId(), "ACCOUNT_STATUS_CHANGE", "Account " + account.getAccountNumber() + " status changed to " + status, "127.0.0.1");
        notificationService.createNotification(account.getUser(), "Account Status Update", "Your account " + account.getAccountNumber() + " is now " + status, com.bank.enums.NotificationType.ACCOUNT);

        return mapToAccountResponse(savedAccount);
    }

    @Override
    public List<TransactionResponse> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return transactions.stream().map(this::mapToTransactionResponse).collect(Collectors.toList());
    }

    @Override
    public List<AuditLogResponse> getSuspiciousAlerts() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByCreatedAtDesc();
        return logs.stream()
                .filter(l -> l.getAction().contains("TRANSFER") || l.getAction().contains("STATUS") || l.getAction().contains("SECURITY"))
                .map(this::mapToAuditResponse)
                .collect(Collectors.toList());
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .dateOfBirth(user.getDateOfBirth())
                .address(user.getAddress())
                .enabled(user.isEnabled())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }

    private AccountResponse mapToAccountResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .customerId(account.getUser().getId())
                .customerName(account.getUser().getName())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .status(account.getStatus())
                .createdAt(account.getCreatedAt())
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

    private AuditLogResponse mapToAuditResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .action(log.getAction())
                .description(log.getDescription())
                .ipAddress(log.getIpAddress())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
