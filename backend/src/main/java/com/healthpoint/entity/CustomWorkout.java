package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "custom_workouts")
@Data
public class CustomWorkout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String difficulty = "INTERMEDIATE";
    private String category = "STRENGTH";
    private String targetMuscleGroup;
    private Integer estimatedDurationMinutes = 45;

    @Column(columnDefinition = "TEXT")
    private String workoutDataJson; // JSON array of sequenced exercises, sets, reps, weight_target, rest_sec

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
