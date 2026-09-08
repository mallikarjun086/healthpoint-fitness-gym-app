package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "challenges")
@Data
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String code;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String category = "CONSISTENCY"; // SQUAT, CONSISTENCY, VOLUME, MOBILITY

    @Column(name = "target_metric", nullable = false, length = 100)
    private String targetMetric; // SQUATS_COMPLETED, DAYS_ACTIVE, VOLUME_KG

    @Column(name = "target_value", nullable = false)
    private int targetValue;

    @Column(name = "duration_days", nullable = false)
    private int durationDays = 30;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "reward_badge_code", length = 100)
    private String rewardBadgeCode;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
