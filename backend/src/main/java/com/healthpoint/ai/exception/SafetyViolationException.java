package com.healthpoint.ai.exception;

public class SafetyViolationException extends AiException {
    public SafetyViolationException(String message) {
        super(message);
    }
}
