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

    private Integer sets;
    private Integer reps;
    private String restTime;
    private String videoUrl;
    private String muscleImpact; // e.g., "Pectorals, Triceps, Deltoids"
    @Column(columnDefinition = "TEXT")
    private String formCues; // e.g., "Keep your elbows at 45 degrees..."
}
