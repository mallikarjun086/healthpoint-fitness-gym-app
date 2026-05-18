package com.healthpoint.ai.adaptation;

import java.util.List;

public record WorkoutAdaptationResponse(
    String adaptation_reason,
    List<AdaptedExercise> exercises
) {
    public record AdaptedExercise(
        String name,
        int sets,
        String reps
    ) {}
}
