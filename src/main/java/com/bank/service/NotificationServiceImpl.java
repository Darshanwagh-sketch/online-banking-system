package com.bank.service;

import com.bank.dto.NotificationResponse;
import com.bank.entity.Notification;
import com.bank.entity.User;
import com.bank.enums.NotificationType;
import com.bank.exception.ResourceNotFoundException;
import com.bank.exception.UnauthorizedException;
import com.bank.repository.NotificationRepository;
import com.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .readStatus(false)
                .build();
        Notification savedNotification = notificationRepository.save(notification);

        // Real-time WebSocket push to subscribed frontend client
        try {
            NotificationResponse response = mapToResponse(savedNotification);
            messagingTemplate.convertAndSend("/topic/users/" + user.getId() + "/notifications", response);
        } catch (Exception ex) {
            // Log & catch silently if no WS listeners attached
        }
    }

    @Override
    public List<NotificationResponse> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return notifications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only modify your own notifications");
        }

        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }

    @Override
    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return notificationRepository.countByUserIdAndReadStatusFalse(user.getId());
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .readStatus(notification.isReadStatus())
                .type(notification.getType())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
