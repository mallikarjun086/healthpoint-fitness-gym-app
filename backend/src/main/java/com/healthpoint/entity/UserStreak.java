package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_streaks")
@Data
public class UserStreak {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "current_streak", nullable = false)
    private int currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    private int longestStreak = 0;

    @Column(name = "total_workouts_completed", nullable = false)
    private int totalWorkoutsCompleted = 0;

    @Column(name = "last_activity_date")
    private LocalDate lastActivityDate;

    @Column(name = "is_frozen")
    private Boolean isFrozen = false;

    @Column(name = "frozen_date")
    private LocalDate frozenDate;

    @Column(name = "freeze_reason", length = 255)
    private String freezeReason;

    @Column(name = "consistency_index")
    private Double consistencyIndex = 85.0; // Adherence percentage (0-100)

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
