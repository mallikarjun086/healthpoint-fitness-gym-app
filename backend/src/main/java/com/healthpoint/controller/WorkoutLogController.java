package com.healthpoint.controller;

import com.healthpoint.entity.WorkoutLog;
import com.healthpoint.service.WorkoutLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout/logs")
public class WorkoutLogController {

    private final WorkoutLogService workoutLogService;

    public WorkoutLogController(WorkoutLogService workoutLogService) {
        this.workoutLogService = workoutLogService;
    }

    @PostMapping("/add")
    public ResponseEntity<WorkoutLog> addLog(@RequestBody @NonNull WorkoutLog log) {
        return ResponseEntity.ok(workoutLogService.logWorkout(log));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutLog>> getUserLogs(@PathVariable @NonNull Long userId) {
        return ResponseEntity.ok(workoutLogService.getUserLogs(userId));
    }
}
