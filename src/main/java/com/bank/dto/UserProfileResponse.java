package com.bank.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String address;
    private boolean enabled;
    private List<String> roles;
    private LocalDateTime createdAt;
}
