package com.healthpoint.repository;

import com.healthpoint.entity.TrainerClientAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TrainerClientAssignmentRepository extends JpaRepository<TrainerClientAssignment, Long> {
    List<TrainerClientAssignment> findByTrainerIdAndStatus(Long trainerId, String status);
    List<TrainerClientAssignment> findByTrainerId(Long trainerId);
    Optional<TrainerClientAssignment> findByClientIdAndStatus(Long clientId, String status);
    boolean existsByTrainerIdAndClientId(Long trainerId, Long clientId);
}
