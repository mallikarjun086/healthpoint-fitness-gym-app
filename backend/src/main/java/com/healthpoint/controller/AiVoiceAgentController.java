package com.healthpoint.controller;

import com.healthpoint.dto.VoiceAgentRequest;
import com.healthpoint.dto.VoiceAgentResponse;
import com.healthpoint.service.AiVoiceAgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/voice-agent")
public class AiVoiceAgentController {

    private final AiVoiceAgentService aiVoiceAgentService;

    public AiVoiceAgentController(AiVoiceAgentService aiVoiceAgentService) {
        this.aiVoiceAgentService = aiVoiceAgentService;
    }

    @PostMapping("/chat")
    public ResponseEntity<VoiceAgentResponse> processVoiceQuery(@RequestBody VoiceAgentRequest request) {
        VoiceAgentResponse response = aiVoiceAgentService.processVoiceQuery(request);
        return ResponseEntity.ok(response);
    }
}
