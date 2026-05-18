package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "diet_plans")
@Data
public class DietPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fat;

    private String mealType; // VEG, NON_VEG, VEGAN

    @Column(columnDefinition = "TEXT")
    private String items; // JSON or comma-separated list of items

    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean isActive = true;
}
