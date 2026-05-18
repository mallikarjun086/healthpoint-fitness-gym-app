package com.healthpoint.ai.analysis;

import com.healthpoint.repository.AttendanceRepository;
import com.healthpoint.repository.WorkoutLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class ConsistencyScoringService {

    private final AttendanceRepository attendanceRepo;
    private final WorkoutLogRepository workoutLogRepo;

    public ConsistencyScoringService(AttendanceRepository attendanceRepo, WorkoutLogRepository workoutLogRepo) {
        this.attendanceRepo = attendanceRepo;
        this.workoutLogRepo = workoutLogRepo;
    }

    public int calculateConsistencyScore(Long userId) {
        LocalDate thirtyDaysAgoDate = LocalDate.now().minusDays(30);
        LocalDateTime thirtyDaysAgoTime = LocalDateTime.now().minusDays(30);

        // Calculate Attendance Rate based on a standard expectation of ~14 days a month
        long checkIns = attendanceRepo.countCheckInsSince(userId, thirtyDaysAgoDate);
        double expectedCheckIns = 14.0;
        int attendanceRate = (int) Math.min(100, (checkIns / expectedCheckIns) * 100);

        // Calculate average Workout Completion %
        Double avgCompletion = workoutLogRepo.getAverageCompletionSince(userId, thirtyDaysAgoTime);
        int completionRate = avgCompletion != null ? avgCompletion.intValue() : 0;
        
        // Immediate penalty for 0 activity
        if (checkIns == 0 && completionRate == 0) {
            return 0;
        }

        // Base formula: 50% attendance frequency + 50% actual workout effort
        int score = (int) ((attendanceRate * 0.5) + (completionRate * 0.5));
        return Math.min(100, Math.max(0, score));
    }

    public String getConsistencyInterpretation(int score) {
        if (score < 30) return "HIGH_CHURN_RISK";
        if (score < 60) return "INCONSISTENT";
        if (score < 80) return "STABLE";
        return "HIGHLY_CONSISTENT";
    }
}
