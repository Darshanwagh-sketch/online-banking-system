package com.bank.dto;

import com.bank.enums.TicketPriority;
import com.bank.enums.TicketStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportTicketResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String subject;
    private String description;
    private TicketStatus status;
    private TicketPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
