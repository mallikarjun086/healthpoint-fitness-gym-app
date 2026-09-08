package com.healthpoint.repository;

import com.healthpoint.entity.ExerciseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExerciseLogRepository extends JpaRepository<ExerciseLog, Long> {
    List<ExerciseLog> findByWorkoutLogId(Long workoutLogId);
}
