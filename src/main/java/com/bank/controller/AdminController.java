package com.bank.controller;

import com.bank.dto.ApiResponse;
import com.bank.dto.AuditLogResponse;
import com.bank.dto.RegisterRequest;
import com.bank.dto.UserProfileResponse;
import com.bank.enums.RoleType;
import com.bank.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All system users retrieved successfully", users));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserProfileResponse>> createUser(
            @Valid @RequestBody RegisterRequest request,
            @RequestParam(defaultValue = "CUSTOMER") RoleType role) {
        UserProfileResponse user = adminService.createUser(request, role);
        return new ResponseEntity<>(ApiResponse.success("User created successfully by Admin", user), HttpStatus.CREATED);
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean enabled) {
        UserProfileResponse user = adminService.updateUserStatus(userId, enabled);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", user));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<UserProfileResponse>> assignRole(
            @PathVariable Long userId,
            @RequestParam RoleType role) {
        UserProfileResponse user = adminService.assignRole(userId, role);
        return ResponseEntity.ok(ApiResponse.success("Role assigned to user successfully", user));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getFullAuditLogs() {
        List<AuditLogResponse> logs = adminService.getFullAuditLogs();
        return ResponseEntity.ok(ApiResponse.success("System audit logs retrieved successfully", logs));
    }
}
