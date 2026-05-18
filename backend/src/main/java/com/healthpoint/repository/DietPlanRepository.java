package com.healthpoint.repository;

import com.healthpoint.entity.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    List<DietPlan> findByIsActiveTrue();
    List<DietPlan> findByMealType(String mealType);
}
