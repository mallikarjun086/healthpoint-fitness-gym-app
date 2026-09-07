package com.healthpoint.service;

import com.healthpoint.entity.FoodItem;
import com.healthpoint.entity.FoodLog;
import com.healthpoint.entity.UserProfile;
import com.healthpoint.repository.FoodItemRepository;
import com.healthpoint.repository.FoodLogRepository;
import com.healthpoint.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class NutritionService {

    private final FoodItemRepository foodItemRepository;
    private final FoodLogRepository foodLogRepository;
    private final UserProfileRepository userProfileRepository;

    public NutritionService(FoodItemRepository foodItemRepository,
                            FoodLogRepository foodLogRepository,
                            UserProfileRepository userProfileRepository) {
        this.foodItemRepository = foodItemRepository;
        this.foodLogRepository = foodLogRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public List<FoodItem> searchFood(String query) {
        if (query == null || query.trim().isEmpty()) {
            return foodItemRepository.findAll();
        }
        return foodItemRepository.findByNameContainingIgnoreCase(query);
    }

    public Map<String, Object> getDailyNutritionSummary(Long userId, LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        List<FoodLog> logs = foodLogRepository.findByUserIdAndLogDateOrderByLoggedAtAsc(userId, targetDate);
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);

        int totalCalories = 0;
        double totalProtein = 0.0;
        double totalCarbs = 0.0;
        double totalFat = 0.0;

        for (FoodLog l : logs) {
            if (l.getCalories() != null) totalCalories += l.getCalories();
            if (l.getProteinGrams() != null) totalProtein += l.getProteinGrams();
            if (l.getCarbsGrams() != null) totalCarbs += l.getCarbsGrams();
            if (l.getFatGrams() != null) totalFat += l.getFatGrams();
        }

        int targetCal = 2650;
        int targetProt = 185;
        int targetCarb = 280;
        int targetF = 65;

        if (profileOpt.isPresent()) {
            UserProfile p = profileOpt.get();
            targetCal = p.getDailyCalorieTarget();
            targetProt = p.getDailyProteinGrams();
            targetCarb = p.getDailyCarbsGrams();
            targetF = p.getDailyFatGrams();
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("date", targetDate);
        res.put("logs", logs);
        res.put("totalCalories", totalCalories);
        res.put("totalProtein", Math.round(totalProtein * 10.0) / 10.0);
        res.put("totalCarbs", Math.round(totalCarbs * 10.0) / 10.0);
        res.put("totalFat", Math.round(totalFat * 10.0) / 10.0);

        res.put("targetCalories", targetCal);
        res.put("targetProtein", targetProt);
        res.put("targetCarbs", targetCarb);
        res.put("targetFat", targetF);

        return res;
    }

    public FoodLog logFood(FoodLog foodLog) {
        if (foodLog.getLogDate() == null) {
            foodLog.setLogDate(LocalDate.now());
        }
        return foodLogRepository.save(foodLog);
    }

    public void deleteFoodLog(@org.springframework.lang.NonNull Long id) {
        foodLogRepository.deleteById(id);
    }
}
