package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "safety_escalations")
@Data
public class SafetyEscalation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "trainer_id")
    private Long trainerId;

    @Column(name = "escalation_type", nullable = false, length = 100)
    private String escalationType; // PAIN_REPORT, REPEATED_FORM_FAULT, PLATEAU_AUDIT

    @Column(nullable = false, length = 50)
    private String severity = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(nullable = false, length = 50)
    private String status = "OPEN"; // OPEN, IN_REVIEW, RESOLVED

    @Column(name = "details_json", nullable = false, columnDefinition = "TEXT")
    private String detailsJson;

    @Column(name = "user_notes", columnDefinition = "TEXT")
    private String userNotes;

    @Column(name = "trainer_response", columnDefinition = "TEXT")
    private String trainerResponse;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
