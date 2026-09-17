package com.bank.service;

import com.bank.dto.AuditLogResponse;

import java.util.List;

public interface AuditLogService {
    void logAction(Long userId, String action, String description, String ipAddress);
    List<AuditLogResponse> getUserAuditLogs(String email);
    List<AuditLogResponse> getAllAuditLogs();
}
