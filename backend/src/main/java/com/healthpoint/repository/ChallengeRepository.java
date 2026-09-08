package com.healthpoint.repository;

import com.healthpoint.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByIsActiveTrueOrderByStartDateDesc();
    Optional<Challenge> findByCode(String code);
}
