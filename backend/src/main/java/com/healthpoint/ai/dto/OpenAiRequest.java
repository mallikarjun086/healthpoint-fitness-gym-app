package com.healthpoint.ai.dto;

import java.util.List;
import java.util.Map;

public record OpenAiRequest(
        String model,
        List<Message> messages,
        Double temperature,
        Integer max_tokens,
        Map<String, Object> response_format
) {
    public record Message(String role, String content) {}
}
