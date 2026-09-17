package com.bank.dto;

import com.bank.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private String title;
    private String message;
    private boolean readStatus;
    private NotificationType type;
    private LocalDateTime createdAt;
}
