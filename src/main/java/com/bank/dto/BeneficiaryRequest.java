package com.bank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeneficiaryRequest {

    @NotBlank(message = "Beneficiary name is required")
    @Size(min = 2, max = 100, message = "Beneficiary name must be between 2 and 100 characters")
    private String beneficiaryName;

    @NotBlank(message = "Account number is required")
    @Pattern(regexp = "^[0-9]{10,20}$", message = "Account number must be between 10 and 20 digits")
    private String accountNumber;

    @Size(max = 100, message = "Bank name cannot exceed 100 characters")
    private String bankName;

    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC Code format (e.g. SBIN0001234)")
    private String ifscCode;
}
