package com.healthpoint.repository;

import com.healthpoint.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    List<Exercise> findByPrimaryMuscleGroupIgnoreCase(String primaryMuscleGroup);

    List<Exercise> findByCategoryIgnoreCase(String category);

    List<Exercise> findByEquipmentRequiredIgnoreCase(String equipmentRequired);

    List<Exercise> findByDifficultyIgnoreCase(String difficulty);

    @Query("SELECT e FROM Exercise e WHERE " +
           "(:muscle IS NULL OR UPPER(e.primaryMuscleGroup) = UPPER(:muscle)) AND " +
           "(:category IS NULL OR UPPER(e.category) = UPPER(:category)) AND " +
           "(:equipment IS NULL OR UPPER(e.equipmentRequired) = UPPER(:equipment)) AND " +
           "(:difficulty IS NULL OR UPPER(e.difficulty) = UPPER(:difficulty)) AND " +
           "(:query IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.instructions) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.muscleImpact) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Exercise> filterExercises(
            @Param("muscle") String muscle,
            @Param("category") String category,
            @Param("equipment") String equipment,
            @Param("difficulty") String difficulty,
            @Param("query") String query
    );

    @Query("SELECT DISTINCT e.primaryMuscleGroup FROM Exercise e WHERE e.primaryMuscleGroup IS NOT NULL ORDER BY e.primaryMuscleGroup")
    List<String> findDistinctPrimaryMuscleGroups();
}
