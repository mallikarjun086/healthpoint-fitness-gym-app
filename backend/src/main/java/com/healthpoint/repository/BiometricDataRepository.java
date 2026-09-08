package com.healthpoint.repository;

import com.healthpoint.entity.BiometricData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BiometricDataRepository extends JpaRepository<BiometricData, Long> {

    Optional<BiometricData> findByUserIdAndRecordedDate(Long userId, LocalDate recordedDate);

    @Query("SELECT b FROM BiometricData b WHERE b.userId = :userId AND b.recordedDate >= :startDate AND b.recordedDate <= :endDate ORDER BY b.recordedDate ASC")
    List<BiometricData> findByUserIdAndDateRange(@Param("userId") Long userId,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM BiometricData b WHERE b.userId = :userId ORDER BY b.recordedDate DESC")
    List<BiometricData> findRecentByUserId(@Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM BiometricData b WHERE b.userId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
