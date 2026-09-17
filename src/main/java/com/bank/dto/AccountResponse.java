package com.bank.dto;

import com.bank.enums.AccountStatus;
import com.bank.enums.AccountType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse {

    private Long id;
    private String accountNumber;
    private Long customerId;
    private String customerName;
    private AccountType accountType;
    private BigDecimal balance;
    private String currency;
    private AccountStatus status;
    private LocalDateTime createdAt;
}
