package com.healthpoint.ai.adaptation;

import org.springframework.stereotype.Service;

@Service
public class DietAdaptationService {
    public String adaptDiet(Long userId, String feedback) {
        // Core macro adaptation logic goes here
        return "Diet parameters adjusted for sustainability based on: " + feedback;
    }
}
