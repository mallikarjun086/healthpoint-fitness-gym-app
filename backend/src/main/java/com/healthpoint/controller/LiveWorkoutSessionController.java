package com.healthpoint.controller;

import com.healthpoint.entity.ExerciseLog;
import com.healthpoint.entity.Notification;
import com.healthpoint.entity.WorkoutLog;
import com.healthpoint.repository.ExerciseLogRepository;
import com.healthpoint.repository.WorkoutLogRepository;
import com.healthpoint.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/live-workout")
public class LiveWorkoutSessionController {

    private final WorkoutLogRepository workoutLogRepository;
    private final ExerciseLogRepository exerciseLogRepository;
    private final NotificationService notificationService;

    public LiveWorkoutSessionController(WorkoutLogRepository workoutLogRepository,
                                       ExerciseLogRepository exerciseLogRepository,
                                       NotificationService notificationService) {
        this.workoutLogRepository = workoutLogRepository;
        this.exerciseLogRepository = exerciseLogRepository;
        this.notificationService = notificationService;
    }

    private Long resolveUserId(Authentication auth, Long requestedUserId) {
        if (requestedUserId != null) {
            return requestedUserId;
        }
        if (auth != null && auth.getPrincipal() instanceof Long) {
            return (Long) auth.getPrincipal();
        }
        return 3L; // Default authenticated member
    }

    // Simulates an active live workout session state
    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startSession(@RequestBody Map<String, Object> payload, Authentication auth) {
        String workoutName = (String) payload.getOrDefault("workoutName", "Biomechanical Computer Vision Session");
        Long userId = resolveUserId(auth, payload.containsKey("userId") ? Long.valueOf(payload.get("userId").toString()) : null);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("sessionId", "SESS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        res.put("userId", userId);
        res.put("workoutName", workoutName);
        res.put("startTime", LocalDateTime.now());
        res.put("status", "ACTIVE");
        res.put("aiRecommendation", "MediaPipe 33-landmark pose tracking calibrated. Joint kinematics active.");

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

    @PostMapping("/summary")
    public ResponseEntity<Map<String, Object>> saveLiveSessionSummary(@RequestBody Map<String, Object> payload, Authentication auth) {
        Long userId = resolveUserId(auth, payload.containsKey("userId") ? Long.valueOf(payload.get("userId").toString()) : null);
        String exerciseName = (String) payload.getOrDefault("exerciseName", "Squat");
        int repsCompleted = Integer.parseInt(payload.getOrDefault("repsCompleted", 0).toString());
        int formScore = Integer.parseInt(payload.getOrDefault("formScore", 90).toString());
        int durationSeconds = Integer.parseInt(payload.getOrDefault("durationSeconds", 60).toString());
        Object faultsObj = payload.get("faultCounts");

        // Create persistent WorkoutLog
        WorkoutLog workoutLog = new WorkoutLog();
        workoutLog.setUserId(userId);
        workoutLog.setStartedAt(LocalDateTime.now().minusSeconds(durationSeconds));
        workoutLog.setCompletedAt(LocalDateTime.now());
        workoutLog.setCompletionPercentage(formScore);

        WorkoutLog savedLog = workoutLogRepository.save(workoutLog);

        // Create ExerciseLog
        ExerciseLog exLog = new ExerciseLog();
        exLog.setWorkoutLog(savedLog);
        exLog.setSetsCompleted(1);
        exLog.setRepsCompleted(repsCompleted);
        exLog.setRpe(8);
        exLog.setNotes("CV Camera Coaching (" + exerciseName + ") | Form Quality: " + formScore + "% | Faults: " + faultsObj);
        exerciseLogRepository.save(exLog);

        // Send in-app notification
        try {
            Notification notif = new Notification();
            notif.setUserId(userId);
            notif.setTitle("Live Form Coaching Completed! 🎯");
            notif.setMessage("Completed " + repsCompleted + " reps of " + exerciseName + " with " + formScore + "% form accuracy.");
            notif.setType("WORKOUT");
            notif.setLinkUrl("/member/workouts");
            notificationService.createNotification(notif);
        } catch (Exception ignored) {}

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", "SUCCESS");
        res.put("logId", savedLog.getId());
        res.put("exerciseName", exerciseName);
        res.put("repsCompleted", repsCompleted);
        res.put("formScore", formScore);
        res.put("durationSeconds", durationSeconds);
        res.put("faultSummary", faultsObj);
        res.put("message", "Session persisted to HealthPoint records.");

        return ResponseEntity.ok(res);
    }
}
