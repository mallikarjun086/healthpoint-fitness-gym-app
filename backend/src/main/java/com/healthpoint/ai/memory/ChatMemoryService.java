package com.healthpoint.ai.memory;

import com.healthpoint.ai.dto.OpenAiRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatMemoryService {
    
    private final AiChatMessageRepository repository;
    
    public ChatMemoryService(AiChatMessageRepository repository) {
        this.repository = repository;
    }

    public List<OpenAiRequest.Message> getRecentMessages(Long userId) {
        List<AiChatMessage> messages = repository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
        Collections.reverse(messages); // Oldest first for LLM continuity
        
        return messages.stream()
                .map(m -> new OpenAiRequest.Message(m.getRole(), m.getContent()))
                .collect(Collectors.toList());
    }

    @Async
    public void saveMessageAsync(Long userId, String role, String content, int tokenCount) {
        AiChatMessage msg = new AiChatMessage();
        msg.setUserId(userId);
        msg.setRole(role);
        msg.setContent(content);
        msg.setTokenCount(tokenCount);
        repository.save(msg);
    }
}
