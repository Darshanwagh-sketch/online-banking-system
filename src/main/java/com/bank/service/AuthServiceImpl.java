package com.bank.service;

import com.bank.dto.AuthResponse;
import com.bank.dto.LoginRequest;
import com.bank.dto.RegisterRequest;
import com.bank.entity.Account;
import com.bank.entity.Role;
import com.bank.entity.User;
import com.bank.enums.AccountStatus;
import com.bank.enums.AccountType;
import com.bank.enums.RoleType;
import com.bank.exception.BadRequestException;
import com.bank.exception.DuplicateResourceException;
import com.bank.exception.ResourceNotFoundException;
import com.bank.repository.AccountRepository;
import com.bank.repository.RoleRepository;
import com.bank.repository.UserRepository;
import com.bank.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email is already registered: " + registerRequest.getEmail());
        }

        if (userRepository.existsByPhone(registerRequest.getPhone())) {
            throw new DuplicateResourceException("Phone number is already registered: " + registerRequest.getPhone());
        }

        Role customerRole = roleRepository.findByName(RoleType.CUSTOMER)
                .orElseThrow(() -> new ResourceNotFoundException("Default role CUSTOMER not found in system database"));

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .phone(registerRequest.getPhone())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .dateOfBirth(registerRequest.getDateOfBirth())
                .address(registerRequest.getAddress())
                .enabled(true)
                .roles(Set.of(customerRole))
                .build();

        User savedUser = userRepository.save(user);

        // Auto-create initial default active SAVINGS account for customer
        Account initialAccount = Account.builder()
                .accountNumber(generateUniqueAccountNumber())
                .user(savedUser)
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("1000.00")) // Welcome deposit bonus simulation
                .currency("INR")
                .status(AccountStatus.ACTIVE)
                .build();
        accountRepository.save(initialAccount);

        // Authenticate new user and return token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        auditLogService.logAction(savedUser.getId(), "REGISTER", "User registered with default CUSTOMER role", "127.0.0.1");
        notificationService.createNotification(savedUser, "Welcome to SecureBank", "Your account has been created successfully with an initial savings account.", com.bank.enums.NotificationType.ACCOUNT);

        List<String> roles = savedUser.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .roles(roles)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginRequest.getEmail()));

        auditLogService.logAction(user.getId(), "LOGIN", "User logged in successfully", "127.0.0.1");

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(roles)
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
