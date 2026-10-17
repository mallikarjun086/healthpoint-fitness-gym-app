package com.healthpoint.controller;

import com.healthpoint.entity.ClassBooking;
import com.healthpoint.entity.ClassSession;
import com.healthpoint.service.ClassSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
public class ClassSessionController {

    private final ClassSessionService classSessionService;

    public ClassSessionController(ClassSessionService classSessionService) {
        this.classSessionService = classSessionService;
    }

    @GetMapping
    public ResponseEntity<List<ClassSession>> getAllSessions() {
        return ResponseEntity.ok(classSessionService.getUpcomingSessions());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<ClassSession>> getUpcomingSessions() {
        return ResponseEntity.ok(classSessionService.getUpcomingSessions());
    }

    @GetMapping("/my-bookings/user/{userId}")
    public ResponseEntity<List<ClassBooking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(classSessionService.getUserBookings(userId));
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookClass(
            @RequestBody(required = false) Map<String, Object> payload,
            org.springframework.security.core.Authentication auth) {
        try {
            Long requestedUserId = null;
            if (payload != null && payload.get("userId") != null) {
                try {
                    requestedUserId = Long.valueOf(payload.get("userId").toString());
                } catch (Exception ignored) {}
            }
            Long userId = com.healthpoint.util.SecurityUtil.resolveUserId(auth, requestedUserId);
            if (payload == null || payload.get("classSessionId") == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "classSessionId is required"));
            }
            Long classSessionId = Long.valueOf(payload.get("classSessionId").toString());
            ClassBooking booking = classSessionService.bookSession(userId, classSessionId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cancel/{bookingId}")
    public ResponseEntity<Map<String, String>> cancelBooking(@PathVariable Long bookingId) {
        try {
            classSessionService.cancelBooking(bookingId);
            return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ClassSession> createSession(@RequestBody ClassSession session) {
        return ResponseEntity.ok(classSessionService.createSession(session));
    }
}
