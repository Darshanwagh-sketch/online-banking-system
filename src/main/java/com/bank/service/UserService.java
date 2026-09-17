package com.bank.service;

import com.bank.dto.ChangePasswordRequest;
import com.bank.dto.UpdateProfileRequest;
import com.bank.dto.UserProfileResponse;

public interface UserService {
    UserProfileResponse getProfile(String email);
    UserProfileResponse updateProfile(String email, UpdateProfileRequest request);
    void changePassword(String email, ChangePasswordRequest request);
}
