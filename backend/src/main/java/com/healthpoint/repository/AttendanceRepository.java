package com.healthpoint.repository;

import com.healthpoint.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.userId = :userId AND a.attendanceDate >= :startDate")
    long countCheckInsSince(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);

    List<Attendance> findByUserIdOrderByCheckInTimeDesc(Long userId);
}

