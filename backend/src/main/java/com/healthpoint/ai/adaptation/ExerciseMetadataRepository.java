package com.healthpoint.ai.adaptation;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ExerciseMetadataRepository extends JpaRepository<ExerciseMetadata, Long> {
    Optional<ExerciseMetadata> findByNameIgnoreCase(String name);
}
