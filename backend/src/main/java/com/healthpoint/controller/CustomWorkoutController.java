package com.healthpoint.controller;

import com.healthpoint.entity.CustomWorkout;
import com.healthpoint.service.CustomWorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/custom-workouts")
@SuppressWarnings("null")
public class CustomWorkoutController {

    private final CustomWorkoutService customWorkoutService;

    public CustomWorkoutController(CustomWorkoutService customWorkoutService) {
        this.customWorkoutService = customWorkoutService;
    }

    private Long resolveUserId(Authentication auth, Long requestedUserId) {
        if (requestedUserId != null) {
            return requestedUserId;
        }
        if (auth != null && auth.getPrincipal() instanceof Long) {
            return (Long) auth.getPrincipal();
        }
        return 3L; // Default to standard authenticated member (Mallikarjun Gala)
    }

    @GetMapping
    public ResponseEntity<List<CustomWorkout>> getUserWorkouts(
            @RequestParam(required = false) Long userId,
            Authentication auth) {
        Long resolvedId = resolveUserId(auth, userId);
        return ResponseEntity.ok(customWorkoutService.getWorkoutsForUser(resolvedId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomWorkout> getWorkoutById(
            @PathVariable @NonNull Long id,
            @RequestParam(required = false) Long userId,
            Authentication auth) {
        Long resolvedId = resolveUserId(auth, userId);
        return customWorkoutService.getWorkoutById(id, resolvedId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CustomWorkout> createWorkout(
            @RequestBody @NonNull CustomWorkout workout,
            @RequestParam(required = false) Long userId,
            Authentication auth) {
        Long resolvedId = resolveUserId(auth, userId);
        return ResponseEntity.ok(customWorkoutService.createOrUpdateWorkout(resolvedId, workout));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(
            @PathVariable @NonNull Long id,
            @RequestParam(required = false) Long userId,
            Authentication auth) {
        Long resolvedId = resolveUserId(auth, userId);
        boolean deleted = customWorkoutService.deleteWorkout(id, resolvedId);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
