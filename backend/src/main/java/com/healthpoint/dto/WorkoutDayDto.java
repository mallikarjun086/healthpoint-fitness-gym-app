package com.healthpoint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutDayDto {
    private String day;
    private String focus;
    private String exercises;
    private String sets;
    private String reps;
    private String rest;
}
