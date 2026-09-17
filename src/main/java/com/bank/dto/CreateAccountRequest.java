package com.bank.dto;

import com.bank.enums.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAccountRequest {

    @NotNull(message = "Account type is required (SAVINGS or CURRENT)")
    private AccountType accountType;
}
