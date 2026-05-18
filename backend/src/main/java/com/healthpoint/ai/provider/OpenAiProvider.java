package com.healthpoint.ai.provider;

import com.healthpoint.ai.dto.OpenAiRequest;
import com.healthpoint.ai.dto.OpenAiResponse;

public interface OpenAiProvider {
    OpenAiResponse generateCompletion(OpenAiRequest request);
}
