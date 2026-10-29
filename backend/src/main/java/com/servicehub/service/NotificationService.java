package com.servicehub.service;

import com.servicehub.dto.NotificationDto;
import com.servicehub.entity.Notification;
import com.servicehub.entity.ServiceRequest;
import com.servicehub.entity.User;
import com.servicehub.exception.ResourceNotFoundException;
import com.servicehub.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(User user, ServiceRequest request, String title, String message, String type) {
        Notification notification = new Notification(user, request, title, message, type);
        return notificationRepository.save(notification);
    }

    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUser_UserIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationDto markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findByNotificationIdAndUser_UserId(notificationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found for ID: " + notificationId));

        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);
        return mapToDto(saved);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

    private NotificationDto mapToDto(Notification notification) {
        Long requestId = notification.getRequest() != null ? notification.getRequest().getRequestId() : null;
        return new NotificationDto(
                notification.getNotificationId(),
                notification.getUser().getUserId(),
                requestId,
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                Boolean.TRUE.equals(notification.getIsRead()),
                notification.getCreatedAt()
        );
    }
}
