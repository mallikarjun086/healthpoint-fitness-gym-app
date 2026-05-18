package com.healthpoint.ai.adaptation;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "exercise_metadata")
@Data
public class ExerciseMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String primaryMuscle;
    private int spinalLoadLevel;
    
    @Column(columnDefinition = "TEXT")
    private String contraindications; // JSON string mapping injuries to risk
}
