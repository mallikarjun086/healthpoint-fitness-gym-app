package com.healthpoint.service;

import com.healthpoint.entity.*;
import com.healthpoint.repository.*;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class GamificationService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserStreakRepository userStreakRepository;
    private final ChallengeRepository challengeRepository;
    private final ChallengeEnrollmentRepository challengeEnrollmentRepository;
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final ReadinessLogRepository readinessLogRepository;

    public GamificationService(AchievementRepository achievementRepository,
                               UserAchievementRepository userAchievementRepository,
                               UserStreakRepository userStreakRepository,
                               ChallengeRepository challengeRepository,
                               ChallengeEnrollmentRepository challengeEnrollmentRepository,
                               FriendshipRepository friendshipRepository,
                               UserRepository userRepository,
                               ReadinessLogRepository readinessLogRepository) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.userStreakRepository = userStreakRepository;
        this.challengeRepository = challengeRepository;
        this.challengeEnrollmentRepository = challengeEnrollmentRepository;
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.readinessLogRepository = readinessLogRepository;
    }

    @Transactional
    public Map<String, Object> onWorkoutCompleted(Long userId, WorkoutLog workoutLog) {
        List<Achievement> newlyUnlocked = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // 1. Retrieve or initialize user streak
        UserStreak streak = userStreakRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserStreak newStreak = new UserStreak();
                    newStreak.setUserId(userId);
                    newStreak.setCurrentStreak(0);
                    newStreak.setLongestStreak(0);
                    newStreak.setTotalWorkoutsCompleted(0);
                    newStreak.setConsistencyIndex(85.0);
                    return newStreak;
                });

        boolean isFirstWorkoutEver = (streak.getTotalWorkoutsCompleted() == 0) &&
                !userAchievementRepository.existsByUserIdAndAchievementCode(userId, "FIRST_WORKOUT");

        streak.setTotalWorkoutsCompleted(streak.getTotalWorkoutsCompleted() + 1);

        // 2. Day-1 Achievement check
        if (isFirstWorkoutEver) {
            Achievement firstWorkoutBadge = awardAchievementIfEligible(userId, "FIRST_WORKOUT");
            if (firstWorkoutBadge != null) {
                newlyUnlocked.add(firstWorkoutBadge);
            }
        }

        // 3. Streak Progression with Recovery Freeze Logic
        LocalDate lastActivity = streak.getLastActivityDate();
        if (lastActivity == null) {
            streak.setCurrentStreak(1);
            streak.setIsFrozen(false);
        } else if (lastActivity.equals(today)) {
            // Already logged today, maintain streak
            streak.setIsFrozen(false);
        } else if (lastActivity.equals(today.minusDays(1))) {
            // Consecutive day
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            streak.setIsFrozen(false);
            streak.setFreezeReason(null);
        } else {
            // Missed 1 or more days -> Check if readiness was low / deload on missed day
            long daysMissed = ChronoUnit.DAYS.between(lastActivity, today);
            boolean wasRecoveryDay = checkWasRecoveryDay(userId, today.minusDays(1));

            if (daysMissed == 2 && wasRecoveryDay) {
                // Streak freeze protection applied!
                streak.setIsFrozen(true);
                streak.setFrozenDate(today.minusDays(1));
                streak.setFreezeReason("Autonomic Recovery Protection (<50 Readiness Score)");
                streak.setCurrentStreak(streak.getCurrentStreak() + 1); // Resume without penalty
            } else {
                // Reset streak
                streak.setCurrentStreak(1);
                streak.setIsFrozen(false);
                streak.setFreezeReason(null);
            }
        }

        streak.setLastActivityDate(today);
        if (streak.getCurrentStreak() > streak.getLongestStreak()) {
            streak.setLongestStreak(streak.getCurrentStreak());
        }

        // Update consistency index (baseline 80 + up to 20 based on streak)
        double calculatedConsistency = Math.min(100.0, 75.0 + (streak.getCurrentStreak() * 2.5));
        streak.setConsistencyIndex(Math.round(calculatedConsistency * 10.0) / 10.0);
        streak.setUpdatedAt(LocalDateTime.now());
        userStreakRepository.save(streak);

        // 4. Milestone Badges Check
        if (streak.getCurrentStreak() >= 7) {
            Achievement badge = awardAchievementIfEligible(userId, "STREAK_7_DAY");
            if (badge != null) newlyUnlocked.add(badge);
        }
        if (streak.getCurrentStreak() >= 30) {
            Achievement badge = awardAchievementIfEligible(userId, "STREAK_30_DAY");
            if (badge != null) newlyUnlocked.add(badge);
        }
        if (streak.getTotalWorkoutsCompleted() >= 100) {
            Achievement badge = awardAchievementIfEligible(userId, "CENTURY_LIFTER");
            if (badge != null) newlyUnlocked.add(badge);
        }

        // 5. Update Time-Boxed Challenge Progress
        List<ChallengeEnrollment> enrollments = challengeEnrollmentRepository.findByUserIdOrderByEnrolledAtDesc(userId);
        for (ChallengeEnrollment enrollment : enrollments) {
            if (!Boolean.TRUE.equals(enrollment.getIsCompleted())) {
                enrollment.setCurrentProgress(enrollment.getCurrentProgress() + 1);
                if (enrollment.getCurrentProgress() >= enrollment.getChallenge().getTargetValue()) {
                    enrollment.setIsCompleted(true);
                    enrollment.setCompletedAt(LocalDateTime.now());

                    // Award challenge badge if defined
                    if (enrollment.getChallenge().getRewardBadgeCode() != null) {
                        Achievement rewardBadge = awardAchievementIfEligible(userId, enrollment.getChallenge().getRewardBadgeCode());
                        if (rewardBadge != null) newlyUnlocked.add(rewardBadge);
                    }
                }
                challengeEnrollmentRepository.save(enrollment);
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("streak", streak);
        result.put("newlyUnlockedAchievements", newlyUnlocked);
        result.put("totalWorkoutsCompleted", streak.getTotalWorkoutsCompleted());
        return result;
    }

    private boolean checkWasRecoveryDay(Long userId, LocalDate date) {
        return readinessLogRepository.findByUserIdAndCalculationDate(userId, date)
                .map(r -> r.getReadinessScore() < 50 || "DELOAD_TRIGGERED".equalsIgnoreCase(r.getStatusCategory()))
                .orElse(false);
    }

    @Transactional
    public Achievement awardAchievementIfEligible(Long userId, String achievementCode) {
        if (userAchievementRepository.existsByUserIdAndAchievementCode(userId, achievementCode)) {
            return null; // Already possessed
        }
        Optional<Achievement> achievementOpt = achievementRepository.findByCode(achievementCode);
        if (achievementOpt.isEmpty()) {
            return null;
        }

        Achievement achievement = achievementOpt.get();
        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setUserId(userId);
        userAchievement.setAchievement(achievement);
        userAchievement.setUnlockedAt(LocalDateTime.now());
        userAchievementRepository.save(userAchievement);

        return achievement;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getGamificationSummary(Long userId) {
        UserStreak streak = userStreakRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserStreak s = new UserStreak();
                    s.setUserId(userId);
                    s.setCurrentStreak(0);
                    s.setLongestStreak(0);
                    s.setTotalWorkoutsCompleted(0);
                    s.setConsistencyIndex(85.0);
                    return s;
                });

        List<UserAchievement> userAchievements = userAchievementRepository.findByUserIdOrderByUnlockedAtDesc(userId);
        List<Achievement> allAchievements = achievementRepository.findAll();
        Set<String> unlockedCodes = new HashSet<>();
        Map<String, LocalDateTime> unlockedAtMap = new HashMap<>();

        for (UserAchievement ua : userAchievements) {
            unlockedCodes.add(ua.getAchievement().getCode());
            unlockedAtMap.put(ua.getAchievement().getCode(), ua.getUnlockedAt());
        }

        List<Map<String, Object>> badgesList = new ArrayList<>();
        int totalEarnedPoints = 0;

        for (Achievement a : allAchievements) {
            Map<String, Object> badgeItem = new LinkedHashMap<>();
            badgeItem.put("id", a.getId());
            badgeItem.put("code", a.getCode());
            badgeItem.put("title", a.getTitle());
            badgeItem.put("description", a.getDescription());
            badgeItem.put("iconName", a.getIconName());
            badgeItem.put("badgeTier", a.getBadgeTier());
            badgeItem.put("points", a.getPoints());
            boolean isUnlocked = unlockedCodes.contains(a.getCode());
            badgeItem.put("isUnlocked", isUnlocked);
            badgeItem.put("unlockedAt", unlockedAtMap.get(a.getCode()));
            if (isUnlocked) {
                totalEarnedPoints += a.getPoints();
            }
            badgesList.add(badgeItem);
        }

        List<Challenge> activeChallenges = challengeRepository.findByIsActiveTrueOrderByStartDateDesc();
        List<ChallengeEnrollment> enrollments = challengeEnrollmentRepository.findByUserIdOrderByEnrolledAtDesc(userId);
        Map<Long, ChallengeEnrollment> enrollmentMap = new HashMap<>();
        for (ChallengeEnrollment ce : enrollments) {
            enrollmentMap.put(ce.getChallenge().getId(), ce);
        }

        List<Map<String, Object>> challengesList = new ArrayList<>();
        for (Challenge c : activeChallenges) {
            Map<String, Object> cMap = new LinkedHashMap<>();
            cMap.put("id", c.getId());
            cMap.put("code", c.getCode());
            cMap.put("title", c.getTitle());
            cMap.put("description", c.getDescription());
            cMap.put("category", c.getCategory());
            cMap.put("targetMetric", c.getTargetMetric());
            cMap.put("targetValue", c.getTargetValue());
            cMap.put("durationDays", c.getDurationDays());
            cMap.put("startDate", c.getStartDate());
            cMap.put("endDate", c.getEndDate());
            cMap.put("rewardBadgeCode", c.getRewardBadgeCode());

            ChallengeEnrollment en = enrollmentMap.get(c.getId());
            if (en != null) {
                cMap.put("isEnrolled", true);
                cMap.put("currentProgress", en.getCurrentProgress());
                cMap.put("isCompleted", en.getIsCompleted());
                cMap.put("completedAt", en.getCompletedAt());
                cMap.put("percentComplete", Math.min(100, (int) Math.round((double) en.getCurrentProgress() / c.getTargetValue() * 100)));
            } else {
                cMap.put("isEnrolled", false);
                cMap.put("currentProgress", 0);
                cMap.put("isCompleted", false);
                cMap.put("percentComplete", 0);
            }
            challengesList.add(cMap);
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("streak", streak);
        summary.put("totalEarnedPoints", totalEarnedPoints);
        summary.put("badges", badgesList);
        summary.put("challenges", challengesList);
        return summary;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getFriendsLeaderboard(@NonNull Long userId) {
        List<Long> friendIds = new ArrayList<>(friendshipRepository.findFriendUserIdsByUserId(userId));
        if (!friendIds.contains(userId)) {
            friendIds.add(userId);
        }

        List<Map<String, Object>> leaderboard = new ArrayList<>();
        for (Long uid : friendIds) {
            if (uid == null) continue;
            Optional<User> userOpt = userRepository.findById(uid);
            if (userOpt.isEmpty()) continue;

            User u = userOpt.get();
            UserStreak s = userStreakRepository.findByUserId(uid).orElseGet(() -> {
                UserStreak newS = new UserStreak();
                newS.setUserId(uid);
                newS.setCurrentStreak(0);
                newS.setConsistencyIndex(75.0);
                newS.setTotalWorkoutsCompleted(0);
                return newS;
            });

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("userId", u.getId());
            entry.put("name", u.getName());
            entry.put("email", u.getEmail());
            entry.put("isCurrentUser", uid.equals(userId));
            entry.put("currentStreak", s.getCurrentStreak());
            entry.put("longestStreak", s.getLongestStreak());
            entry.put("totalWorkouts", s.getTotalWorkoutsCompleted());
            entry.put("consistencyIndex", s.getConsistencyIndex() != null ? s.getConsistencyIndex() : 80.0);
            entry.put("isFrozen", Boolean.TRUE.equals(s.getIsFrozen()));
            entry.put("freezeReason", s.getFreezeReason());
            leaderboard.add(entry);
        }

        // Rank strictly by Consistency Index (Adherence %) to prevent reckless ego lifting
        leaderboard.sort((a, b) -> {
            double cA = (double) a.get("consistencyIndex");
            double cB = (double) b.get("consistencyIndex");
            if (Double.compare(cB, cA) != 0) {
                return Double.compare(cB, cA);
            }
            int sA = (int) a.get("currentStreak");
            int sB = (int) b.get("currentStreak");
            return Integer.compare(sB, sA);
        });

        int rank = 1;
        for (Map<String, Object> entry : leaderboard) {
            entry.put("rank", rank++);
        }

        return leaderboard;
    }

    @Transactional
    public ChallengeEnrollment enrollInChallenge(@NonNull Long userId, @NonNull Long challengeId) {
        return challengeEnrollmentRepository.findByUserIdAndChallengeId(userId, challengeId)
                .orElseGet(() -> {
                    Challenge challenge = challengeRepository.findById(challengeId)
                            .orElseThrow(() -> new IllegalArgumentException("Challenge not found with id: " + challengeId));
                    ChallengeEnrollment en = new ChallengeEnrollment();
                    en.setUserId(userId);
                    en.setChallenge(challenge);
                    en.setCurrentProgress(0);
                    en.setIsCompleted(false);
                    return challengeEnrollmentRepository.save(en);
                });
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getProgressRecap(@NonNull Long userId, String period) {
        UserStreak streak = userStreakRepository.findByUserId(userId).orElse(new UserStreak());
        List<UserAchievement> userAchievements = userAchievementRepository.findByUserIdOrderByUnlockedAtDesc(userId);
        User user = userRepository.findById(userId).orElse(null);

        Map<String, Object> recap = new LinkedHashMap<>();
        recap.put("userName", user != null ? user.getName() : "HealthPoint Athlete");
        recap.put("period", period != null ? period : "Monthly Review - " + LocalDate.now().getMonth().name());
        recap.put("totalWorkoutsCompleted", streak.getTotalWorkoutsCompleted());
        recap.put("currentStreakDays", streak.getCurrentStreak());
        recap.put("longestStreakDays", streak.getLongestStreak());
        recap.put("consistencyIndex", streak.getConsistencyIndex() != null ? streak.getConsistencyIndex() : 88.5);
        recap.put("achievementsUnlockedCount", userAchievements.size());
        recap.put("muscleBalanceDistribution", Map.of(
                "Chest & Push", 28,
                "Back & Pull", 27,
                "Legs & Posterior", 25,
                "Core & Mobility", 20
        ));
        recap.put("generatedAt", LocalDateTime.now());
        return recap;
    }

    @Transactional(readOnly = true)
    public List<Challenge> getActiveChallenges() {
        return challengeRepository.findAll();
    }
}
