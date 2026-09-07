package com.healthpoint.repository;

import com.healthpoint.entity.ClassSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {
    List<ClassSession> findBySessionDateGreaterThanEqualOrderBySessionDateAscStartTimeAsc(LocalDate date);
    List<ClassSession> findByCategoryIgnoreCase(String category);
    List<ClassSession> findByInstructorNameContainingIgnoreCase(String instructorName);
}
