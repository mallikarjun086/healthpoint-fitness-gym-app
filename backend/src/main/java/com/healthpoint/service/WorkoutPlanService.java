package com.healthpoint.service;

import com.healthpoint.entity.WorkoutPlan;
import com.healthpoint.repository.WorkoutPlanRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WorkoutPlanService {

    private final WorkoutPlanRepository workoutPlanRepository;

    public WorkoutPlanService(WorkoutPlanRepository workoutPlanRepository) {
        this.workoutPlanRepository = workoutPlanRepository;
    }

    public List<WorkoutPlan> getAllActivePlans() {
        return workoutPlanRepository.findByIsActiveTrue();
    }

    public WorkoutPlan savePlan(@NonNull WorkoutPlan plan) {
        return workoutPlanRepository.save(plan);
    }

    public void deletePlan(@NonNull Long id) {
        workoutPlanRepository.deleteById(id);
    }
}
