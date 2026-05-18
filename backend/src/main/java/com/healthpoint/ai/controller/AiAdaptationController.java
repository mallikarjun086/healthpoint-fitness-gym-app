package com.healthpoint.ai.controller;

import com.healthpoint.ai.adaptation.WorkoutAdaptationResponse;
import com.healthpoint.ai.adaptation.WorkoutAdaptationService;
import com.healthpoint.ai.security.AiSecurityUtil;
import com.healthpoint.service.GoalPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai/adapt")
public class AiAdaptationController {

    private final WorkoutAdaptationService workoutAdaptationService;
    private final AiSecurityUtil securityUtil;
    private final GoalPlanService goalPlanService;

    public AiAdaptationController(WorkoutAdaptationService workoutAdaptationService, AiSecurityUtil securityUtil, GoalPlanService goalPlanService) {
        this.workoutAdaptationService = workoutAdaptationService;
        this.securityUtil = securityUtil;
        this.goalPlanService = goalPlanService;
    }

    @PostMapping("/workout")
    public ResponseEntity<WorkoutAdaptationResponse> adaptWorkout(@RequestBody String request) {
        Long userId = securityUtil.getAuthenticatedUserId();
        WorkoutAdaptationResponse response = workoutAdaptationService.adaptWorkout(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/workout/apply")
    public ResponseEntity<Map<String, String>> applyAdaptation(@RequestBody String workoutJson) {
        Long userId = securityUtil.getAuthenticatedUserId();
        goalPlanService.updateWorkoutPlanFromJson(userId, workoutJson);
        return ResponseEntity.ok(Map.of("message", "Workout plan adapted and saved successfully"));
    }
}
