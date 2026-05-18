package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_logs")
@Data
public class WorkoutLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long workoutPlanId;

    private Integer durationSpentMinutes;
    private LocalDateTime completedAt = LocalDateTime.now();
    
    @Column(columnDefinition = "TEXT")
    private String notes;
}
