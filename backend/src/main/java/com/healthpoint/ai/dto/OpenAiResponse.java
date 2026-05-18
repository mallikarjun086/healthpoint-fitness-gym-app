package com.healthpoint.ai.dto;

import java.util.List;

public record OpenAiResponse(
        String id,
        String object,
        Long created,
        String model,
        List<Choice> choices,
        Usage usage
) {
    public record Choice(
            int index,
            OpenAiRequest.Message message,
            String finish_reason
    ) {}

    public record Usage(
            int prompt_tokens,
            int completion_tokens,
            int total_tokens
    ) {}
}
