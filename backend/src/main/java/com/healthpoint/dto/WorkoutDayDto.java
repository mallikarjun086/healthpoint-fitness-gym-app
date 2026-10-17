package com.healthpoint.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class WorkoutDayDto {
    private String day;
    private String focus;
    private String exercises;
    private String sets;
    private String reps;
    private String rest;

    public WorkoutDayDto(String day, String focus, String exercises, String sets, String reps, String rest) {
        this.day = day;
        this.focus = focus;
        this.exercises = exercises;
        this.sets = sets;
        this.reps = reps;
        this.rest = rest;
    }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public String getFocus() { return focus; }
    public void setFocus(String focus) { this.focus = focus; }

    public String getExercises() { return exercises; }
    public void setExercises(String exercises) { this.exercises = exercises; }

    public String getSets() { return sets; }
    public void setSets(String sets) { this.sets = sets; }

    public String getReps() { return reps; }
    public void setReps(String reps) { this.reps = reps; }

    public String getRest() { return rest; }
    public void setRest(String rest) { this.rest = rest; }
}
