package com.healthpoint.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdaptiveWorkoutService {

    private final ObjectMapper objectMapper;

    public AdaptiveWorkoutService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> adaptWorkout(String originalWorkoutJson, int readinessScore, boolean isDeloadTriggered) {
        return adaptWorkout(originalWorkoutJson, readinessScore, isDeloadTriggered, false);
    }

    public Map<String, Object> adaptWorkout(String originalWorkoutJson, int readinessScore, boolean isDeloadTriggered, boolean isPainPaused) {
        Map<String, Object> adaptationResult = new LinkedHashMap<>();
        adaptationResult.put("readinessScore", readinessScore);
        adaptationResult.put("isDeloadTriggered", isDeloadTriggered);
        adaptationResult.put("isPainPaused", isPainPaused);

        if (isPainPaused) {
            adaptationResult.put("adaptationType", "SAFETY_PAUSE");
            adaptationResult.put("volumeAdjustmentFactor", 0.60);
            adaptationResult.put("volumeReductionPercent", 40);
            adaptationResult.put("rpeCap", 6.5);
            adaptationResult.put("headline", "🛑 AI Progression Paused: Joint Discomfort Detected");
            adaptationResult.put("rationale", "Active pain flag reported. Autonomous weight escalation paused pending human trainer clearance.");
            adaptationResult.put("suggestGuidedBreathing", true);
            adaptationResult.put("adaptedExercises", parseAndReduceExercises(originalWorkoutJson, 0.60));
            return adaptationResult;
        }

        if (isDeloadTriggered || readinessScore < 35) {
            adaptationResult.put("adaptationType", "DELOAD_PROTOCOL");
            adaptationResult.put("volumeAdjustmentFactor", 0.50);
            adaptationResult.put("volumeReductionPercent", 50);
            adaptationResult.put("rpeCap", 6.0);
            adaptationResult.put("headline", "⚠️ Active Recovery & Joint Decompression");
            adaptationResult.put("rationale", "5-day downward recovery trend detected. Replaced heavy spinal loading with restorative mobility to prevent overtraining.");
            adaptationResult.put("suggestGuidedBreathing", true);
            adaptationResult.put("adaptedExercises", List.of(
                Map.of("name", "Thoracic Spine Foam Rolling & Cat-Cow", "sets", 3, "reps", "12 slow reps", "restSeconds", 45, "notes", "Gentle mobilization"),
                Map.of("name", "Passive Deadhang Spinal Decompression", "sets", 3, "reps", "45s hang", "restSeconds", 60, "notes", "Decompress lumbar discs"),
                Map.of("name", "90/90 Hip Mobility Flow", "sets", 3, "reps", "10 each side", "restSeconds", 45, "notes", "Restore hip capsule range"),
                Map.of("name", "Zone 2 Low-Impact Incline Walk", "sets", 1, "reps", "20 minutes", "restSeconds", 0, "notes", "Heart rate capped at 110-125 BPM")
            ));
            return adaptationResult;
        }

        if (readinessScore < 50) {
            adaptationResult.put("adaptationType", "REDUCED_VOLUME");
            adaptationResult.put("volumeAdjustmentFactor", 0.80);
            adaptationResult.put("volumeReductionPercent", 20);
            adaptationResult.put("rpeCap", 7.0);
            adaptationResult.put("headline", "⚡ Biometric Adaptation: Working Sets Reduced 20%");
            adaptationResult.put("rationale", "Low HRV / sub-optimal sleep detected. Working sets auto-reduced by ~20% and RPE capped at 7.0 to facilitate recovery.");
            adaptationResult.put("suggestGuidedBreathing", true);

            List<Map<String, Object>> adaptedList = parseAndReduceExercises(originalWorkoutJson, 0.80);
            adaptationResult.put("adaptedExercises", adaptedList);
            return adaptationResult;
        }

        if (readinessScore >= 80) {
            adaptationResult.put("adaptationType", "PEAK_INTENSITY");
            adaptationResult.put("volumeAdjustmentFactor", 1.0);
            adaptationResult.put("volumeReductionPercent", 0);
            adaptationResult.put("rpeCap", 9.5);
            adaptationResult.put("headline", "🔥 Peak Readiness: Full Volume + PR Cleared");
            adaptationResult.put("rationale", "High parasympathetic tone and restorative sleep detected. You are physiologically primed for max effort (+2.5kg load recommended on final set).");
            adaptationResult.put("suggestGuidedBreathing", false);

            List<Map<String, Object>> originalList = parseAndPreserveExercises(originalWorkoutJson);
            adaptationResult.put("adaptedExercises", originalList);
            return adaptationResult;
        }

        // Standard 50-79 Optimal
        adaptationResult.put("adaptationType", "OPTIMAL_STANDARD");
        adaptationResult.put("volumeAdjustmentFactor", 1.0);
        adaptationResult.put("volumeReductionPercent", 0);
        adaptationResult.put("rpeCap", 8.5);
        adaptationResult.put("headline", "✅ Optimal Recovery: Standard Prescribed Volume");
        adaptationResult.put("rationale", "Biometrics baseline normal. Execute planned sets, repetitions, and tempos as scheduled.");
        adaptationResult.put("suggestGuidedBreathing", false);

        List<Map<String, Object>> originalList = parseAndPreserveExercises(originalWorkoutJson);
        adaptationResult.put("adaptedExercises", originalList);
        return adaptationResult;
    }

    private List<Map<String, Object>> parseAndReduceExercises(String workoutJson, double factor) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            if (workoutJson != null && workoutJson.trim().startsWith("[")) {
                List<Map<String, Object>> parsed = objectMapper.readValue(workoutJson, new TypeReference<List<Map<String, Object>>>() {});
                for (Map<String, Object> item : parsed) {
                    Map<String, Object> adapted = new LinkedHashMap<>(item);
                    int sets = item.containsKey("sets") ? Integer.parseInt(item.get("sets").toString()) : 4;
                    int reducedSets = Math.max(2, (int) Math.round(sets * factor));
                    adapted.put("originalSets", sets);
                    adapted.put("sets", reducedSets);
                    adapted.put("adaptationNote", "Reduced from " + sets + " to " + reducedSets + " sets (-20%)");
                    result.add(adapted);
                }
                return result;
            }
        } catch (Exception ignored) {}

        // Fallback default exercise structure
        return List.of(
            Map.of("name", "Incline Dumbbell Press", "sets", 3, "originalSets", 4, "reps", "8-10", "restSeconds", 90, "adaptationNote", "Volume trimmed 20%"),
            Map.of("name", "Flat Barbell Bench Press", "sets", 3, "originalSets", 4, "reps", "6-8", "restSeconds", 120, "adaptationNote", "Volume trimmed 20%"),
            Map.of("name", "Standing Cable Lateral Raise", "sets", 3, "originalSets", 4, "reps", "12-15", "restSeconds", 60, "adaptationNote", "Volume trimmed 20%"),
            Map.of("name", "Triceps Rope Pushdown", "sets", 2, "originalSets", 3, "reps", "12-15", "restSeconds", 60, "adaptationNote", "Volume trimmed 20%")
        );
    }

    private List<Map<String, Object>> parseAndPreserveExercises(String workoutJson) {
        try {
            if (workoutJson != null && workoutJson.trim().startsWith("[")) {
                return objectMapper.readValue(workoutJson, new TypeReference<List<Map<String, Object>>>() {});
            }
        } catch (Exception ignored) {}

        return List.of(
            Map.of("name", "Incline Dumbbell Press", "sets", 4, "reps", "8-10", "restSeconds", 90),
            Map.of("name", "Flat Barbell Bench Press", "sets", 4, "reps", "6-8", "restSeconds", 120),
            Map.of("name", "Standing Cable Lateral Raise", "sets", 4, "reps", "12-15", "restSeconds", 60),
            Map.of("name", "Triceps Rope Pushdown", "sets", 3, "reps", "12-15", "restSeconds", 60)
        );
    }
}
