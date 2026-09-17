package com.bank.service;

import com.bank.dto.AuditLogResponse;
import com.bank.dto.RegisterRequest;
import com.bank.dto.UserProfileResponse;
import com.bank.entity.AuditLog;
import com.bank.entity.Role;
import com.bank.entity.User;
import com.bank.enums.RoleType;
import com.bank.exception.BadRequestException;
import com.bank.exception.DuplicateResourceException;
import com.bank.exception.ResourceNotFoundException;
import com.bank.repository.AuditLogRepository;
import com.bank.repository.RoleRepository;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Override
    public List<UserProfileResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::mapToProfileResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserProfileResponse createUser(RegisterRequest request, RoleType roleType) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered: " + request.getEmail());
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone is already registered: " + request.getPhone());
        }

        Role role = roleRepository.findByName(roleType)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleType));

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .enabled(true)
                .roles(Set.of(role))
                .build();

        User savedUser = userRepository.save(user);

        auditLogService.logAction(savedUser.getId(), "ADMIN_USER_CREATE", "Admin created new user with role " + roleType, "127.0.0.1");

        return mapToProfileResponse(savedUser);
    }

    @Override
    @Transactional
    public UserProfileResponse updateUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setEnabled(enabled);
        User updatedUser = userRepository.save(user);

        auditLogService.logAction(userId, "ADMIN_USER_STATUS", "User status changed to enabled=" + enabled, "127.0.0.1");
        notificationService.createNotification(user, "Security Alert", "Your user account status was updated by system admin.", com.bank.enums.NotificationType.SECURITY);

        return mapToProfileResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserProfileResponse assignRole(Long userId, RoleType roleType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Role role = roleRepository.findByName(roleType)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleType));

        user.getRoles().add(role);
        User updatedUser = userRepository.save(user);

        auditLogService.logAction(userId, "ADMIN_ROLE_ASSIGN", "Assigned role " + roleType + " to user", "127.0.0.1");
        notificationService.createNotification(user, "Role Assigned", "You have been granted role " + roleType + " by admin.", com.bank.enums.NotificationType.ACCOUNT);

        return mapToProfileResponse(updatedUser);
    }

    @Override
    public List<AuditLogResponse> getFullAuditLogs() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByCreatedAtDesc();
        return logs.stream().map(this::mapToAuditResponse).collect(Collectors.toList());
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
