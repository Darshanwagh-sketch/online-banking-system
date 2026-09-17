package com.bank.dto;

import com.bank.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportTicketRequest {

    @NotBlank(message = "Subject is required")
    @Size(min = 5, max = 150, message = "Subject must be between 5 and 150 characters")
    private String subject;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    @Builder.Default
    private TicketPriority priority = TicketPriority.MEDIUM;
}
