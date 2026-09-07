package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(name = "meal_type", nullable = false)
    private String mealType = "BREAKFAST"; // BREAKFAST, LUNCH, SNACK, DINNER

    @Column(nullable = false)
    private Integer calories;

    @Column(name = "protein_grams")
    private Double proteinGrams = 0.0;

    @Column(name = "carbs_grams")
    private Double carbsGrams = 0.0;

    @Column(name = "fat_grams")
    private Double fatGrams = 0.0;

    private Double quantity = 1.0;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate = LocalDate.now();

    @Column(name = "logged_at")
    private LocalDateTime loggedAt = LocalDateTime.now();
}
