package com.healthpoint.repository;

import com.healthpoint.entity.ChallengeEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeEnrollmentRepository extends JpaRepository<ChallengeEnrollment, Long> {
    List<ChallengeEnrollment> findByUserIdOrderByEnrolledAtDesc(Long userId);
    Optional<ChallengeEnrollment> findByUserIdAndChallengeId(Long userId, Long challengeId);
    boolean existsByUserIdAndChallengeId(Long userId, Long challengeId);
}
