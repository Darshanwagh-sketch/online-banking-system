package com.bank.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WithdrawalRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Withdrawal amount must be greater than zero")
    private BigDecimal amount;

    private String description;
}
