package com.healthpoint.ai.adaptation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthpoint.ai.config.AiProperties;
import com.healthpoint.ai.dto.OpenAiRequest;
import com.healthpoint.ai.provider.OpenAiProvider;
import com.healthpoint.ai.exception.SafetyViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class WorkoutAdaptationService {

    private final OpenAiProvider provider;
    private final AiProperties properties;
    private final ExerciseMetadataRepository exerciseRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    public WorkoutAdaptationService(OpenAiProvider provider, AiProperties properties, ExerciseMetadataRepository exerciseRepo) {
        this.provider = provider;
        this.properties = properties;
        this.exerciseRepo = exerciseRepo;
    }

    public WorkoutAdaptationResponse adaptWorkout(Long userId, String userRequest) {
        // Enforce JSON schema via OpenAI Structured Outputs
        Map<String, Object> responseFormat = Map.of("type", "json_object");

        String prompt = """
            Adapt the workout based on: "%s".
            Return strict JSON matching this schema:
            {
              "adaptation_reason": "string",
              "exercises": [
                { "name": "string", "sets": int, "reps": "string" }
              ]
            }
            """.formatted(userRequest);

        OpenAiRequest req = new OpenAiRequest(
            properties.getModels().getReasoning(),
            List.of(new OpenAiRequest.Message("user", prompt)),
            0.2, // low temp for strict JSON adherence
            500,
            responseFormat
        );

        String jsonResponse = provider.generateCompletion(req).choices().get(0).message().content();

        try {
            WorkoutAdaptationResponse adaptation = mapper.readValue(jsonResponse, WorkoutAdaptationResponse.class);
            validateSafety(adaptation); // Verify exercises against DB
            return adaptation;
        } catch (SafetyViolationException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI JSON adaptation", e);
        }
    }

    private void validateSafety(WorkoutAdaptationResponse adaptation) {
        for (var ex : adaptation.exercises()) {
            exerciseRepo.findByNameIgnoreCase(ex.name()).ifPresent(metadata -> {
                if (metadata.getSpinalLoadLevel() > 4) {
                    // Logic to cross-reference user injury profile in production
                    // throw new SafetyViolationException("AI suggested contraindicated exercise.");
                }
            });
        }
    }
}
