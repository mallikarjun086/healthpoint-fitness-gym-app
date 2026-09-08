package com.healthpoint.service;

import com.healthpoint.entity.CustomWorkout;
import com.healthpoint.entity.User;
import com.healthpoint.repository.CustomWorkoutRepository;
import com.healthpoint.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class CustomWorkoutService {

    private final CustomWorkoutRepository customWorkoutRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CustomWorkoutService(CustomWorkoutRepository customWorkoutRepository,
                                UserRepository userRepository,
                                NotificationService notificationService) {
        this.customWorkoutRepository = customWorkoutRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<CustomWorkout> getWorkoutsForUser(@NonNull Long userId) {
        return customWorkoutRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<CustomWorkout> getWorkoutById(@NonNull Long id, @NonNull Long userId) {
        return customWorkoutRepository.findByIdAndUserId(id, userId);
    }

    public CustomWorkout createOrUpdateWorkout(@NonNull Long userId, @NonNull CustomWorkout workout) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        workout.setUser(user);
        CustomWorkout saved = customWorkoutRepository.save(workout);

        try {
            com.healthpoint.entity.Notification notif = new com.healthpoint.entity.Notification();
            notif.setUserId(userId);
            notif.setTitle("Custom Routine Created! ⚡");
            notif.setMessage("Saved custom workout: " + saved.getTitle() + " (" + (saved.getTargetMuscleGroup() != null ? saved.getTargetMuscleGroup() : "Full Body") + ")");
            notif.setType("WORKOUT");
            notif.setLinkUrl("/member/workouts");
            notificationService.createNotification(notif);
        } catch (Exception ignored) {}

        return saved;
    }

    public boolean deleteWorkout(@NonNull Long id, @NonNull Long userId) {
        Optional<CustomWorkout> opt = customWorkoutRepository.findByIdAndUserId(id, userId);
        if (opt.isPresent()) {
            customWorkoutRepository.delete(opt.get());
            return true;
        }
        return false;
    }
}
