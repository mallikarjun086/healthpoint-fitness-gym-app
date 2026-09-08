package com.healthpoint.controller;

import com.healthpoint.service.BiometricReadinessService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/biometrics")
public class BiometricReadinessController {

    private final BiometricReadinessService readinessService;

    public BiometricReadinessController(BiometricReadinessService readinessService) {
        this.readinessService = readinessService;
    }

    private Long resolveUserId(Authentication auth, Long requestedUserId) {
        if (requestedUserId != null) {
            return requestedUserId;
        }
        if (auth != null && auth.getPrincipal() instanceof Long) {
            return (Long) auth.getPrincipal();
        }
        return 3L; // Default member ID
    }

    @GetMapping("/readiness/today")
    public ResponseEntity<Map<String, Object>> getTodayReadiness(@RequestParam(required = false) Long userId,
                                                                 Authentication auth) {
        Long targetUserId = resolveUserId(auth, userId);
        Map<String, Object> readiness = readinessService.getTodayReadiness(targetUserId);
        return ResponseEntity.ok(readiness);
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncWearableData(@RequestBody Map<String, Object> payload,
                                                                Authentication auth) {
        Long userId = resolveUserId(auth, payload.containsKey("userId") ? Long.valueOf(payload.get("userId").toString()) : null);
        String provider = (String) payload.getOrDefault("provider", "APPLE_HEALTH");
        Map<String, Object> updatedReadiness = readinessService.syncWearableData(userId, provider, payload);
        return ResponseEntity.ok(updatedReadiness);
    }

    @PostMapping("/seed-demo")
    public ResponseEntity<Map<String, Object>> seedDemoScenario(@RequestBody Map<String, Object> payload,
                                                                Authentication auth) {
        Long userId = resolveUserId(auth, payload.containsKey("userId") ? Long.valueOf(payload.get("userId").toString()) : null);
        String scenario = (String) payload.getOrDefault("scenario", "OPTIMAL");
        Map<String, Object> seededReadiness = readinessService.seedDemoScenario(userId, scenario);
        return ResponseEntity.ok(seededReadiness);
    }

    @DeleteMapping("/my-data")
    public ResponseEntity<Map<String, Object>> deleteMyBiometricData(@RequestParam(required = false) Long userId,
                                                                     Authentication auth) {
        Long targetUserId = resolveUserId(auth, userId);
        Map<String, Object> result = readinessService.deleteMyBiometricData(targetUserId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/oauth/google-fit/url")
    public ResponseEntity<Map<String, Object>> getGoogleFitAuthUrl() {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("provider", "GOOGLE_FIT");
        res.put("authUrl", "https://accounts.google.com/o/oauth2/v2/auth?client_id=healthpoint-fit.apps.googleusercontent.com&response_type=code&scope=https://www.googleapis.com/auth/fitness.heart_rate.read%20https://www.googleapis.com/auth/fitness.sleep.read&redirect_uri=https://healthpoint.app/oauth/callback");
        res.put("pwaCompatible", true);
        res.put("note", "Standard Web & PWA OAuth2 Flow");
        return ResponseEntity.ok(res);
    }
}
