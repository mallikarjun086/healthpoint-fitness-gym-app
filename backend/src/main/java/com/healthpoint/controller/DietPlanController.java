package com.healthpoint.controller;

import com.healthpoint.entity.DietPlan;
import com.healthpoint.service.DietPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diet")
public class DietPlanController {

    private final DietPlanService dietPlanService;

    public DietPlanController(DietPlanService dietPlanService) {
        this.dietPlanService = dietPlanService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<DietPlan>> getActivePlans() {
        return ResponseEntity.ok(dietPlanService.getAllActivePlans());
    }

    @PostMapping("/create")
    public ResponseEntity<DietPlan> createPlan(@RequestBody @NonNull DietPlan plan) {
        return ResponseEntity.ok(dietPlanService.savePlan(plan));
    }
}
