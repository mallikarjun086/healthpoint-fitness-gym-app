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
        return com.healthpoint.util.SecurityUtil.resolveUserId(auth, requestedUserId);
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startSession(@RequestBody(required = false) Map<String, Object> payload, Authentication auth) {
        String workoutName = (String) (payload != null ? payload.getOrDefault("workoutName", "Biomechanical Computer Vision Session") : "Biomechanical Computer Vision Session");
        Long requestedUserId = null;
        if (payload != null && payload.get("userId") != null) {
            try {
                requestedUserId = Long.valueOf(payload.get("userId").toString());
            } catch (Exception ignored) {}
        }
        Long userId = resolveUserId(auth, requestedUserId);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("sessionId", "SESS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        res.put("userId", userId);
        res.put("workoutName", workoutName);
        res.put("startTime", LocalDateTime.now());
        res.put("status", "ACTIVE");
        res.put("aiRecommendation", "MediaPipe 33-landmark pose tracking calibrated. Joint kinematics active.");

        List<Map<String, Object>> exercises = new ArrayList<>();
        String nameUpper = workoutName != null ? workoutName.toUpperCase() : "";
        if (nameUpper.contains("PULL") || nameUpper.contains("BACK")) {
            exercises.add(Map.of("id", 201, "name", "Barbell Bent-Over Row", "targetMuscle", "Lats & Upper Back", "suggestedSets", 4, "suggestedReps", "8-10", "suggestedWeightKg", 70.0, "restSeconds", 90));
            exercises.add(Map.of("id", 202, "name", "Lat Pulldown (Neutral Grip)", "targetMuscle", "Latissimus Dorsi", "suggestedSets", 3, "suggestedReps", "10-12", "suggestedWeightKg", 60.0, "restSeconds", 75));
            exercises.add(Map.of("id", 203, "name", "Incline Dumbbell Bicep Curl", "targetMuscle", "Biceps Brachii", "suggestedSets", 3, "suggestedReps", "12-15", "suggestedWeightKg", 14.0, "restSeconds", 60));
        } else if (nameUpper.contains("LEG") || nameUpper.contains("SQUAT") || nameUpper.contains("LOWER")) {
            exercises.add(Map.of("id", 301, "name", "Barbell Back Squat", "targetMuscle", "Quadriceps & Glutes", "suggestedSets", 4, "suggestedReps", "6-8", "suggestedWeightKg", 100.0, "restSeconds", 120));
            exercises.add(Map.of("id", 302, "name", "Romanian Deadlift (RDL)", "targetMuscle", "Hamstrings & Glutes", "suggestedSets", 4, "suggestedReps", "8-10", "suggestedWeightKg", 90.0, "restSeconds", 90));
            exercises.add(Map.of("id", 303, "name", "Bulgarian Split Squats", "targetMuscle", "Unilateral Quads", "suggestedSets", 3, "suggestedReps", "10-12 each", "suggestedWeightKg", 18.0, "restSeconds", 75));
        } else {
            exercises.add(Map.of("id", 101, "name", "Barbell Incline Bench Press", "targetMuscle", "Upper Chest", "suggestedSets", 4, "suggestedReps", "8-10", "suggestedWeightKg", 75.0, "restSeconds", 90));
            exercises.add(Map.of("id", 102, "name", "Cable Flyes (Low-to-High)", "targetMuscle", "Chest Squeeze", "suggestedSets", 3, "suggestedReps", "12-15", "suggestedWeightKg", 22.5, "restSeconds", 60));
            exercises.add(Map.of("id", 103, "name", "Overhead Triceps Extension", "targetMuscle", "Triceps Long Head", "suggestedSets", 4, "suggestedReps", "10-12", "suggestedWeightKg", 32.0, "restSeconds", 60));
        }
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

    @PostMapping("/summary")
    public ResponseEntity<Map<String, Object>> saveLiveSessionSummary(@RequestBody(required = false) Map<String, Object> payload, Authentication auth) {
        Map<String, Object> safePayload = payload != null ? payload : Collections.emptyMap();
        Long requestedUserId = null;
        if (safePayload.get("userId") != null) {
            try {
                requestedUserId = Long.valueOf(safePayload.get("userId").toString());
            } catch (Exception ignored) {}
        }
        Long userId = resolveUserId(auth, requestedUserId);
        String exerciseName = (String) safePayload.getOrDefault("exerciseName", "Squat");
        int repsCompleted = Integer.parseInt(safePayload.getOrDefault("repsCompleted", 0).toString());
        int formScore = Integer.parseInt(safePayload.getOrDefault("formScore", 90).toString());
        int durationSeconds = Integer.parseInt(safePayload.getOrDefault("durationSeconds", 60).toString());
        Object faultsObj = safePayload.get("faultCounts");

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
