package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "food_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer calories;

    @Column(name = "protein_grams")
    private Double proteinGrams = 0.0;

    @Column(name = "carbs_grams")
    private Double carbsGrams = 0.0;

    @Column(name = "fat_grams")
    private Double fatGrams = 0.0;

    @Column(name = "serving_size")
    private String servingSize = "100g";

    private String category = "General";

    @Column(name = "is_vegetarian")
    private Boolean isVegetarian = true;
}
