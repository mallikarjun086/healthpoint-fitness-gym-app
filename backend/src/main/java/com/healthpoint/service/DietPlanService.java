package com.healthpoint.service;

import com.healthpoint.entity.DietPlan;
import com.healthpoint.repository.DietPlanRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@SuppressWarnings("null")
public class DietPlanService {

    private final DietPlanRepository dietPlanRepository;
    private final com.healthpoint.repository.UserProfileRepository userProfileRepository;
    private final com.healthpoint.repository.UserRepository userRepository;
    private final NotificationService notificationService;

    public DietPlanService(DietPlanRepository dietPlanRepository,
                           com.healthpoint.repository.UserProfileRepository userProfileRepository,
                           com.healthpoint.repository.UserRepository userRepository,
                           NotificationService notificationService) {
        this.dietPlanRepository = dietPlanRepository;
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<DietPlan> getAllActivePlans() {
        return dietPlanRepository.findByIsActiveTrue();
    }

    public DietPlan savePlan(DietPlan plan) {
        DietPlan saved = dietPlanRepository.save(plan);

        if (plan.getUserId() != null) {
            userProfileRepository.findByUserId(plan.getUserId()).ifPresentOrElse(profile -> {
                if (plan.getCalories() != null) profile.setDailyCalories(plan.getCalories());
                if (plan.getProtein() != null) profile.setDailyProtein(plan.getProtein());
                if (plan.getCarbs() != null) profile.setDailyCarbs(plan.getCarbs());
                if (plan.getFat() != null) profile.setDailyFat(plan.getFat());
                if (plan.getMealScheduleJson() != null && !plan.getMealScheduleJson().isBlank()) {
                    profile.setDietPlanJson(plan.getMealScheduleJson());
                }
                userProfileRepository.save(profile);
            }, () -> {
                userRepository.findById(plan.getUserId()).ifPresent(user -> {
                    com.healthpoint.entity.UserProfile profile = new com.healthpoint.entity.UserProfile();
                    profile.setUser(user);
                    profile.setExperienceLevel("INTERMEDIATE");
                    profile.setGoalType(plan.getMealType() != null ? plan.getMealType() : "HYPERTROPHY");
                    profile.setDailyCalories(plan.getCalories() != null ? plan.getCalories() : 2650);
                    profile.setDailyProtein(plan.getProtein() != null ? plan.getProtein() : 185);
                    profile.setDailyCarbs(plan.getCarbs() != null ? plan.getCarbs() : 280);
                    profile.setDailyFat(plan.getFat() != null ? plan.getFat() : 65);
                    if (plan.getMealScheduleJson() != null) {
                        profile.setDietPlanJson(plan.getMealScheduleJson());
                    }
                    userProfileRepository.save(profile);
                });
            });

            // Send in-app notification to member
            com.healthpoint.entity.Notification notif = new com.healthpoint.entity.Notification();
            notif.setUserId(plan.getUserId());
            notif.setTitle("New Diet Plan Assigned! 🥗");
            notif.setMessage("Your Master Trainer has assigned a custom nutrition plan: " + plan.getTitle());
            notif.setType("DIET");
            notif.setLinkUrl("/member/diet");
            notificationService.createNotification(notif);
        }

        return saved;
    }

    public void deletePlan(Long id) {
        if (id != null) {
            dietPlanRepository.deleteById(id);
        }
    }
}
