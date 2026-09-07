package com.healthpoint.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/live-workout")
public class LiveWorkoutSessionController {

    // Simulates an active live workout session state
    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startSession(@RequestBody Map<String, Object> payload) {
        String workoutName = (String) payload.getOrDefault("workoutName", "Cyber Overload Hypertrophy");
        Long userId = Long.valueOf(payload.getOrDefault("userId", 1).toString());

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("sessionId", "SESS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        res.put("userId", userId);
        res.put("workoutName", workoutName);
        res.put("startTime", LocalDateTime.now());
        res.put("status", "ACTIVE");
        res.put("aiRecommendation", "Optimal readiness detected (HRV 78ms). Recommended target 1RM intensity: 82.5%");
        
        List<Map<String, Object>> exercises = new ArrayList<>();
        
        Map<String, Object> ex1 = new LinkedHashMap<>();
        ex1.put("id", 101);
        ex1.put("name", "Barbell Incline Bench Press");
        ex1.put("targetMuscle", "Upper Chest");
        ex1.put("suggestedSets", 4);
        ex1.put("suggestedReps", "8-10");
        ex1.put("suggestedWeightKg", 75.0);
        ex1.put("restSeconds", 90);
        ex1.put("completedSets", new ArrayList<>());
        exercises.add(ex1);

        Map<String, Object> ex2 = new LinkedHashMap<>();
        ex2.put("id", 102);
        ex2.put("name", "Cable Flyes (Low-to-High)");
        ex2.put("targetMuscle", "Chest Squeeze");
        ex2.put("suggestedSets", 3);
        ex2.put("suggestedReps", "12-15");
        ex2.put("suggestedWeightKg", 22.5);
        ex2.put("restSeconds", 60);
        ex2.put("completedSets", new ArrayList<>());
        exercises.add(ex2);

        Map<String, Object> ex3 = new LinkedHashMap<>();
        ex3.put("id", 103);
        ex3.put("name", "Overhead Triceps Extension");
        ex3.put("targetMuscle", "Triceps Long Head");
        ex3.put("suggestedSets", 4);
        ex3.put("suggestedReps", "10-12");
        ex3.put("suggestedWeightKg", 32.0);
        ex3.put("restSeconds", 60);
        ex3.put("completedSets", new ArrayList<>());
        exercises.add(ex3);

        res.put("exercises", exercises);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/log-set")
    public ResponseEntity<Map<String, Object>> logSet(@RequestBody Map<String, Object> payload) {
        double weightKg = Double.parseDouble(payload.getOrDefault("weightKg", 75.0).toString());
        int reps = Integer.parseInt(payload.getOrDefault("reps", 8).toString());
        double rpe = Double.parseDouble(payload.getOrDefault("rpe", 8.5).toString());
        
        // Calculate estimated 1RM (Epley formula: Weight * (1 + Reps/30))
        double est1RM = weightKg * (1.0 + (reps / 30.0));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", "SUCCESS");
        res.put("setLogged", Map.of("weightKg", weightKg, "reps", reps, "rpe", rpe, "est1RM", Math.round(est1RM * 10.0) / 10.0));
        res.put("nextRestSeconds", 90);
        res.put("aiAdaptiveFeedback", rpe >= 9.0 ? 
            "High effort detected (RPE " + rpe + "). Keep weight constant for next set." : 
            "Great speed! You have capacity to add +2.5kg for the next set.");

        return ResponseEntity.ok(res);
    }
}
