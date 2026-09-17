package com.bank.service;

import com.bank.dto.ChangePasswordRequest;
import com.bank.dto.UpdateProfileRequest;
import com.bank.dto.UserProfileResponse;
import com.bank.entity.User;
import com.bank.exception.BadRequestException;
import com.bank.exception.DuplicateResourceException;
import com.bank.exception.ResourceNotFoundException;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToProfileResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (!user.getPhone().equals(request.getPhone()) && userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number is already in use by another account");
        }

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setAddress(request.getAddress());

        User updatedUser = userRepository.save(user);
        return mapToProfileResponse(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BadRequestException("New password and confirm password do not match");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password provided is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
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
}
