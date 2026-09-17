package com.bank.service;

import com.bank.dto.AuditLogResponse;
import com.bank.entity.AuditLog;
import com.bank.entity.User;
import com.bank.exception.ResourceNotFoundException;
import com.bank.repository.AuditLogRepository;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void logAction(Long userId, String action, String description, String ipAddress) {
        AuditLog log = AuditLog.builder()
                .userId(userId)
                .action(action)
                .description(description)
                .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                .build();
        auditLogRepository.save(log);
    }

    @Override
    public List<AuditLogResponse> getUserAuditLogs(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        List<AuditLog> logs = auditLogRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return logs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<AuditLogResponse> getAllAuditLogs() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByCreatedAtDesc();
        return logs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
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
