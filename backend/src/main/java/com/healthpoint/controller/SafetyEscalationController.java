package com.healthpoint.controller;

import com.healthpoint.entity.PainReport;
import com.healthpoint.entity.SafetyEscalation;
import com.healthpoint.service.SafetyEscalationService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/safety")
public class SafetyEscalationController {

    private final SafetyEscalationService safetyEscalationService;

    public SafetyEscalationController(SafetyEscalationService safetyEscalationService) {
        this.safetyEscalationService = safetyEscalationService;
    }

    @PostMapping("/pain-report")
    public ResponseEntity<Map<String, Object>> logPainReport(@RequestBody @NonNull Map<String, Object> payload) {
        long userId = Long.parseLong(Objects.requireNonNull(payload.get("userId")).toString());
        String bodyPart = Objects.requireNonNull(payload.get("bodyPart")).toString();
        int painLevel = Integer.parseInt(Objects.requireNonNull(payload.get("painLevel")).toString());
        String exerciseName = payload.containsKey("exerciseName") && payload.get("exerciseName") != null
                ? payload.get("exerciseName").toString() : null;
        String notes = payload.containsKey("notes") && payload.get("notes") != null
                ? payload.get("notes").toString() : "";

        return ResponseEntity.ok(safetyEscalationService.logPainReport(userId, bodyPart, painLevel, exerciseName, notes));
    }

    @PostMapping("/form-fault")
    public ResponseEntity<SafetyEscalation> reportFormFault(@RequestBody @NonNull Map<String, Object> payload) {
        long userId = Long.parseLong(Objects.requireNonNull(payload.get("userId")).toString());
        String exerciseName = Objects.requireNonNull(payload.get("exerciseName")).toString();
        String faultDescription = Objects.requireNonNull(payload.get("faultDescription")).toString();
        int faultCount = payload.containsKey("faultCount") && payload.get("faultCount") != null
                ? Integer.parseInt(payload.get("faultCount").toString()) : 3;
        String userNotes = payload.containsKey("userNotes") && payload.get("userNotes") != null
                ? payload.get("userNotes").toString() : null;

        return ResponseEntity.ok(safetyEscalationService.reportRepeatedFormFault(userId, exerciseName, faultDescription, faultCount, userNotes));
    }

    @PostMapping("/plateau-audit")
    public ResponseEntity<SafetyEscalation> reportPlateauAudit(@RequestBody @NonNull Map<String, Object> payload) {
        long userId = Long.parseLong(Objects.requireNonNull(payload.get("userId")).toString());
        String exerciseOrGoal = Objects.requireNonNull(payload.get("exerciseOrGoal")).toString();
        String details = payload.containsKey("details") && payload.get("details") != null
                ? payload.get("details").toString() : "4-week stagnation detected.";

        return ResponseEntity.ok(safetyEscalationService.reportPlateauAudit(userId, exerciseOrGoal, details));
    }

    @GetMapping("/trainer-queue")
    public ResponseEntity<List<Map<String, Object>>> getTrainerQueue(@RequestParam(required = false, defaultValue = "ALL") String status) {
        return ResponseEntity.ok(safetyEscalationService.getTrainerReviewQueue(status));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserSafetyOverview(@PathVariable Long userId) {
        List<SafetyEscalation> escalations = safetyEscalationService.getUserEscalations(userId);
        List<PainReport> painReports = safetyEscalationService.getUserPainReports(userId);
        boolean isPaused = safetyEscalationService.isAiProgressionPaused(userId);

        return ResponseEntity.ok(Map.of(
                "escalations", escalations,
                "painReports", painReports,
                "aiProgressionPaused", isPaused
        ));
    }

    @PostMapping("/resolve/{escalationId}")
    public ResponseEntity<SafetyEscalation> resolveEscalation(@PathVariable Long escalationId,
                                                             @RequestBody Map<String, Object> payload) {
        Long trainerId = payload.containsKey("trainerId") && payload.get("trainerId") != null
                ? Long.parseLong(payload.get("trainerId").toString()) : 1L;
        String trainerResponse = Objects.requireNonNull(payload.get("trainerResponse")).toString();

        return ResponseEntity.ok(safetyEscalationService.resolveEscalation(escalationId, trainerId, trainerResponse));
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<Map<String, Object>> getSafetyStatus(@PathVariable Long userId) {
        boolean isPaused = safetyEscalationService.isAiProgressionPaused(userId);
        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "aiProgressionPaused", isPaused
        ));
    }
}
