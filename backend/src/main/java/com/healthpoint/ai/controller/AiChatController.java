package com.healthpoint.ai.controller;

import com.healthpoint.ai.dto.AiChatRequest;
import com.healthpoint.ai.dto.AiChatResponse;
import com.healthpoint.ai.service.AiOrchestratorService;
import com.healthpoint.ai.security.AiSecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiChatController {

    private final AiOrchestratorService aiOrchestratorService;
    private final AiSecurityUtil securityUtil;

    public AiChatController(AiOrchestratorService aiOrchestratorService, AiSecurityUtil securityUtil) {
        this.aiOrchestratorService = aiOrchestratorService;
        this.securityUtil = securityUtil;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        Long userId = securityUtil.getAuthenticatedUserId();
        AiChatResponse response = aiOrchestratorService.processChat(userId, request);
        return ResponseEntity.ok(response);
    }
}
