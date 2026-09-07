package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "diet_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String title;

    private String description;

    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fat;

    @Column(name = "meal_type")
    private String mealType = "VEG"; // VEG, NON_VEG, VEGAN

    @Column(columnDefinition = "TEXT")
    private String items;

    @Column(name = "meal_schedule_json", columnDefinition = "TEXT")
    private String mealScheduleJson;

    @Column(name = "is_ai_generated")
    private Boolean isAiGenerated = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_active")
    private boolean isActive = true;
}

