package com.servicehub.controller;

import com.servicehub.dto.NotificationDto;
import com.servicehub.entity.User;
import com.servicehub.service.AuthService;
import com.servicehub.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    public NotificationController(NotificationService notificationService, AuthService authService) {
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getMyNotifications(Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        List<NotificationDto> notifications = notificationService.getUserNotifications(user.getUserId());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        long count = notificationService.getUnreadCount(user.getUserId());
        return ResponseEntity.ok(Collections.singletonMap("unreadCount", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long id, Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        NotificationDto updated = notificationService.markAsRead(id, user.getUserId());
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Principal principal) {
        User user = authService.getUserByEmail(principal.getName());
        notificationService.markAllAsRead(user.getUserId());
        return ResponseEntity.ok(Collections.singletonMap("message", "All notifications marked as read"));
    }
}
