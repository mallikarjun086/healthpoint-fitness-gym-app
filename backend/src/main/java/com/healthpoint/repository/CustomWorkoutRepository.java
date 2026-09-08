package com.healthpoint.repository;

import com.healthpoint.entity.CustomWorkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomWorkoutRepository extends JpaRepository<CustomWorkout, Long> {
    List<CustomWorkout> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<CustomWorkout> findByIdAndUserId(Long id, Long userId);
}
