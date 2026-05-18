package com.healthpoint.ai.context;

import com.healthpoint.ai.analysis.ConsistencyScoringService;
import com.healthpoint.entity.ProgressLog;
import com.healthpoint.repository.ProgressLogRepository;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class UserContextFetcher {
    
    private final ConsistencyScoringService consistencyScoringService;
    private final ProgressLogRepository progressLogRepo;

    public UserContextFetcher(ConsistencyScoringService consistencyScoringService, ProgressLogRepository progressLogRepo) {
        this.consistencyScoringService = consistencyScoringService;
        this.progressLogRepo = progressLogRepo;
    }
    
    public String fetchUserContext(Long userId) {
        int score = consistencyScoringService.calculateConsistencyScore(userId);
        String consistencyLabel = consistencyScoringService.getConsistencyInterpretation(score);
        
        List<ProgressLog> recentLogs = progressLogRepo.findTop5ByUserIdOrderByLoggedDateDesc(userId);
        StringBuilder progressStr = new StringBuilder();
        if (recentLogs.isEmpty()) {
            progressStr.append("No recent progress data logged.");
        } else {
            for (ProgressLog log : recentLogs) {
                progressStr.append(String.format("Date: %s, Weight: %.1f kg, Fat: %.1f%%\n", 
                        log.getLoggedDate(), 
                        log.getBodyWeightKg() != null ? log.getBodyWeightKg() : 0.0, 
                        log.getBodyFatPercentage() != null ? log.getBodyFatPercentage() : 0.0));
            }
        }

        return """
            User ID: %d
            Consistency Score: %d/100 (%s)
            
            Recent Progress Logs:
            %s
            
            (Note: Injuries and active plans are dynamically fetched from the GoalPlanService during adaptation routing)
            """.formatted(userId, score, consistencyLabel, progressStr.toString());
    }
}
