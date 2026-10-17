package com.healthpoint.dto;

public class VoiceAgentRequest {
    private String transcript;
    private Long userId;
    private String role; // MEMBER or TRAINER
    private String currentDietContext;

    public VoiceAgentRequest() {}

    public VoiceAgentRequest(String transcript, Long userId, String role, String currentDietContext) {
        this.transcript = transcript;
        this.userId = userId;
        this.role = role;
        this.currentDietContext = currentDietContext;
    }

    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCurrentDietContext() {
        return currentDietContext;
    }

    public void setCurrentDietContext(String currentDietContext) {
        this.currentDietContext = currentDietContext;
    }
}
