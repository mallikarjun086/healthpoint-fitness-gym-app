package com.healthpoint.repository;
import com.healthpoint.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.userId = :userId AND a.checkInDate >= :startDate")
    long countCheckInsSince(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
}
