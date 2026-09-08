package com.healthpoint.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthpoint.entity.BiometricData;
import com.healthpoint.entity.Notification;
import com.healthpoint.entity.ReadinessLog;
import com.healthpoint.entity.WearableConnection;
import com.healthpoint.repository.BiometricDataRepository;
import com.healthpoint.repository.ReadinessLogRepository;
import com.healthpoint.repository.WearableConnectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BiometricReadinessService {

    private final BiometricDataRepository biometricRepo;
    private final ReadinessLogRepository readinessRepo;
    private final WearableConnectionRepository wearableRepo;
    private final AdaptiveWorkoutService adaptiveWorkoutService;
    private final NotificationService notificationService;
    private final GoalPlanService goalPlanService;
    private final ObjectMapper objectMapper;

    public BiometricReadinessService(BiometricDataRepository biometricRepo,
                                    ReadinessLogRepository readinessRepo,
                                    WearableConnectionRepository wearableRepo,
                                    AdaptiveWorkoutService adaptiveWorkoutService,
                                    NotificationService notificationService,
                                    GoalPlanService goalPlanService,
                                    ObjectMapper objectMapper) {
        this.biometricRepo = biometricRepo;
        this.readinessRepo = readinessRepo;
        this.wearableRepo = wearableRepo;
        this.adaptiveWorkoutService = adaptiveWorkoutService;
        this.notificationService = notificationService;
        this.goalPlanService = goalPlanService;
        this.objectMapper = objectMapper;
    }

    /**
     * Compute or retrieve today's biometric readiness assessment
     */
    @Transactional
    public Map<String, Object> getTodayReadiness(Long userId) {
        LocalDate today = LocalDate.now();
        Optional<ReadinessLog> existing = readinessRepo.findByUserIdAndCalculationDate(userId, today);
        
        ReadinessLog log;
        if (existing.isPresent()) {
            log = existing.get();
        } else {
            // Ensure at least baseline data exists or compute
            ensureBaselineBiometrics(userId);
            log = computeDailyReadiness(userId, today);
        }

        // Fetch 7-day history for sparklines & trends
        LocalDate sevenDaysAgo = today.minusDays(7);
        List<BiometricData> recentBiometrics = biometricRepo.findByUserIdAndDateRange(userId, sevenDaysAgo, today);

        // Fetch user profile workout to generate live adapted workout
        String userWorkoutPlanJson = goalPlanService.getProfile(userId)
                .map(p -> p.getWorkoutPlanJson())
                .orElse(null);

        Map<String, Object> adaptiveWorkout = adaptiveWorkoutService.adaptWorkout(
            userWorkoutPlanJson, 
            log.getReadinessScore(), 
            "DELOAD_TRIGGERED".equalsIgnoreCase(log.getStatusCategory()) || Boolean.TRUE.equals(log.getIsConsecutiveLow())
        );

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("calculationDate", log.getCalculationDate());
        response.put("readinessScore", log.getReadinessScore());
        response.put("hrvZScore", Math.round(log.getHrvZScore() * 100.0) / 100.0);
        response.put("sleepScore", log.getSleepScore());
        response.put("rhrScore", log.getRhrScore());
        response.put("statusCategory", log.getStatusCategory());
        response.put("isConsecutiveLow", log.getIsConsecutiveLow());
        response.put("consecutiveLowDays", log.getConsecutiveLowDays());

        // Raw metrics for today
        Optional<BiometricData> todayBio = biometricRepo.findByUserIdAndRecordedDate(userId, today);
        if (todayBio.isPresent()) {
            response.put("todayHrvRmssd", todayBio.get().getRmssdHrvDouble());
            response.put("todayRestingHr", todayBio.get().getRestingHrInt());
            response.put("todaySleepMinutes", todayBio.get().getSleepMinutesInt());
            response.put("deviceSource", todayBio.get().getDeviceSource());
        } else {
            response.put("todayHrvRmssd", 65.0);
            response.put("todayRestingHr", 58);
            response.put("todaySleepMinutes", 450);
            response.put("deviceSource", "APPLE_HEALTH");
        }

        // 7-day trend series for UI charts
        List<Map<String, Object>> trendSeries = new ArrayList<>();
        for (BiometricData b : recentBiometrics) {
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("date", b.getRecordedDate().toString());
            point.put("hrv", b.getRmssdHrvDouble());
            point.put("rhr", b.getRestingHrInt());
            point.put("sleepHours", Math.round((b.getSleepMinutesInt() / 60.0) * 10.0) / 10.0);
            trendSeries.add(point);
        }
        response.put("weeklyTrendSeries", trendSeries);
        response.put("adaptiveWorkout", adaptiveWorkout);

        // Connected Wearable Status
        List<WearableConnection> connections = wearableRepo.findByUserId(userId);
        response.put("connectedWearables", connections);

        return response;
    }

    /**
     * Statistical z-score based readiness computation
     */
    @Transactional
    public ReadinessLog computeDailyReadiness(Long userId, LocalDate date) {
        LocalDate sevenDaysAgo = date.minusDays(7);
        List<BiometricData> window = biometricRepo.findByUserIdAndDateRange(userId, sevenDaysAgo, date);

        Optional<BiometricData> todayOpt = biometricRepo.findByUserIdAndRecordedDate(userId, date);
        if (todayOpt.isEmpty() && !window.isEmpty()) {
            todayOpt = Optional.of(window.get(window.size() - 1));
        }

        BiometricData todayData = todayOpt.orElseGet(() -> {
            BiometricData fallback = new BiometricData();
            fallback.setUserId(userId);
            fallback.setRecordedDate(date);
            fallback.setDeviceSource("APPLE_HEALTH");
            fallback.setRmssdHrv("65.0");
            fallback.setRestingHr("58");
            fallback.setSleepMinutes("460");
            return biometricRepo.save(fallback);
        });

        // 1. Calculate 7-day Rolling HRV RMSSD Baseline & Standard Deviation
        double sum = 0;
        int count = 0;
        for (BiometricData b : window) {
            sum += b.getRmssdHrvDouble();
            count++;
        }
        double meanHrv = count > 0 ? (sum / count) : 60.0;

        double sumSqDiff = 0;
        for (BiometricData b : window) {
            double diff = b.getRmssdHrvDouble() - meanHrv;
            sumSqDiff += diff * diff;
        }
        double stdDevHrv = count > 1 ? Math.sqrt(sumSqDiff / (count - 1)) : 8.0;
        stdDevHrv = Math.max(stdDevHrv, 2.5); // Minimum clamp

        // 2. Transparent Z-Score Formula
        double todayHrv = todayData.getRmssdHrvDouble();
        double zScore = (todayHrv - meanHrv) / stdDevHrv;

        // Sub-score 1: HRV (0-100) -> 50 is normal, 100 is +2 SD, 0 is -2 SD
        int hrvScore = (int) Math.round(Math.min(100.0, Math.max(0.0, 50.0 + (zScore * 25.0))));

        // Sub-score 2: Sleep Duration (0-100)
        double sleepHours = todayData.getSleepMinutesInt() / 60.0;
        int sleepScore;
        if (sleepHours >= 7.0) {
            sleepScore = (int) Math.round(Math.min(100.0, (sleepHours / 8.0) * 100.0));
        } else {
            sleepScore = (int) Math.round(Math.max(0.0, 70.0 - ((7.0 - sleepHours) * 20.0)));
        }

        // Sub-score 3: Resting Heart Rate (0-100)
        int todayRhr = todayData.getRestingHrInt();
        int rhrScore = (int) Math.round(Math.min(100.0, Math.max(0.0, 100.0 - Math.max(0, todayRhr - 55) * 4.0)));

        // 3. Composite Readiness Score (0-100)
        int compositeScore = (int) Math.round((0.50 * hrvScore) + (0.35 * sleepScore) + (0.15 * rhrScore));
        compositeScore = Math.min(100, Math.max(0, compositeScore));

        // 4. Consecutive Low / Downward Trend (5-Day Overtraining Alert Check)
        int consecutiveLowDays = checkConsecutiveDownwardTrend(userId, date, zScore);
        boolean isDeloadTriggered = consecutiveLowDays >= 5;

        String category;
        if (isDeloadTriggered) {
            category = "DELOAD_TRIGGERED";
            // Fire in-app alert notification
            try {
                Notification notif = new Notification();
                notif.setUserId(userId);
                notif.setTitle("⚠️ Overtraining Alert: Deload Week Suggested");
                notif.setMessage("HRV recovery has trended downward for 5 consecutive days. We've auto-calibrated a restorative deload & joint decompression protocol.");
                notif.setType("HEALTH_ALERT");
                notif.setLinkUrl("/member/workouts");
                notificationService.createNotification(notif);
            } catch (Exception ignored) {}
        } else if (compositeScore >= 80) {
            category = "PEAK";
        } else if (compositeScore >= 50) {
            category = "OPTIMAL";
        } else {
            category = "RECOVERY";
        }

        ReadinessLog log = readinessRepo.findByUserIdAndCalculationDate(userId, date).orElse(new ReadinessLog());
        log.setUserId(userId);
        log.setCalculationDate(date);
        log.setReadinessScore(compositeScore);
        log.setHrvZScore(zScore);
        log.setSleepScore(sleepScore);
        log.setRhrScore(rhrScore);
        log.setStatusCategory(category);
        log.setIsConsecutiveLow(isDeloadTriggered || compositeScore < 50);
        log.setConsecutiveLowDays(consecutiveLowDays);
        log.setAdaptiveAdjustmentJson("{\"category\":\"" + category + "\",\"score\":" + compositeScore + "}");

        return readinessRepo.save(log);
    }

    private int checkConsecutiveDownwardTrend(Long userId, LocalDate today, double currentZScore) {
        LocalDate fiveDaysAgo = today.minusDays(5);
        List<BiometricData> last5 = biometricRepo.findByUserIdAndDateRange(userId, fiveDaysAgo, today);
        if (last5.size() < 5) {
            return currentZScore < -0.5 ? 1 : 0;
        }

        // Check if strictly declining HRV or consistently suppressed z-scores
        int lowCount = 0;
        for (BiometricData b : last5) {
            if (b.getRmssdHrvDouble() < 45.0) {
                lowCount++;
            }
        }

        // Check downward slope
        boolean downwardSlope = true;
        for (int i = 0; i < last5.size() - 1; i++) {
            if (last5.get(i + 1).getRmssdHrvDouble() > last5.get(i).getRmssdHrvDouble() + 3.0) {
                downwardSlope = false;
                break;
            }
        }

        if (downwardSlope || lowCount >= 5) {
            return 5;
        }
        return currentZScore < -0.5 ? 2 : 0;
    }

    /**
     * Ingest wearable metrics from Apple HealthKit / Google Fit / Web Bridge
     */
    @Transactional
    public Map<String, Object> syncWearableData(Long userId, String provider, Map<String, Object> payload) {
        LocalDate recordedDate = LocalDate.now();
        if (payload.containsKey("recordedDate")) {
            try {
                recordedDate = LocalDate.parse(payload.get("recordedDate").toString());
            } catch (Exception ignored) {}
        }

        String hrv = payload.getOrDefault("rmssdHrv", "65.0").toString();
        String rhr = payload.getOrDefault("restingHr", "58").toString();
        String sleep = payload.getOrDefault("sleepMinutes", "460").toString();
        String deviceName = (String) payload.getOrDefault("deviceName", provider.replace("_", " "));

        BiometricData data = biometricRepo.findByUserIdAndRecordedDate(userId, recordedDate)
                .orElse(new BiometricData());
        data.setUserId(userId);
        data.setRecordedDate(recordedDate);
        data.setDeviceSource(provider);
        data.setRmssdHrv(hrv);
        data.setRestingHr(rhr);
        data.setSleepMinutes(sleep);
        try {
            data.setRawPayload(objectMapper.writeValueAsString(payload));
        } catch (Exception ignored) {}
        biometricRepo.save(data);

        // Update wearable connection
        WearableConnection connection = wearableRepo.findByUserIdAndProvider(userId, provider)
                .orElse(new WearableConnection());
        connection.setUserId(userId);
        connection.setProvider(provider);
        connection.setIsConnected(true);
        connection.setSyncStatus("SYNCED");
        connection.setLastSyncedAt(LocalDateTime.now());
        connection.setDeviceName(deviceName);
        wearableRepo.save(connection);

        // Recompute readiness
        computeDailyReadiness(userId, recordedDate);

        return getTodayReadiness(userId);
    }

    /**
     * 1-Click Biometric Data Purge (Privacy & GDPR compliance)
     */
    @Transactional
    public Map<String, Object> deleteMyBiometricData(Long userId) {
        biometricRepo.deleteAllByUserId(userId);
        readinessRepo.deleteAllByUserId(userId);
        wearableRepo.deleteAllByUserId(userId);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("status", "SUCCESS");
        res.put("message", "All biometric data, wearable tokens, and readiness history have been permanently purged.");
        res.put("deletedAt", LocalDateTime.now());
        return res;
    }

    /**
     * Seeds test scenarios for live demoing: PEAK, OPTIMAL, LOW_FATIGUE, OVERTRAINING_5DAY
     */
    @Transactional
    public Map<String, Object> seedDemoScenario(Long userId, String scenario) {
        LocalDate today = LocalDate.now();
        String upper = (scenario != null ? scenario.toUpperCase() : "OPTIMAL");

        // Clear existing to establish clean trend
        biometricRepo.deleteAllByUserId(userId);
        readinessRepo.deleteAllByUserId(userId);

        if ("PEAK".equals(upper)) {
            // Seed 7 days with elevated HRV and long sleep
            for (int i = 6; i >= 0; i--) {
                LocalDate d = today.minusDays(i);
                double hrv = 80.0 + (Math.random() * 12.0); // 80-92 ms
                BiometricData b = new BiometricData();
                b.setUserId(userId);
                b.setRecordedDate(d);
                b.setDeviceSource("APPLE_HEALTH");
                b.setRmssdHrv(String.format(Locale.US, "%.1f", hrv));
                b.setRestingHr("52");
                b.setSleepMinutes("500"); // 8h 20m
                biometricRepo.save(b);
            }
        } else if ("LOW_FATIGUE".equals(upper)) {
            // Baseline 65ms for 6 days, sharp drop to 38ms today with 5h sleep
            for (int i = 6; i >= 1; i--) {
                LocalDate d = today.minusDays(i);
                BiometricData b = new BiometricData();
                b.setUserId(userId);
                b.setRecordedDate(d);
                b.setDeviceSource("WHOOP_4");
                b.setRmssdHrv("68.0");
                b.setRestingHr("57");
                b.setSleepMinutes("460");
                biometricRepo.save(b);
            }
            BiometricData todayB = new BiometricData();
            todayB.setUserId(userId);
            todayB.setRecordedDate(today);
            todayB.setDeviceSource("WHOOP_4");
            todayB.setRmssdHrv("36.5"); // Sharp drop
            todayB.setRestingHr("71"); // High RHR
            todayB.setSleepMinutes("310"); // 5h 10m
            biometricRepo.save(todayB);
        } else if ("OVERTRAINING_5DAY".equals(upper)) {
            // 5-day continuous downward cascade: 78 -> 64 -> 50 -> 40 -> 32 ms
            double[] hrvSteps = {78.0, 75.0, 64.0, 50.0, 40.0, 32.0, 29.0};
            int[] rhrSteps = {54, 56, 60, 64, 69, 74, 76};
            int[] sleepSteps = {460, 440, 400, 360, 330, 310, 290};

            for (int i = 6; i >= 0; i--) {
                LocalDate d = today.minusDays(i);
                int idx = 6 - i;
                BiometricData b = new BiometricData();
                b.setUserId(userId);
                b.setRecordedDate(d);
                b.setDeviceSource("OURA_RING_3");
                b.setRmssdHrv(String.format(Locale.US, "%.1f", hrvSteps[idx]));
                b.setRestingHr(String.valueOf(rhrSteps[idx]));
                b.setSleepMinutes(String.valueOf(sleepSteps[idx]));
                biometricRepo.save(b);
            }
        } else {
            // Standard Optimal
            for (int i = 6; i >= 0; i--) {
                LocalDate d = today.minusDays(i);
                BiometricData b = new BiometricData();
                b.setUserId(userId);
                b.setRecordedDate(d);
                b.setDeviceSource("GOOGLE_FIT");
                b.setRmssdHrv(String.format(Locale.US, "%.1f", 64.0 + (i % 3)));
                b.setRestingHr("58");
                b.setSleepMinutes("450");
                biometricRepo.save(b);
            }
        }

        // Register default simulator device
        WearableConnection conn = wearableRepo.findByUserIdAndProvider(userId, "SIMULATOR")
                .orElse(new WearableConnection());
        conn.setUserId(userId);
        conn.setProvider("SIMULATOR");
        conn.setIsConnected(true);
        conn.setSyncStatus("SYNCED");
        conn.setLastSyncedAt(LocalDateTime.now());
        conn.setDeviceName("Apple Watch Ultra (Calibrated Seed)");
        wearableRepo.save(conn);

        // Compute and return
        return getTodayReadiness(userId);
    }

    private void ensureBaselineBiometrics(Long userId) {
        LocalDate today = LocalDate.now();
        List<BiometricData> existing = biometricRepo.findByUserIdAndDateRange(userId, today.minusDays(7), today);
        if (existing.isEmpty()) {
            seedDemoScenario(userId, "OPTIMAL");
        }
    }
}
