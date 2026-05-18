package com.healthpoint.repository;

import com.healthpoint.entity.AddOnPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddOnPlanRepository extends JpaRepository<AddOnPlan, Long> {
    List<AddOnPlan> findByIsActiveTrue();
    List<AddOnPlan> findByContentTypeAndIsActiveTrue(String contentType);
}