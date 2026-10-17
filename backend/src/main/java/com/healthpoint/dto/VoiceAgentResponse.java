package com.healthpoint.dto;

import java.util.Map;

public class VoiceAgentResponse {
    private String spokenResponse;
    private String actionExecuted; // EXPLAIN_DIET, ALTER_DIET, ANSWER_DOUBT, FATIGUE_CHECK, TRAINER_SUMMARY
    private Map<String, Object> actionData;
    private boolean dietAltered;

    public VoiceAgentResponse() {}

    public VoiceAgentResponse(String spokenResponse, String actionExecuted, Map<String, Object> actionData, boolean dietAltered) {
        this.spokenResponse = spokenResponse;
        this.actionExecuted = actionExecuted;
        this.actionData = actionData;
        this.dietAltered = dietAltered;
    }

    public String getSpokenResponse() {
        return spokenResponse;
    }

    public void setSpokenResponse(String spokenResponse) {
        this.spokenResponse = spokenResponse;
    }

    public String getActionExecuted() {
        return actionExecuted;
    }

    public void setActionExecuted(String actionExecuted) {
        this.actionExecuted = actionExecuted;
    }

    public Map<String, Object> getActionData() {
        return actionData;
    }

    public void setActionData(Map<String, Object> actionData) {
        this.actionData = actionData;
    }

    public boolean isDietAltered() {
        return dietAltered;
    }

    public void setDietAltered(boolean dietAltered) {
        this.dietAltered = dietAltered;
    }
}
