package com.healthpoint.repository;

import com.healthpoint.entity.ReadinessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReadinessLogRepository extends JpaRepository<ReadinessLog, Long> {

    Optional<ReadinessLog> findByUserIdAndCalculationDate(Long userId, LocalDate calculationDate);

    @Query("SELECT r FROM ReadinessLog r WHERE r.userId = :userId AND r.calculationDate >= :startDate ORDER BY r.calculationDate ASC")
    List<ReadinessLog> findByUserIdSince(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);

    @Query("SELECT r FROM ReadinessLog r WHERE r.userId = :userId ORDER BY r.calculationDate DESC")
    List<ReadinessLog> findRecentByUserId(@Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM ReadinessLog r WHERE r.userId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
