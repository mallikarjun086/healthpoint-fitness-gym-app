package com.healthpoint.ai.service;

import com.healthpoint.ai.config.AiProperties;
import com.healthpoint.ai.context.UserContextFetcher;
import com.healthpoint.ai.dto.AiChatRequest;
import com.healthpoint.ai.dto.AiChatResponse;
import com.healthpoint.ai.dto.OpenAiRequest;
import com.healthpoint.ai.dto.OpenAiResponse;
import com.healthpoint.ai.memory.ChatMemoryService;
import com.healthpoint.ai.prompt.DefaultPromptBuilder;
import com.healthpoint.ai.provider.OpenAiProvider;
import com.healthpoint.ai.safety.DefaultSafetyValidator;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiOrchestratorService {

    private final OpenAiProvider provider;
    private final AiProperties properties;
    private final DefaultSafetyValidator safetyValidator;
    private final UserContextFetcher contextFetcher;
    private final DefaultPromptBuilder promptBuilder;
    private final ChatMemoryService memoryService;

    public AiOrchestratorService(
            OpenAiProvider provider, 
            AiProperties properties, 
            DefaultSafetyValidator safetyValidator, 
            UserContextFetcher contextFetcher, 
            DefaultPromptBuilder promptBuilder, 
            ChatMemoryService memoryService) {
        this.provider = provider;
        this.properties = properties;
        this.safetyValidator = safetyValidator;
        this.contextFetcher = contextFetcher;
        this.promptBuilder = promptBuilder;
        this.memoryService = memoryService;
    }

    public AiChatResponse processChat(Long userId, AiChatRequest request) {
        // 1. Validate Input
        safetyValidator.validateInput(request.message());

        // 2. Build Context and System Prompt
        String context = contextFetcher.fetchUserContext(userId);
        String systemPrompt = promptBuilder.buildSystemPrompt(context);

        // 3. Assemble Messages
        List<OpenAiRequest.Message> messages = new ArrayList<>();
        messages.add(new OpenAiRequest.Message("system", systemPrompt));
        
        // Add DB Memory context
        messages.addAll(memoryService.getRecentMessages(userId));
        
        // Add current user input
        messages.add(new OpenAiRequest.Message("user", request.message()));

        // 4. Provider Call
        OpenAiRequest openAiReq = new OpenAiRequest(
                properties.getModels().getChat(),
                messages,
                0.7, // Temperature
                properties.getMaxTokens(),
                null // No forced schema yet for simple chat
        );

        OpenAiResponse response = provider.generateCompletion(openAiReq);
        String aiReply = response.choices().get(0).message().content();
        int totalTokens = response.usage().total_tokens();

        // 5. Output Validation
        safetyValidator.validateOutput(aiReply);

        // 6. Save State (Async)
        memoryService.saveMessageAsync(userId, "user", request.message(), 0);
        memoryService.saveMessageAsync(userId, "assistant", aiReply, totalTokens);

        // 7. Return Result
        return new AiChatResponse(aiReply, totalTokens);
    }
}
