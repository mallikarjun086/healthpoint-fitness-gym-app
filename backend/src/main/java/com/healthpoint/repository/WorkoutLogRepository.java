package com.healthpoint.repository;
import com.healthpoint.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
    @Query("SELECT AVG(w.completionPercentage) FROM WorkoutLog w WHERE w.userId = :userId AND w.completedAt >= :startDate")
    Double getAverageCompletionSince(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);

    List<WorkoutLog> findByUserIdOrderByCompletedAtDesc(Long userId);
}
