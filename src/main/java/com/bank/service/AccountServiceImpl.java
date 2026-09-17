package com.bank.service;

import com.bank.dto.AccountResponse;
import com.bank.dto.CreateAccountRequest;
import com.bank.entity.Account;
import com.bank.entity.User;
import com.bank.enums.AccountStatus;
import com.bank.enums.RoleType;
import com.bank.exception.ResourceNotFoundException;
import com.bank.exception.UnauthorizedException;
import com.bank.repository.AccountRepository;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    public List<AccountResponse> getUserAccounts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        List<Account> accounts = accountRepository.findByUserId(user.getId());
        return accounts.stream().map(this::mapToAccountResponse).collect(Collectors.toList());
    }

    @Override
    public AccountResponse getAccountById(Long accountId, String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "id", accountId));

        boolean isStaffOrAdmin = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleType.STAFF || r.getName() == RoleType.MANAGER || r.getName() == RoleType.ADMIN);

        if (!account.getUser().getId().equals(currentUser.getId()) && !isStaffOrAdmin) {
            throw new UnauthorizedException("You are not authorized to view details for this account");
        }

        return mapToAccountResponse(account);
    }

    @Override
    @Transactional
    public AccountResponse createAccount(String email, CreateAccountRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Account account = Account.builder()
                .accountNumber(generateUniqueAccountNumber())
                .user(user)
                .accountType(request.getAccountType())
                .balance(new BigDecimal("0.00"))
                .currency("INR")
                .status(AccountStatus.ACTIVE)
                .build();

        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
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

    private String generateUniqueAccountNumber() {
        Random random = new Random();
        String accountNumber;
        do {
            long number = 1000000000L + (long) (random.nextDouble() * 9000000000L);
            accountNumber = String.valueOf(number);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}
