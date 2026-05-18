package com.healthpoint.ai.dto;

public record AiChatResponse(
        String reply,
        int tokenUsage
) {}
