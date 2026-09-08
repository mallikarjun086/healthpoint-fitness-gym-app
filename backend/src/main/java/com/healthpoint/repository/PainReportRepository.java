package com.healthpoint.repository;

import com.healthpoint.entity.PainReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PainReportRepository extends JpaRepository<PainReport, Long> {
    List<PainReport> findByUserIdOrderByReportedAtDesc(Long userId);

    @Query("SELECT COUNT(p) FROM PainReport p WHERE p.userId = :userId AND p.reportedAt >= :since")
    long countPainReportsSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
}
