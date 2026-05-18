package com.healthpoint.ai.controller;

import com.healthpoint.ai.analysis.ProgressAnalysisEngine;
import com.healthpoint.ai.retention.RetentionIntelligenceService;
import com.healthpoint.ai.security.AiSecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai/analytics")
public class AiAnalyticsController {

    private final ProgressAnalysisEngine progressAnalysisEngine;
    private final RetentionIntelligenceService retentionService;
    private final AiSecurityUtil securityUtil;

    public AiAnalyticsController(ProgressAnalysisEngine progressAnalysisEngine, RetentionIntelligenceService retentionService, AiSecurityUtil securityUtil) {
        this.progressAnalysisEngine = progressAnalysisEngine;
        this.retentionService = retentionService;
        this.securityUtil = securityUtil;
    }

    @GetMapping("/progress")
    public ResponseEntity<Map<String, String>> getProgressInsight() {
        Long userId = securityUtil.getAuthenticatedUserId();
        String insight = progressAnalysisEngine.analyzeProgress(userId);
        return ResponseEntity.ok(Map.of("insight", insight));
    }

    @GetMapping("/nudge")
    public ResponseEntity<Map<String, String>> getRetentionNudge() {
        Long userId = securityUtil.getAuthenticatedUserId();
        String nudge = retentionService.generateRetentionNudge(userId);
        return ResponseEntity.ok(Map.of("nudge", nudge));
    }
}
