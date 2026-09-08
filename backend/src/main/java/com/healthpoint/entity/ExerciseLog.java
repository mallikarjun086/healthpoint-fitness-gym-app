package com.healthpoint.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "exercise_log")
@Data
public class ExerciseLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_log_id")
    private WorkoutLog workoutLog;
    
    private String exerciseName;
    private int setsCompleted;
    private int repsCompleted;
    private double weightKg;
    private Integer rpe;
    private String notes;
}
