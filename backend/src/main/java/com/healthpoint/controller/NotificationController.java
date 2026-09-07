package com.healthpoint.controller;

import com.healthpoint.entity.Notification;
import com.healthpoint.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @PostMapping("/mark-read/{id}")
    public ResponseEntity<Map<String, String>> markRead(@PathVariable @org.springframework.lang.NonNull Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }

    @PostMapping("/mark-all-read/{userId}")
    public ResponseEntity<Map<String, String>> markAllRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All marked as read"));
    }

    @PostMapping("/send")
    public ResponseEntity<Notification> sendNotification(@RequestBody @org.springframework.lang.NonNull Notification notification) {
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }
}
