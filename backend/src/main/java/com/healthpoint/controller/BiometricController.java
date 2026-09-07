package com.healthpoint.controller;

import com.healthpoint.entity.ProgressLog;
import com.healthpoint.entity.UserProfile;
import com.healthpoint.repository.ProgressLogRepository;
import com.healthpoint.repository.UserProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/biometrics")
public class BiometricController {

    private final ProgressLogRepository progressLogRepository;
    private final UserProfileRepository userProfileRepository;

    public BiometricController(ProgressLogRepository progressLogRepository, UserProfileRepository userProfileRepository) {
        this.progressLogRepository = progressLogRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserBiometrics(@PathVariable Long userId) {
        Map<String, Object> telemetry = new LinkedHashMap<>();
        telemetry.put("userId", userId);
        telemetry.put("deviceConnected", "Apple Watch Ultra 2");
        telemetry.put("batteryLevel", "88%");
        telemetry.put("lastSync", LocalDateTime.now());
        
        telemetry.put("currentHeartRate", 128);
        telemetry.put("restingHeartRate", 54);
        telemetry.put("hrvMs", 76);
        telemetry.put("spo2Percent", 99);
        telemetry.put("caloriesBurnedActive", 485);
        telemetry.put("readinessScore", 92);
        telemetry.put("recoveryStatus", "OPTIMAL");
        telemetry.put("sleepScore", 85);
        
        List<Map<String, Object>> heartRateSeries = new ArrayList<>();
        int baseHr = 110;
        for (int i = 0; i < 10; i++) {
            Map<String, Object> pt = new HashMap<>();
            pt.put("time", (i * 3) + "m");
            pt.put("bpm", baseHr + (int)(Math.random() * 35));
            heartRateSeries.add(pt);
        }
        telemetry.put("heartRateHistory", heartRateSeries);

        return ResponseEntity.ok(telemetry);
    }

    @GetMapping("/progress/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserProgressHistory(@PathVariable Long userId) {
        List<ProgressLog> history = progressLogRepository.findByUserIdOrderByLogDateAsc(userId);
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("history", history);
        response.put("profile", profileOpt.orElse(null));

        if (!history.isEmpty()) {
            ProgressLog latest = history.get(history.size() - 1);
            ProgressLog initial = history.get(0);
            response.put("currentWeight", latest.getWeightKg());
            response.put("currentBodyFat", latest.getBodyFatPercentage());
            response.put("totalWeightDelta", latest.getWeightKg() != null && initial.getWeightKg() != null ? 
                Math.round((latest.getWeightKg() - initial.getWeightKg()) * 10.0) / 10.0 : 0.0);
        } else if (profileOpt.isPresent()) {
            response.put("currentWeight", profileOpt.get().getWeightKg());
            response.put("totalWeightDelta", 0.0);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/progress")
    public ResponseEntity<ProgressLog> saveProgressLog(@RequestBody ProgressLog log) {
        if (log.getLogDate() == null) {
            log.setLogDate(LocalDate.now());
        }
        log.setLoggedAt(LocalDateTime.now());
        ProgressLog saved = progressLogRepository.save(log);

        // Optionally update user profile current weight and BMI if available
        if (log.getUserId() != null && log.getWeightKg() != null) {
            userProfileRepository.findByUserId(log.getUserId()).ifPresent(p -> {
                p.setWeightKg(log.getWeightKg());
                if (p.getHeightCm() != null && p.getHeightCm() > 0) {
                    double heightM = p.getHeightCm() / 100.0;
                    p.setBmi(Math.round((log.getWeightKg() / (heightM * heightM)) * 10.0) / 10.0);
                }
                userProfileRepository.save(p);
            });
        }

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/progress/{id}")
    public ResponseEntity<Void> deleteProgressLog(@PathVariable @org.springframework.lang.NonNull Long id) {
        progressLogRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

