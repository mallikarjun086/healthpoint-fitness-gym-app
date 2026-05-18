package com.healthpoint.service;

import com.healthpoint.entity.WorkoutLog;
import com.healthpoint.repository.WorkoutLogRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;

    public WorkoutLogService(WorkoutLogRepository workoutLogRepository) {
        this.workoutLogRepository = workoutLogRepository;
    }

    public WorkoutLog logWorkout(@NonNull WorkoutLog log) {
        return workoutLogRepository.save(log);
    }

    public List<WorkoutLog> getUserLogs(@NonNull Long userId) {
        return workoutLogRepository.findByUserIdOrderByCompletedAtDesc(userId);
    }
}
