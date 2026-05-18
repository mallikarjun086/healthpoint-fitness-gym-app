package com.healthpoint.repository;

import com.healthpoint.entity.AddOnSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddOnSubscriptionRepository extends JpaRepository<AddOnSubscription, Long> {
    List<AddOnSubscription> findByUserIdAndIsActiveTrue(Long userId);

    @Query("""
            SELECT a
            FROM AddOnSubscription a
            WHERE a.user.id = :userId
              AND a.plan.id = :planId
              AND a.isActive = true
              AND a.endDate > CURRENT_TIMESTAMP
            """)
    Optional<AddOnSubscription> findActiveByUserIdAndPlanId(@Param("userId") Long userId, @Param("planId") Long planId);

    @Query("SELECT a FROM AddOnSubscription a WHERE a.user.id = :userId AND a.isActive = true AND a.endDate > CURRENT_TIMESTAMP")
    List<AddOnSubscription> findActiveByUserId(Long userId);
}