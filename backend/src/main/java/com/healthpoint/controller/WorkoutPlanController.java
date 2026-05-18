package com.healthpoint.controller;

import com.healthpoint.entity.WorkoutPlan;
import com.healthpoint.service.WorkoutPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout")
public class WorkoutPlanController {

    private final WorkoutPlanService workoutPlanService;

    public WorkoutPlanController(WorkoutPlanService workoutPlanService) {
        this.workoutPlanService = workoutPlanService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<WorkoutPlan>> getActivePlans() {
        return ResponseEntity.ok(workoutPlanService.getAllActivePlans());
    }

    @PostMapping("/create")
    public ResponseEntity<WorkoutPlan> createPlan(@RequestBody @NonNull WorkoutPlan plan) {
        return ResponseEntity.ok(workoutPlanService.savePlan(plan));
    }
}
