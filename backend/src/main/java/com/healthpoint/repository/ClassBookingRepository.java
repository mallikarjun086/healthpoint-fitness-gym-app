package com.healthpoint.repository;

import com.healthpoint.entity.ClassBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ClassBookingRepository extends JpaRepository<ClassBooking, Long> {
    List<ClassBooking> findByUserIdOrderByBookedAtDesc(Long userId);
    Optional<ClassBooking> findByUserIdAndClassSessionId(Long userId, Long classSessionId);
    List<ClassBooking> findByClassSessionId(Long classSessionId);
}
