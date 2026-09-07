package com.healthpoint.repository;

import com.healthpoint.entity.ProgressLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProgressLogRepository extends JpaRepository<ProgressLog, Long> {
    List<ProgressLog> findByUserIdOrderByLogDateAsc(Long userId);
    List<ProgressLog> findByUserIdOrderByLogDateDesc(Long userId);
    List<ProgressLog> findTop10ByUserIdOrderByLogDateDesc(Long userId);
    List<ProgressLog> findTop5ByUserIdOrderByLogDateDesc(Long userId);
}

