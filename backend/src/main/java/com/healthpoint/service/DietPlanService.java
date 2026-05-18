package com.healthpoint.service;

import com.healthpoint.entity.DietPlan;
import com.healthpoint.repository.DietPlanRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DietPlanService {

    private final DietPlanRepository dietPlanRepository;

    public DietPlanService(DietPlanRepository dietPlanRepository) {
        this.dietPlanRepository = dietPlanRepository;
    }

    public List<DietPlan> getAllActivePlans() {
        return dietPlanRepository.findByIsActiveTrue();
    }

    public DietPlan savePlan(@NonNull DietPlan plan) {
        return dietPlanRepository.save(plan);
    }

    public void deletePlan(@NonNull Long id) {
        dietPlanRepository.deleteById(id);
    }
}
