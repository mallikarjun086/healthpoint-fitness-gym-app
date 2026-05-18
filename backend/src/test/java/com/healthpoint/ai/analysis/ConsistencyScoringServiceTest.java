package com.healthpoint.ai.analysis;

import com.healthpoint.repository.AttendanceRepository;
import com.healthpoint.repository.WorkoutLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class ConsistencyScoringServiceTest {

    @Mock
    private AttendanceRepository attendanceRepo;

    @Mock
    private WorkoutLogRepository workoutLogRepo;

    @InjectMocks
    private ConsistencyScoringService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testPerfectConsistency() {
        when(attendanceRepo.countCheckInsSince(eq(1L), any())).thenReturn(14L);
        when(workoutLogRepo.getAverageCompletionSince(eq(1L), any())).thenReturn(100.0);
        
        int score = service.calculateConsistencyScore(1L);
        assertEquals(100, score);
        assertEquals("HIGHLY_CONSISTENT", service.getConsistencyInterpretation(score));
    }

    @Test
    void testHighChurnRisk() {
        when(attendanceRepo.countCheckInsSince(eq(1L), any())).thenReturn(2L);
        when(workoutLogRepo.getAverageCompletionSince(eq(1L), any())).thenReturn(40.0);
        
        int score = service.calculateConsistencyScore(1L);
        // ( (2/14)*100 * 0.5 ) + (40 * 0.5) => (14 * 0.5) + (20) = 7 + 20 = 27
        assertEquals(27, score);
        assertEquals("HIGH_CHURN_RISK", service.getConsistencyInterpretation(score));
    }
}
