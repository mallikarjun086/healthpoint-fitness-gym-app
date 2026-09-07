package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Physical details
    private Double heightCm;
    private Double weightKg;

    // Experience level: BEGINNER, INTERMEDIATE, ADVANCED
    @Column(nullable = false)
    private String experienceLevel;

    // Goal type: COMPETITION, AESTHETIC, STRENGTH, POWERLIFTING, SPORTS
    @Column(nullable = false)
    private String goalType;

    // Optional: only filled when goalType = SPORTS
    private String sportName;

    // Generated plan data stored as JSON text
    @Column(columnDefinition = "TEXT")
    private String workoutPlanJson;

    @Column(columnDefinition = "TEXT")
    private String dietPlanJson;

    private Double bmi;
    private Integer dailyCalories;
    private Integer dailyProtein;
    private Integer dailyCarbs;
    private Integer dailyFat;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Integer getDailyCalorieTarget() {
        return dailyCalories != null ? dailyCalories : 2650;
    }

    public Integer getDailyProteinGrams() {
        return dailyProtein != null ? dailyProtein : 185;
    }

    public Integer getDailyCarbsGrams() {
        return dailyCarbs != null ? dailyCarbs : 280;
    }

    public Integer getDailyFatGrams() {
        return dailyFat != null ? dailyFat : 65;
    }
}
