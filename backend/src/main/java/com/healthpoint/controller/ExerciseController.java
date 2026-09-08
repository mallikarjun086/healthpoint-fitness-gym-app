package com.healthpoint.controller;

import com.healthpoint.entity.Exercise;
import com.healthpoint.service.ExerciseService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public ResponseEntity<List<Exercise>> getExercises(
            @RequestParam(required = false) String muscle,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String equipment,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String query) {
        List<Exercise> list = exerciseService.filterExercises(muscle, category, equipment, difficulty, query);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable @NonNull Long id) {
        return exerciseService.getExerciseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/muscle-groups")
    public ResponseEntity<List<String>> getMuscleGroups() {
        return ResponseEntity.ok(exerciseService.getMuscleGroups());
    }

    @GetMapping("/taxonomy")
    public ResponseEntity<Map<String, Object>> getTaxonomySummary() {
        return ResponseEntity.ok(exerciseService.getMuscleTaxonomySummary());
    }

    @PostMapping
    public ResponseEntity<Exercise> createExercise(@RequestBody @NonNull Exercise exercise) {
        return ResponseEntity.ok(exerciseService.saveExercise(exercise));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable @NonNull Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.ok().build();
    }
}
