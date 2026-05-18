package com.healthpoint.dto;

import lombok.Data;

@Data
public class GoalProfileRequest {
    private Double heightCm;
    private Double weightKg;
    private String experienceLevel; // BEGINNER, INTERMEDIATE, ADVANCED
    private String goalType;        // COMPETITION, AESTHETIC, STRENGTH, POWERLIFTING, SPORTS
    private String sportName;       // optional, used when goalType=SPORTS
}
