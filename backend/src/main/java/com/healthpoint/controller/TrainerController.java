package com.healthpoint.controller;

import com.healthpoint.entity.TrainerClientAssignment;
import com.healthpoint.entity.User;
import com.healthpoint.entity.UserProfile;
import com.healthpoint.entity.WorkoutLog;
import com.healthpoint.repository.TrainerClientAssignmentRepository;
import com.healthpoint.repository.UserProfileRepository;
import com.healthpoint.repository.UserRepository;
import com.healthpoint.repository.WorkoutLogRepository;
import com.healthpoint.service.GoalPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/trainer")
public class TrainerController {

    private final TrainerClientAssignmentRepository assignmentRepo;
    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final WorkoutLogRepository workoutLogRepo;
    private final GoalPlanService goalPlanService;

    public TrainerController(TrainerClientAssignmentRepository assignmentRepo,
                             UserRepository userRepo,
                             UserProfileRepository profileRepo,
                             WorkoutLogRepository workoutLogRepo,
                             GoalPlanService goalPlanService) {
        this.assignmentRepo = assignmentRepo;
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
        this.workoutLogRepo = workoutLogRepo;
        this.goalPlanService = goalPlanService;
    }

    @GetMapping("/clients")
    public ResponseEntity<List<Map<String, Object>>> getAssignedClients(
            @RequestParam(required = false) Long trainerId,
            org.springframework.security.core.Authentication auth) {
        if (trainerId == null && auth != null && auth.getPrincipal() instanceof Long) {
            trainerId = (Long) auth.getPrincipal();
        }
        // Fallback to first trainer if not specified
        if (trainerId == null) {
            Optional<User> trainerOpt = userRepo.findByEmail("trainer@hp.com");
            if (trainerOpt.isPresent()) {
                trainerId = trainerOpt.get().getId();
            } else {
                return ResponseEntity.ok(Collections.emptyList());
            }
        }

        List<TrainerClientAssignment> assignments = assignmentRepo.findByTrainerId(trainerId);
        List<Map<String, Object>> response = new ArrayList<>();

        for (TrainerClientAssignment tca : assignments) {
            User client = tca.getClient();
            Optional<UserProfile> profileOpt = profileRepo.findByUserId(client.getId());
            List<WorkoutLog> logs = workoutLogRepo.findTop5ByUserIdOrderByCompletedAtDesc(client.getId());

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("assignmentId", tca.getId());
            map.put("id", client.getId());
            map.put("name", client.getName());
            map.put("email", client.getEmail());
            map.put("phone", client.getPhoneNumber());
            map.put("status", tca.getStatus());
            map.put("assignedAt", tca.getAssignedAt());
            map.put("notes", tca.getNotes());
            UserProfile profile = profileOpt.orElse(null);
            map.put("goal", profile != null && profile.getGoalType() != null ? profile.getGoalType() : "Aesthetic");
            map.put("experience", profile != null && profile.getExperienceLevel() != null ? profile.getExperienceLevel() : "Intermediate");
            map.put("bmi", profile != null && profile.getBmi() != null ? profile.getBmi() : 22.5);
            map.put("weightKg", profile != null && profile.getWeightKg() != null ? profile.getWeightKg() : 70.0);
            map.put("heightCm", profile != null && profile.getHeightCm() != null ? profile.getHeightCm() : 175.0);
            map.put("workoutLogsCount", logs.size());
            map.put("lastWorkout", logs.isEmpty() ? "No session recorded" : "Completed " + logs.get(0).getCompletionPercentage() + "%");
            map.put("attendance", "94%");

            response.add(map);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all-members")
    public ResponseEntity<List<User>> getAllMembers() {
        List<User> members = userRepo.findAll().stream()
                .filter(u -> "MEMBER".equalsIgnoreCase(u.getRole()))
                .toList();
        return ResponseEntity.ok(members);
    }

    @PostMapping("/assign-client")
    public ResponseEntity<Map<String, Object>> assignClient(
            @RequestBody Map<String, Object> payload,
            org.springframework.security.core.Authentication auth) {
        Long trainerId = null;
        if (payload.containsKey("trainerId") && payload.get("trainerId") != null) {
            trainerId = Long.valueOf(payload.get("trainerId").toString());
        } else if (auth != null && auth.getPrincipal() instanceof Long) {
            trainerId = (Long) auth.getPrincipal();
        }
        if (trainerId == null) {
            Optional<User> trainerOpt = userRepo.findByEmail("trainer@hp.com");
            trainerId = trainerOpt.isPresent() ? trainerOpt.get().getId() : 2L;
        }

        Long clientId = Long.valueOf(payload.get("clientId").toString());
        String notes = payload.containsKey("notes") ? payload.get("notes").toString() : "Assigned personal trainer";

        User trainer = userRepo.findById(Objects.requireNonNull(trainerId)).orElseThrow(() -> new RuntimeException("Trainer not found"));
        User client = userRepo.findById(Objects.requireNonNull(clientId)).orElseThrow(() -> new RuntimeException("Client not found"));

        TrainerClientAssignment tca = assignmentRepo.findByClientIdAndStatus(clientId, "ACTIVE")
                .orElse(new TrainerClientAssignment());

        tca.setTrainer(trainer);
        tca.setClient(client);
        tca.setStatus("ACTIVE");
        tca.setNotes(notes);

        assignmentRepo.save(tca);

        return ResponseEntity.ok(Map.of("message", "Client successfully assigned to trainer " + trainer.getName()));
    }

    @PostMapping("/assign-plan")
    public ResponseEntity<Map<String, Object>> assignPlanToClient(@RequestBody Map<String, Object> payload) {
        Long clientId = Long.valueOf(payload.get("clientId").toString());
        String workoutJson = payload.get("workoutJson").toString();

        goalPlanService.updateWorkoutPlanFromJson(clientId, workoutJson);

        return ResponseEntity.ok(Map.of("message", "Custom workout plan successfully assigned to client!"));
    }

    @GetMapping("/client/{clientId}/history")
    public ResponseEntity<Map<String, Object>> getClientHistory(@PathVariable Long clientId) {
        User client = userRepo.findById(Objects.requireNonNull(clientId)).orElseThrow(() -> new RuntimeException("Client not found"));
        Optional<UserProfile> profileOpt = profileRepo.findByUserId(clientId);
        List<WorkoutLog> logs = workoutLogRepo.findTop5ByUserIdOrderByCompletedAtDesc(clientId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("user", client);
        result.put("profile", profileOpt.orElse(null));
        result.put("recentLogs", logs);

        return ResponseEntity.ok(result);
    }
}
