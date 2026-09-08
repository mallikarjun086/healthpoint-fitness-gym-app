package com.healthpoint.repository;

import com.healthpoint.entity.SafetyEscalation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SafetyEscalationRepository extends JpaRepository<SafetyEscalation, Long> {
    List<SafetyEscalation> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<SafetyEscalation> findByStatusOrderByCreatedAtDesc(String status);
    List<SafetyEscalation> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(s) FROM SafetyEscalation s WHERE s.userId = :userId AND s.status = 'OPEN' AND s.escalationType = 'PAIN_REPORT'")
    long countOpenPainEscalationsForUser(@Param("userId") Long userId);
}
