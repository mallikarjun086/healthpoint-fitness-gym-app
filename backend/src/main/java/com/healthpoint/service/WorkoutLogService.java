package com.healthpoint.service;

import com.healthpoint.entity.WorkoutLog;
import com.healthpoint.repository.WorkoutLogRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;
    private final GamificationService gamificationService;

    public WorkoutLogService(WorkoutLogRepository workoutLogRepository,
                             GamificationService gamificationService) {
        this.workoutLogRepository = workoutLogRepository;
        this.gamificationService = gamificationService;
    }

    public WorkoutLog logWorkout(@NonNull WorkoutLog log) {
        WorkoutLog saved = workoutLogRepository.save(log);
        if (saved.getUserId() != null) {
            gamificationService.onWorkoutCompleted(saved.getUserId(), saved);
        }
        return saved;
    }

    public List<WorkoutLog> getUserLogs(@NonNull Long userId) {
        return workoutLogRepository.findByUserIdOrderByCompletedAtDesc(userId);
    }
}

