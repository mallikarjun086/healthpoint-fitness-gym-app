package com.healthpoint.repository;
import com.healthpoint.entity.ProgressLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProgressLogRepository extends JpaRepository<ProgressLog, Long> {
    List<ProgressLog> findTop5ByUserIdOrderByLoggedDateDesc(Long userId);
}
