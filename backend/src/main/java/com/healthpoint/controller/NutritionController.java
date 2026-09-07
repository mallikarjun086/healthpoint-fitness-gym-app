package com.healthpoint.controller;

import com.healthpoint.entity.FoodItem;
import com.healthpoint.entity.FoodLog;
import com.healthpoint.service.NutritionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nutrition")
public class NutritionController {

    private final NutritionService nutritionService;

    public NutritionController(NutritionService nutritionService) {
        this.nutritionService = nutritionService;
    }

    @GetMapping("/food-items")
    public ResponseEntity<List<FoodItem>> searchFoods(@RequestParam(required = false, defaultValue = "") String query) {
        return ResponseEntity.ok(nutritionService.searchFood(query));
    }

    @GetMapping("/summary/user/{userId}")
    public ResponseEntity<Map<String, Object>> getDailySummary(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(nutritionService.getDailyNutritionSummary(userId, date));
    }

    @PostMapping("/log")
    public ResponseEntity<FoodLog> logFood(@RequestBody FoodLog foodLog) {
        return ResponseEntity.ok(nutritionService.logFood(foodLog));
    }

    @DeleteMapping("/log/{id}")
    public ResponseEntity<Void> deleteFoodLog(@PathVariable @org.springframework.lang.NonNull Long id) {
        nutritionService.deleteFoodLog(id);
        return ResponseEntity.ok().build();
    }
}
