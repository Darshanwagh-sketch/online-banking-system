package com.bank.service;

import com.bank.dto.AuditLogResponse;
import com.bank.dto.RegisterRequest;
import com.bank.dto.UserProfileResponse;
import com.bank.enums.RoleType;

import java.util.List;

public interface AdminService {
    List<UserProfileResponse> getAllUsers();
    UserProfileResponse createUser(RegisterRequest request, RoleType roleType);
    UserProfileResponse updateUserStatus(Long userId, boolean enabled);
    UserProfileResponse assignRole(Long userId, RoleType roleType);
    List<AuditLogResponse> getFullAuditLogs();
}
