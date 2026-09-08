package com.healthpoint.controller;

import com.healthpoint.entity.Achievement;
import com.healthpoint.entity.ChallengeEnrollment;
import com.healthpoint.service.GamificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {

    private final GamificationService gamificationService;

    public GamificationController(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    @GetMapping("/summary/{userId}")
    public ResponseEntity<Map<String, Object>> getSummary(@PathVariable @NonNull Long userId) {
        return ResponseEntity.ok(gamificationService.getGamificationSummary(userId));
    }

    @GetMapping("/leaderboard/friends/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getFriendsLeaderboard(@PathVariable @NonNull Long userId) {
        return ResponseEntity.ok(gamificationService.getFriendsLeaderboard(userId));
    }

    @GetMapping("/challenges")
    public ResponseEntity<List<com.healthpoint.entity.Challenge>> getChallenges() {
        return ResponseEntity.ok(gamificationService.getActiveChallenges());
    }

    @PostMapping("/challenges/{challengeId}/enroll")
    public ResponseEntity<ChallengeEnrollment> enrollInChallenge(@PathVariable @NonNull Long challengeId,
                                                                @RequestParam @NonNull Long userId) {
        return ResponseEntity.ok(gamificationService.enrollInChallenge(userId, challengeId));
    }

    @GetMapping("/recap/{userId}")
    public ResponseEntity<Map<String, Object>> getProgressRecap(@PathVariable @NonNull Long userId,
                                                               @RequestParam(required = false) String period) {
        return ResponseEntity.ok(gamificationService.getProgressRecap(userId, period));
    }

    @PostMapping("/badges/claim-form-mastery")
    public ResponseEntity<Map<String, Object>> claimFormMasteryBadge(@RequestParam @NonNull Long userId,
                                                                     @RequestParam double score) {
        if (score >= 0.90) {
            Achievement badge = gamificationService.awardAchievementIfEligible(userId, "FORM_PERFECTIONIST");
            return ResponseEntity.ok(Map.of("success", true, "badge", badge != null ? badge : "ALREADY_OWNED"));
        }
        return ResponseEntity.ok(Map.of("success", false, "message", "Form accuracy score below 90% threshold"));
    }

    @PostMapping("/badges/claim-recovery-mastery")
    public ResponseEntity<Map<String, Object>> claimRecoveryMasteryBadge(@RequestParam @NonNull Long userId) {
        Achievement badge = gamificationService.awardAchievementIfEligible(userId, "RECOVERY_SCHOLAR");
        return ResponseEntity.ok(Map.of("success", true, "badge", badge != null ? badge : "ALREADY_OWNED"));
    }
}
