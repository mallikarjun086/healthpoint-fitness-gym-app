package com.healthpoint.ai.safety;

import com.healthpoint.ai.exception.SafetyViolationException;
import org.springframework.stereotype.Component;

@Component
public class DefaultSafetyValidator {

    private static final String[] BLOCKED_TERMS = {
        "steroid", "trenbolone", "sarms", "suicide", "hack", "ignore all previous instructions"
    };

    public void validateInput(String input) {
        if (input == null || input.trim().isEmpty()) {
            throw new SafetyViolationException("Input cannot be empty");
        }
        
        String lowerInput = input.toLowerCase();
        for (String term : BLOCKED_TERMS) {
            if (lowerInput.contains(term)) {
                throw new SafetyViolationException("Input violates safety policies. Blocked term detected.");
            }
        }
    }

    public void validateOutput(String output) {
        if (output == null || output.trim().isEmpty()) {
            throw new SafetyViolationException("AI generated empty output");
        }
        // Potential output sanitization logic here
    }
}
