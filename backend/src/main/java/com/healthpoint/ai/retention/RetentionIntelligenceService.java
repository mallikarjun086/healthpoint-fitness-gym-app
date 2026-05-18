package com.healthpoint.ai.retention;

import com.healthpoint.ai.analysis.ConsistencyScoringService;
import org.springframework.stereotype.Service;

@Service
public class RetentionIntelligenceService {
    
    private final ConsistencyScoringService consistencyScoring;

    public RetentionIntelligenceService(ConsistencyScoringService consistencyScoring) {
        this.consistencyScoring = consistencyScoring;
    }

    public String generateRetentionNudge(Long userId) {
        int score = consistencyScoring.calculateConsistencyScore(userId);
        
        if (score < 30) {
            return "Hey! It's been a minute. Let's do a quick 10-minute mobility session today to get the blood flowing. You in?";
        } else if (score < 60) {
            return "You missed a couple of sessions, but your progress is still there. Let's get back on track tomorrow!";
        }
        return "You're crushing it! Make sure you're sleeping 8 hours to maximize these gains.";
    }
}
