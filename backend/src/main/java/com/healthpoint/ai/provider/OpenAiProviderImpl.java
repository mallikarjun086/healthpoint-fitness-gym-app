package com.healthpoint.ai.provider;

import com.healthpoint.ai.dto.OpenAiRequest;
import com.healthpoint.ai.dto.OpenAiResponse;
import com.healthpoint.ai.exception.AiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

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
        } catch (AiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to communicate with OpenAI API", e);
            throw new AiException("Failed to generate AI response", e);
        }
    }
}
