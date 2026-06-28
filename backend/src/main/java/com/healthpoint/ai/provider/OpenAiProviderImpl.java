package com.healthpoint.ai.provider;

import com.healthpoint.ai.dto.OpenAiRequest;
import com.healthpoint.ai.dto.OpenAiResponse;
import com.healthpoint.ai.exception.AiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class OpenAiProviderImpl implements OpenAiProvider {
    private static final Logger log = LoggerFactory.getLogger(OpenAiProviderImpl.class);
    
    private final RestClient restClient;

    public OpenAiProviderImpl(RestClient openAiRestClient) {
        this.restClient = openAiRestClient;
    }

    @Override
    public OpenAiResponse generateCompletion(OpenAiRequest request) {
        try {
            return restClient.post()
                    .uri("/chat/completions")
                    .body(java.util.Objects.requireNonNull(request))
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                        log.error("Client Error from OpenAI: {}", res.getStatusCode());
                        throw new AiException("OpenAI API Client Error: " + res.getStatusCode());
                    })
                    .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                        log.error("Server Error from OpenAI: {}", res.getStatusCode());
                        throw new AiException("OpenAI API Server Error: " + res.getStatusCode());
                    })
                    .body(OpenAiResponse.class);
        } catch (Exception e) {
            log.warn("Using mock AI response because OpenAI API call failed (likely missing API key). Error: {}", e.getMessage());
            
            String mockContent = "Hi there! I'm your mock HealthPoint AI Coach. I'm responding because a valid OpenAI API key wasn't found in your configuration. To get real AI responses, please set your actual API key in the application.yaml file.";
            if (request.response_format() != null && "json_object".equals(request.response_format().get("type"))) {
                mockContent = "{ \"adaptation_reason\": \"Using mock API key fallback\", \"exercises\": [ { \"name\": \"Bodyweight Squat\", \"sets\": 3, \"reps\": \"15\" } ] }";
            }
            OpenAiRequest.Message mockMessage = new OpenAiRequest.Message("assistant", mockContent);
            
            OpenAiResponse.Choice mockChoice = new OpenAiResponse.Choice(0, mockMessage, "stop");
            OpenAiResponse.Usage mockUsage = new OpenAiResponse.Usage(0, 0, 0);
            
            return new OpenAiResponse(
                    "mock-id",
                    "chat.completion",
                    System.currentTimeMillis() / 1000,
                    request.model(),
                    List.of(mockChoice),
                    mockUsage
            );
        }
    }
}
