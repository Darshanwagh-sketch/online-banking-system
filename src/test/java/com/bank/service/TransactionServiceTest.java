package com.bank.service;

import com.bank.dto.DepositRequest;
import com.bank.dto.TransactionResponse;
import com.bank.dto.TransferRequest;
import com.bank.dto.WithdrawalRequest;
import com.bank.entity.Account;
import com.bank.entity.Transaction;
import com.bank.entity.User;
import com.bank.enums.AccountStatus;
import com.bank.enums.AccountType;
import com.bank.enums.RoleType;
import com.bank.enums.TransactionStatus;
import com.bank.exception.InsufficientBalanceException;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import com.bank.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private AccountRepository accountRepository;
    @Mock
    private TransactionRepository transactionRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AuditLogService auditLogService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private User user1;
    private User user2;
    private Account account1;
    private Account account2;

    @BeforeEach
    void setUp() {
        user1 = User.builder().id(1L).email("user1@example.com").name("User One").roles(Set.of()).build();
        user2 = User.builder().id(2L).email("user2@example.com").name("User Two").roles(Set.of()).build();

        account1 = Account.builder()
                .id(10L)
                .accountNumber("1001111111")
                .user(user1)
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("5000.00"))
                .status(AccountStatus.ACTIVE)
                .build();

        account2 = Account.builder()
                .id(20L)
                .accountNumber("1002222222")
                .user(user2)
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("2000.00"))
                .status(AccountStatus.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("Should successfully process cash deposit")
    void deposit_Success() {
        when(userRepository.findByEmail("user1@example.com")).thenReturn(Optional.of(user1));
        when(accountRepository.findById(10L)).thenReturn(Optional.of(account1));
        when(accountRepository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));

        Transaction savedTx = Transaction.builder()
                .id(100L)
                .transactionReference("TXN123456")
                .toAccount(account1)
                .amount(new BigDecimal("1000.00"))
                .transactionType(com.bank.enums.TransactionType.DEPOSIT)
                .status(TransactionStatus.SUCCESS)
                .build();
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTx);

        DepositRequest request = new DepositRequest(new BigDecimal("1000.00"), "Deposit test");
        TransactionResponse response = transactionService.deposit(10L, "user1@example.com", request);

        assertNotNull(response);
        assertEquals(new BigDecimal("6000.00"), account1.getBalance());
        verify(accountRepository, times(1)).save(account1);
    }

    @Test
    @DisplayName("Should throw InsufficientBalanceException when withdrawal amount exceeds balance")
    void withdraw_InsufficientBalance_ThrowsException() {
        when(userRepository.findByEmail("user1@example.com")).thenReturn(Optional.of(user1));
        when(accountRepository.findById(10L)).thenReturn(Optional.of(account1));

        WithdrawalRequest request = new WithdrawalRequest(new BigDecimal("10000.00"), "ATM Excess Withdraw");

        assertThrows(InsufficientBalanceException.class, () ->
                transactionService.withdraw(10L, "user1@example.com", request)
        );

        assertEquals(new BigDecimal("5000.00"), account1.getBalance());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully transfer funds between two accounts")
    void transfer_Success() {
        when(userRepository.findByEmail("user1@example.com")).thenReturn(Optional.of(user1));
        when(accountRepository.findByAccountNumber("1001111111")).thenReturn(Optional.of(account1));
        when(accountRepository.findByAccountNumber("1002222222")).thenReturn(Optional.of(account2));

        Transaction savedTx = Transaction.builder()
                .id(200L)
                .transactionReference("TXN789012")
                .fromAccount(account1)
                .toAccount(account2)
                .amount(new BigDecimal("1500.00"))
                .transactionType(com.bank.enums.TransactionType.TRANSFER)
                .status(TransactionStatus.SUCCESS)
                .build();
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTx);

        TransferRequest request = new TransferRequest("1001111111", "1002222222", new BigDecimal("1500.00"), "Rent payment");
        TransactionResponse response = transactionService.transfer("user1@example.com", request);

        assertNotNull(response);
        assertEquals(new BigDecimal("3500.00"), account1.getBalance());
        assertEquals(new BigDecimal("3500.00"), account2.getBalance());

        verify(accountRepository, times(1)).save(account1);
        verify(accountRepository, times(1)).save(account2);
    }
}
