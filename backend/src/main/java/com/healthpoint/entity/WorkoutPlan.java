package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_plans")
@Data
public class WorkoutPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private String difficulty; // BEGINNER, INTERMEDIATE, ADVANCED
    private Integer durationMinutes;
    private String bodyPart; // FULL_BODY, CHEST, LEGS, etc.

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "workout_plan_id")
    private List<Exercise> exercises = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean isActive = true;
}
