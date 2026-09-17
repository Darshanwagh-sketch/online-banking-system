package com.bank.dto;

import com.bank.enums.TransactionStatus;
import com.bank.enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private Long id;
    private String transactionReference;
    private String fromAccountNumber;
    private String fromCustomerName;
    private String toAccountNumber;
    private String toCustomerName;
    private BigDecimal amount;
    private TransactionType transactionType;
    private TransactionStatus status;
    private String description;
    private LocalDateTime createdAt;
}
