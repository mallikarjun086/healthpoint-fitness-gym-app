package com.healthpoint.service;

import com.healthpoint.entity.Exercise;
import com.healthpoint.repository.ExerciseRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    public List<Exercise> filterExercises(String muscle, String category, String equipment, String difficulty, String query) {
        String cleanMuscle = (muscle != null && !muscle.equalsIgnoreCase("ALL") && !muscle.isBlank()) ? muscle.trim() : null;
        String cleanCategory = (category != null && !category.equalsIgnoreCase("ALL") && !category.isBlank()) ? category.trim() : null;
        String cleanEquipment = (equipment != null && !equipment.equalsIgnoreCase("ALL") && !equipment.isBlank()) ? equipment.trim() : null;
        String cleanDifficulty = (difficulty != null && !difficulty.equalsIgnoreCase("ALL") && !difficulty.isBlank()) ? difficulty.trim() : null;
        String cleanQuery = (query != null && !query.isBlank()) ? query.trim() : null;

        if (cleanMuscle == null && cleanCategory == null && cleanEquipment == null && cleanDifficulty == null && cleanQuery == null) {
            return exerciseRepository.findAll();
        }

        return exerciseRepository.filterExercises(cleanMuscle, cleanCategory, cleanEquipment, cleanDifficulty, cleanQuery);
    }

    public Optional<Exercise> getExerciseById(@NonNull Long id) {
        return exerciseRepository.findById(id);
    }

    public List<String> getMuscleGroups() {
        return exerciseRepository.findDistinctPrimaryMuscleGroups();
    }

    public Map<String, Object> getMuscleTaxonomySummary() {
        List<Exercise> all = exerciseRepository.findAll();
        Map<String, Long> countByMuscle = new HashMap<>();
        for (Exercise ex : all) {
            String muscle = ex.getPrimaryMuscleGroup() != null ? ex.getPrimaryMuscleGroup() : "OTHER";
            countByMuscle.put(muscle, countByMuscle.getOrDefault(muscle, 0L) + 1);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalExercises", all.size());
        result.put("muscleCounts", countByMuscle);
        return result;
    }

    public Exercise saveExercise(@NonNull Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    public void deleteExercise(@NonNull Long id) {
        exerciseRepository.deleteById(id);
    }
}
