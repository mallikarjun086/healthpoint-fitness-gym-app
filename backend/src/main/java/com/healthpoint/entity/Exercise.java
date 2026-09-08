package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "exercises")
@Data
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String primaryMuscleGroup; // CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, FOREARMS, CORE, GLUTES, QUADS, HAMSTRINGS, CALVES, COMPOUND
    private String secondaryMuscleGroups;
    private String equipmentRequired; // Barbell, Dumbbells, Cables, Machine, Bodyweight, Kettlebell
    private String difficulty; // BEGINNER, INTERMEDIATE, ADVANCED
    private String category; // STRENGTH, CARDIO, MOBILITY, CORE, HOME_WORKOUT, HIIT

    @Column(columnDefinition = "TEXT")
    private String instructions;

    private String animatedDemoReference; // e.g., "bench-press", "squat-olympic", "deadlift-conventional"

    @Column(columnDefinition = "TEXT")
    private String safeJointAngleRanges; // JSON string with biomechanical safe ranges

    @Column(columnDefinition = "TEXT")
    private String commonMistakes;

    private String tempo; // e.g. "3-0-1-0"
    private Integer sets;
    private Integer reps;
    private String restTime;
    private String muscleImpact; // e.g., "Pectoralis Major, Anterior Deltoid"
    
    @Column(columnDefinition = "TEXT")
    private String formCues;
    
    private String videoUrl;
    private String thumbnailUrl;
}
