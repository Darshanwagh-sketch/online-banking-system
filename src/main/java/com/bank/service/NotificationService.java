package com.bank.service;

import com.bank.dto.NotificationResponse;
import com.bank.entity.User;
import com.bank.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    void createNotification(User user, String title, String message, NotificationType type);
    List<NotificationResponse> getUserNotifications(String email);
    void markAsRead(Long notificationId, String email);
    long getUnreadCount(String email);
}
