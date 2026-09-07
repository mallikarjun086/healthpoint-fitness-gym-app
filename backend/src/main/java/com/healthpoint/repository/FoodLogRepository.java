package com.healthpoint.repository;

import com.healthpoint.entity.FoodLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface FoodLogRepository extends JpaRepository<FoodLog, Long> {
    List<FoodLog> findByUserIdAndLogDateOrderByLoggedAtAsc(Long userId, LocalDate logDate);
    List<FoodLog> findByUserIdOrderByLogDateDesc(Long userId);
}
