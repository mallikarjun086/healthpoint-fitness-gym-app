package com.healthpoint.repository;

import com.healthpoint.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    List<WorkoutPlan> findByIsActiveTrue();
    List<WorkoutPlan> findByDifficulty(String difficulty);
}
