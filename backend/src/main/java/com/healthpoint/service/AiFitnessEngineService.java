package com.healthpoint.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AiFitnessEngineService {

    /**
     * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor & Katch-McArdle formulas.
     */
    public double calculateBmr(double weightKg, double heightCm, int age, String gender, Double bodyFatPercent) {
        if (bodyFatPercent != null && bodyFatPercent > 0) {
            // Katch-McArdle Formula (Most accurate when Lean Body Mass is known)
            double leanBodyMass = weightKg * (1.0 - (bodyFatPercent / 100.0));
            return 370.0 + (21.6 * leanBodyMass);
        }
        
        // Mifflin-St Jeor Formula
        double bmr = (10.0 * weightKg) + (6.25 * heightCm) - (5.0 * age);
        return "FEMALE".equalsIgnoreCase(gender) ? bmr - 161 : bmr + 5;
    }

    /**
     * Calculates Total Daily Energy Expenditure (TDEE) and precision macro breakdown.
     */
    public Map<String, Object> calculatePrecisionNutrition(double weightKg, double heightCm, int age, String gender, 
                                                            Double bodyFatPercent, String activityLevel, String goal) {
        double bmr = calculateBmr(weightKg, heightCm, age, gender, bodyFatPercent);

        double activityMultiplier = switch (activityLevel.toUpperCase()) {
            case "SEDENTARY" -> 1.2;
            case "LIGHT" -> 1.375;
            case "MODERATE" -> 1.55;
            case "VERY_ACTIVE" -> 1.725;
            case "EXTRA_ACTIVE" -> 1.9;
            default -> 1.55;
        };

        double tdee = bmr * activityMultiplier;
        double targetCalories = tdee;

        double proteinGramsPerKg = 2.2; // Optimal high-protein hypertrophy standard
        double fatGramsPerKg = 0.9;     // Optimal hormonal balance standard

        switch (goal.toUpperCase()) {
            case "BULK", "MUSCLE_GAIN" -> {
                targetCalories += 350; // Surplus for MPS (Muscle Protein Synthesis)
                proteinGramsPerKg = 2.2;
                fatGramsPerKg = 1.0;
            }
            case "CUT", "FAT_LOSS" -> {
                targetCalories -= 450; // Caloric deficit preserving lean mass
                proteinGramsPerKg = 2.4; // Higher protein to spare LBM during deficit
                fatGramsPerKg = 0.8;
            }
            case "RECOMPOSITION" -> {
                targetCalories = tdee;
                proteinGramsPerKg = 2.3;
                fatGramsPerKg = 0.9;
            }
        }

        int proteinGrams = (int) Math.round(weightKg * proteinGramsPerKg);
        int fatGrams = (int) Math.round(weightKg * fatGramsPerKg);

        int proteinCalories = proteinGrams * 4;
        int fatCalories = fatGrams * 9;
        int remainingCalories = Math.max(0, (int) Math.round(targetCalories) - proteinCalories - fatCalories);
        int carbGrams = remainingCalories / 4;

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("bmr", Math.round(bmr));
        res.put("tdee", Math.round(tdee));
        res.put("targetCalories", Math.round(targetCalories));
        res.put("proteinGrams", proteinGrams);
        res.put("carbGrams", carbGrams);
        res.put("fatGrams", fatGrams);
        res.put("hydrationLiters", Math.round((weightKg * 0.045) * 10.0) / 10.0);
        res.put("preWorkoutCarbs", Math.round(carbGrams * 0.3) + "g (1-2 hours before training)");
        res.put("postWorkoutProtein", Math.round(proteinGrams * 0.25) + "g + 3g Leucine (Within 60 mins)");

        return res;
    }

    /**
     * AI Progressive Overload Fatigue & Deload Evaluator based on RPE/RIR history.
     */
    public Map<String, Object> evaluateFatigueAndOverload(List<Double> recentRpeScores, int weeklyVolumeSets) {
        if (recentRpeScores == null || recentRpeScores.isEmpty()) {
            return Map.of("fatigueIndex", "LOW", "recommendation", "Progressive overload active. Increase load by 2.5kg on primary compounds.");
        }

        double avgRpe = recentRpeScores.stream()
                .filter(Objects::nonNull)
                .mapToDouble(d -> d.doubleValue())
                .average()
                .orElse(7.5);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("averageRpe", Math.round(avgRpe * 10.0) / 10.0);
        result.put("weeklyVolumeSets", weeklyVolumeSets);

        if (avgRpe >= 9.2 && weeklyVolumeSets > 20) {
            result.put("fatigueIndex", "HIGH / OVERTRAINING RISK");
            result.put("recommendation", "Deload Recommended: Reduce working sets by 40% and intensity by 15% for 7 days to trigger central nervous system recovery.");
            result.put("action", "DELOAD");
        } else if (avgRpe >= 8.0) {
            result.put("fatigueIndex", "OPTIMAL HYPERTROPHY STIMULUS");
            result.put("recommendation", "Maintain current load. Focus on explosive concentric speed and 3-second eccentric control.");
            result.put("action", "MAINTAIN");
        } else {
            result.put("fatigueIndex", "SUB-OPTIMAL STIMULUS");
            result.put("recommendation", "Progressive Overload Trigger: Add 1 rep per set or increase working load by 2.5kg.");
            result.put("action", "INCREASE_LOAD");
        }

        return result;
    }
}
