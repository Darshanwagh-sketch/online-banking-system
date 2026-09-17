package com.bank.service;

import com.bank.dto.AuthResponse;
import com.bank.dto.RegisterRequest;
import com.bank.entity.Role;
import com.bank.entity.User;
import com.bank.enums.RoleType;
import com.bank.exception.BadRequestException;
import com.bank.exception.DuplicateResourceException;
import com.bank.repository.AccountRepository;
import com.bank.repository.RoleRepository;
import com.bank.repository.UserRepository;
import com.bank.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private AccountRepository accountRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private AuditLogService auditLogService;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private Role customerRole;

    @BeforeEach
    void setUp() {
        customerRole = Role.builder().id(1L).name(RoleType.CUSTOMER).build();

        registerRequest = RegisterRequest.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phone("9876543210")
                .password("Password@123")
                .confirmPassword("Password@123")
                .dateOfBirth(LocalDate.of(1995, 5, 15))
                .address("123 Test Street")
                .build();
    }

    @Test
    @DisplayName("Should successfully register new customer user")
    void register_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByPhone(anyString())).thenReturn(false);
        when(roleRepository.findByName(RoleType.CUSTOMER)).thenReturn(Optional.of(customerRole));
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");

        User savedUser = User.builder()
                .id(1L)
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .phone(registerRequest.getPhone())
                .password("hashedPassword")
                .roles(Set.of(customerRole))
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(any())).thenReturn("mockJwtToken");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("john.doe@example.com", response.getEmail());
        assertTrue(response.getRoles().contains("CUSTOMER"));

        verify(userRepository, times(1)).save(any(User.class));
        verify(accountRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Should throw BadRequestException when passwords mismatch")
    void register_PasswordMismatch_ThrowsException() {
        registerRequest.setConfirmPassword("DifferentPassword@123");

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email exists")
    void register_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }
}
