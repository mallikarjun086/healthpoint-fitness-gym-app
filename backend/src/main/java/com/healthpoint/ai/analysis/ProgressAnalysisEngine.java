package com.healthpoint.ai.analysis;

import com.healthpoint.ai.config.AiProperties;
import com.healthpoint.ai.dto.OpenAiRequest;
import com.healthpoint.ai.dto.OpenAiResponse;
import com.healthpoint.ai.provider.OpenAiProvider;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProgressAnalysisEngine {
    
    private final OpenAiProvider provider;
    private final AiProperties properties;
    private final ConsistencyScoringService scoringService;

    public ProgressAnalysisEngine(OpenAiProvider provider, AiProperties properties, ConsistencyScoringService scoringService) {
        this.provider = provider;
        this.properties = properties;
        this.scoringService = scoringService;
    }

    public String analyzeProgress(Long userId) {
        int score = scoringService.calculateConsistencyScore(userId);
        String status = scoringService.getConsistencyInterpretation(score);

        String prompt = """
            Analyze the following user progress data and provide a 1-sentence insight and 1 actionable step.
            User Status: %s
            Consistency Score: %d/100
            Recent Trend: Weight unchanged for 3 weeks, attendance stable.
            """.formatted(status, score);

        OpenAiRequest req = new OpenAiRequest(
            properties.getModels().getReasoning(), // use reasoning model for analysis
            List.of(new OpenAiRequest.Message("user", prompt)),
            0.5,
            300,
            null
        );

        OpenAiResponse response = provider.generateCompletion(req);
        return response.choices().get(0).message().content();
    }
}
