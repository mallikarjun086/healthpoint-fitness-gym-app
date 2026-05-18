package com.healthpoint.controller;

import com.healthpoint.dto.GoalProfileRequest;
import com.healthpoint.entity.UserProfile;
import com.healthpoint.service.GoalPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
public class GoalProfileController {

    private final GoalPlanService goalPlanService;

    public GoalProfileController(GoalPlanService goalPlanService) {
        this.goalPlanService = goalPlanService;
    }

    @PostMapping("/setup")
    public ResponseEntity<?> setupGoal(@RequestBody GoalProfileRequest request,
                                       Authentication auth) {
        try {
            Long userId = (Long) auth.getPrincipal();
            Map<String, Object> plan = goalPlanService.createOrUpdateGoal(userId, request);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-plan")
    public ResponseEntity<?> getMyPlan(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Optional<UserProfile> profile = goalPlanService.getProfile(userId);
        if (profile.isPresent()) {
            return ResponseEntity.ok(profile.get());
        }
        return ResponseEntity.ok(Map.of("hasProfile", false));
    }
}
