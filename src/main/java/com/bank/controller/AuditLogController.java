package com.bank.controller;

import com.bank.dto.ApiResponse;
import com.bank.dto.AuditLogResponse;
import com.bank.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getMyAuditLogs(@AuthenticationPrincipal UserDetails userDetails) {
        List<AuditLogResponse> logs = auditLogService.getUserAuditLogs(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved successfully", logs));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAllAuditLogs() {
        List<AuditLogResponse> logs = auditLogService.getAllAuditLogs();
        return ResponseEntity.ok(ApiResponse.success("All audit logs retrieved successfully", logs));
    }
}
