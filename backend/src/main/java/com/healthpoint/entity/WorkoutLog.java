package com.healthpoint.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_log", indexes = {@Index(name = "idx_wl_user_time", columnList = "userId, completedAt")})
@Data
public class WorkoutLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private Long workoutPlanId;
    
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private int completionPercentage; // 0-100
    
    @OneToMany(mappedBy = "workoutLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExerciseLog> exerciseLogs = new ArrayList<>();
}
