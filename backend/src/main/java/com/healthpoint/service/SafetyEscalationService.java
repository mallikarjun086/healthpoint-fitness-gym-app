package com.healthpoint.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthpoint.entity.PainReport;
import com.healthpoint.entity.SafetyEscalation;
import com.healthpoint.repository.PainReportRepository;
import com.healthpoint.repository.SafetyEscalationRepository;
import com.healthpoint.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SafetyEscalationService {

    private final PainReportRepository painReportRepository;
    private final SafetyEscalationRepository safetyEscalationRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public SafetyEscalationService(PainReportRepository painReportRepository,
                                  SafetyEscalationRepository safetyEscalationRepository,
                                  UserRepository userRepository,
                                  ObjectMapper objectMapper) {
        this.painReportRepository = painReportRepository;
        this.safetyEscalationRepository = safetyEscalationRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public Map<String, Object> logPainReport(Long userId, String bodyPart, int painLevel, String exerciseName, String notes) {
        PainReport report = new PainReport();
        report.setUserId(userId);
        report.setBodyPart(bodyPart);
        report.setPainLevel(painLevel);
        report.setExerciseName(exerciseName);
        report.setNotes(notes);
        report.setReportedAt(LocalDateTime.now());
        painReportRepository.save(report);

        // Check if user reported pain >= 2 times in the last 7 days
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        long painCountLastWeek = painReportRepository.countPainReportsSince(userId, sevenDaysAgo);

        boolean escalationTriggered = false;
        SafetyEscalation escalation = null;

        if (painCountLastWeek >= 2 || painLevel >= 7) {
            escalationTriggered = true;
            escalation = new SafetyEscalation();
            escalation.setUserId(userId);
            escalation.setEscalationType("PAIN_REPORT");
            escalation.setSeverity(painLevel >= 8 ? "CRITICAL" : (painLevel >= 6 ? "HIGH" : "MEDIUM"));
            escalation.setStatus("OPEN");
            escalation.setUserNotes(notes);

            Map<String, Object> details = new LinkedHashMap<>();
            details.put("bodyPart", bodyPart);
            details.put("painLevel", painLevel);
            details.put("exerciseName", exerciseName);
            details.put("painCountIn7Days", painCountLastWeek);
            details.put("actionTaken", "AI progression auto-paused; Escalated to human trainer for clinical check.");
            details.put("timestamp", LocalDateTime.now().toString());

            try {
                escalation.setDetailsJson(objectMapper.writeValueAsString(details));
            } catch (Exception e) {
                escalation.setDetailsJson("{}");
            }

            safetyEscalationRepository.save(escalation);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("painReport", report);
        response.put("painCountLastWeek", painCountLastWeek);
        response.put("escalationTriggered", escalationTriggered);
        response.put("escalation", escalation);
        response.put("aiProgressionPaused", isAiProgressionPaused(userId));
        return response;
    }

    @Transactional
    public SafetyEscalation reportRepeatedFormFault(Long userId, String exerciseName, String faultDescription, int faultCount, String userNotes) {
        SafetyEscalation escalation = new SafetyEscalation();
        escalation.setUserId(userId);
        escalation.setEscalationType("REPEATED_FORM_FAULT");
        escalation.setSeverity("HIGH");
        escalation.setStatus("OPEN");
        escalation.setUserNotes(userNotes != null ? userNotes : "CV Form Coach detected repeated biomechanical fault (" + faultCount + "x in session)");

        Map<String, Object> details = new LinkedHashMap<>();
        details.put("exerciseName", exerciseName);
        details.put("faultDescription", faultDescription);
        details.put("faultCountInSession", faultCount);
        details.put("cvEngine", "MediaPipe 33-Landmark Biomechanical Angle Tracker");
        details.put("recommendation", "Review joint angle deviation trajectory and advise personalized cue.");
        details.put("timestamp", LocalDateTime.now().toString());

        try {
            escalation.setDetailsJson(objectMapper.writeValueAsString(details));
        } catch (Exception e) {
            escalation.setDetailsJson("{}");
        }

        return safetyEscalationRepository.save(escalation);
    }

    @Transactional
    public SafetyEscalation reportPlateauAudit(Long userId, String exerciseOrGoal, String details) {
        SafetyEscalation escalation = new SafetyEscalation();
        escalation.setUserId(userId);
        escalation.setEscalationType("PLATEAU_AUDIT");
        escalation.setSeverity("LOW");
        escalation.setStatus("OPEN");
        escalation.setUserNotes(details);

        Map<String, Object> detailsMap = new LinkedHashMap<>();
        detailsMap.put("exerciseOrGoal", exerciseOrGoal);
        detailsMap.put("plateauDurationWeeks", 4);
        detailsMap.put("auditReason", "Volume & 1RM stagnation detected across 4 consecutive training microcycles.");
        detailsMap.put("recommendation", "Periodization reset / exercise substitution audit by certified trainer.");
        detailsMap.put("timestamp", LocalDateTime.now().toString());

        try {
            escalation.setDetailsJson(objectMapper.writeValueAsString(detailsMap));
        } catch (Exception e) {
            escalation.setDetailsJson("{}");
        }

        return safetyEscalationRepository.save(escalation);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTrainerReviewQueue(String statusFilter) {
        List<SafetyEscalation> list = (statusFilter != null && !statusFilter.isBlank() && !"ALL".equalsIgnoreCase(statusFilter))
                ? safetyEscalationRepository.findByStatusOrderByCreatedAtDesc(statusFilter.toUpperCase())
                : safetyEscalationRepository.findAllByOrderByCreatedAtDesc();

        List<Map<String, Object>> enriched = new ArrayList<>();
        for (SafetyEscalation se : list) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", se.getId());
            item.put("userId", se.getUserId());
            item.put("trainerId", se.getTrainerId());
            item.put("escalationType", se.getEscalationType());
            item.put("severity", se.getSeverity());
            item.put("status", se.getStatus());
            item.put("userNotes", se.getUserNotes());
            item.put("trainerResponse", se.getTrainerResponse());
            item.put("createdAt", se.getCreatedAt());
            item.put("resolvedAt", se.getResolvedAt());

            // Parse details JSON
            try {
                item.put("details", objectMapper.readValue(se.getDetailsJson(), Map.class));
            } catch (Exception e) {
                item.put("details", Map.of("raw", se.getDetailsJson()));
            }

            // User info
            Long escalationUserId = se.getUserId();
            if (escalationUserId != null) {
                userRepository.findById(Objects.requireNonNull(escalationUserId)).ifPresent(u -> {
                    item.put("userName", u.getName());
                    item.put("userEmail", u.getEmail());
                    item.put("userPhone", u.getPhoneNumber());
                });
            }

            enriched.add(item);
        }

        return enriched;
    }

    @Transactional(readOnly = true)
    public List<SafetyEscalation> getUserEscalations(Long userId) {
        return safetyEscalationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<PainReport> getUserPainReports(Long userId) {
        return painReportRepository.findByUserIdOrderByReportedAtDesc(userId);
    }

    @Transactional
    public SafetyEscalation resolveEscalation(Long escalationId, Long trainerId, String trainerResponse) {
        if (escalationId == null) {
            throw new IllegalArgumentException("Escalation ID cannot be null");
        }
        SafetyEscalation escalation = safetyEscalationRepository.findById(Objects.requireNonNull(escalationId))
                .orElseThrow(() -> new IllegalArgumentException("Safety escalation not found with id: " + escalationId));

        escalation.setStatus("RESOLVED");
        escalation.setTrainerId(trainerId);
        escalation.setTrainerResponse(trainerResponse);
        escalation.setResolvedAt(LocalDateTime.now());
        return safetyEscalationRepository.save(escalation);
    }

    @Transactional(readOnly = true)
    public boolean isAiProgressionPaused(Long userId) {
        return safetyEscalationRepository.countOpenPainEscalationsForUser(userId) > 0;
    }
}

