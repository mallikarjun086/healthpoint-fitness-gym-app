package com.healthpoint.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthpoint.dto.DietMealDto;
import com.healthpoint.dto.GoalProfileRequest;
import com.healthpoint.dto.WorkoutDayDto;
import com.healthpoint.entity.User;
import com.healthpoint.entity.UserProfile;
import com.healthpoint.repository.UserProfileRepository;
import com.healthpoint.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GoalPlanService {

    private final UserProfileRepository profileRepo;
    private final UserRepository userRepo;
    private final ObjectMapper objectMapper;

    public GoalPlanService(UserProfileRepository profileRepo, UserRepository userRepo, ObjectMapper objectMapper) {
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> createOrUpdateGoal(Long userId, GoalProfileRequest req) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }
        
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUserId(userId).orElse(new UserProfile());
        profile.setUser(user);
        profile.setHeightCm(req.getHeightCm());
        profile.setWeightKg(req.getWeightKg());
        profile.setExperienceLevel(req.getExperienceLevel());
        profile.setGoalType(req.getGoalType());
        profile.setSportName(req.getSportName());

        double heightM = req.getHeightCm() / 100.0;
        double bmi = req.getWeightKg() / (heightM * heightM);
        profile.setBmi(Math.round(bmi * 10.0) / 10.0);

        Map<String, Integer> macros = calculateMacros(req.getWeightKg(), bmi, req.getGoalType(), req.getExperienceLevel());
        profile.setDailyCalories(macros.get("calories"));
        profile.setDailyProtein(macros.get("protein"));
        profile.setDailyCarbs(macros.get("carbs"));
        profile.setDailyFat(macros.get("fat"));

        String workoutJson = generateWorkoutPlan(req.getGoalType(), req.getExperienceLevel(), req.getSportName());
        String dietJson = generateDietPlan(req.getGoalType(), macros);

        profile.setWorkoutPlanJson(workoutJson);
        profile.setDietPlanJson(dietJson);

        profileRepo.save(profile);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("bmi", profile.getBmi());
        result.put("dailyCalories", macros.get("calories"));
        result.put("dailyProtein", macros.get("protein"));
        result.put("dailyCarbs", macros.get("carbs"));
        result.put("dailyFat", macros.get("fat"));
        result.put("goalType", req.getGoalType());
        result.put("experienceLevel", req.getExperienceLevel());
        result.put("workoutPlan", workoutJson);
        result.put("dietPlan", dietJson);
        return result;
    }

    public Optional<UserProfile> getProfile(Long userId) {
        return profileRepo.findByUserId(userId);
    }

    public void updateWorkoutPlanFromJson(Long userId, String workoutJson) {
        UserProfile profile = profileRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User profile not found for ID: " + userId));
        profile.setWorkoutPlanJson(workoutJson);
        profileRepo.save(profile);
    }

    // ---------- MACRO CALCULATOR ----------
    private Map<String, Integer> calculateMacros(double weightKg, double bmi, String goal, String exp) {
        String safeGoal = (goal != null && !goal.trim().isEmpty()) ? goal.toUpperCase() : "AESTHETIC";
        String safeExp = (exp != null) ? exp : "INTERMEDIATE";
        double baseCalories = weightKg * 30;
        double proteinMultiplier, carbMultiplier, fatMultiplier;

        switch (safeGoal) {
            case "COMPETITION":
                baseCalories *= 1.15;
                proteinMultiplier = 2.5; carbMultiplier = 4.0; fatMultiplier = 0.8;
                break;
            case "AESTHETIC":
                baseCalories *= (bmi > 25 ? 0.85 : 1.05);
                proteinMultiplier = 2.2; carbMultiplier = 3.0; fatMultiplier = 0.9;
                break;
            case "STRENGTH":
                baseCalories *= 1.2;
                proteinMultiplier = 2.0; carbMultiplier = 4.5; fatMultiplier = 1.0;
                break;
            case "POWERLIFTING":
                baseCalories *= 1.3;
                proteinMultiplier = 2.2; carbMultiplier = 5.0; fatMultiplier = 1.1;
                break;
            case "SPORTS":
                baseCalories *= 1.25;
                proteinMultiplier = 2.0; carbMultiplier = 5.0; fatMultiplier = 1.0;
                break;
            default:
                proteinMultiplier = 1.8; carbMultiplier = 3.5; fatMultiplier = 0.9;
        }

        if ("ADVANCED".equalsIgnoreCase(safeExp)) baseCalories *= 1.1;
        else if ("BEGINNER".equalsIgnoreCase(safeExp)) baseCalories *= 0.95;

        int protein = (int)(weightKg * proteinMultiplier);
        int carbs = (int)(weightKg * carbMultiplier);
        int fat = (int)(weightKg * fatMultiplier);
        int calories = (int) baseCalories;

        return Map.of("calories", calories, "protein", protein, "carbs", carbs, "fat", fat);
    }

    // ---------- WORKOUT PLAN GENERATOR ----------
    private String generateWorkoutPlan(String goal, String experience, String sport) {
        String safeGoal = (goal != null && !goal.trim().isEmpty()) ? goal.toUpperCase() : "AESTHETIC";
        String[][] plan;

        switch (safeGoal) {
            case "COMPETITION":
                plan = getCompetitionPlan(experience);
                break;
            case "AESTHETIC":
                plan = getAestheticPlan(experience);
                break;
            case "STRENGTH":
                plan = getStrengthPlan(experience);
                break;
            case "POWERLIFTING":
                plan = getPowerliftingPlan(experience);
                break;
            case "SPORTS":
                plan = getSportsPlan(experience, sport);
                break;
            default:
                plan = getAestheticPlan(experience);
        }

        List<WorkoutDayDto> workoutDays = new ArrayList<>();
        for (String[] dayPlan : plan) {
            workoutDays.add(new WorkoutDayDto(dayPlan[0], dayPlan[1], dayPlan[2], dayPlan[3], dayPlan[4], dayPlan[5]));
        }

        try {
            return objectMapper.writeValueAsString(workoutDays);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to generate workout plan JSON", e);
        }
    }

    private String[][] getCompetitionPlan(String exp) {
        boolean adv = "ADVANCED".equalsIgnoreCase(exp);
        return new String[][] {
            {"Monday","Chest & Triceps","Bench Press, Incline DB Press, Cable Flyes, Tricep Pushdown, Overhead Extension",adv?"5":"4",adv?"6-10":"8-12","90s"},
            {"Tuesday","Back & Biceps","Deadlift, Barbell Row, Lat Pulldown, Hammer Curl, Barbell Curl",adv?"5":"4",adv?"6-10":"8-12","90s"},
            {"Wednesday","Legs (Quad Focus)","Squat, Leg Press, Leg Extension, Walking Lunges, Calf Raises",adv?"5":"4",adv?"6-10":"8-12","120s"},
            {"Thursday","Shoulders & Abs","OHP, Lateral Raise, Rear Delt Fly, Face Pull, Hanging Leg Raise","4","10-15","60s"},
            {"Friday","Arms & Weak Points","Preacher Curl, Skull Crushers, Cable Curl, Dips, Concentration Curl","4","12-15","60s"},
            {"Saturday","Legs (Hamstring Focus)","Romanian Deadlift, Leg Curl, Hip Thrust, Bulgarian Split Squat, Calf Raise",adv?"5":"4","8-12","90s"},
            {"Sunday","Rest / Active Recovery","Light Cardio, Stretching, Foam Rolling","-","-","-"}
        };
    }

    private String[][] getAestheticPlan(String exp) {
        boolean beg = "BEGINNER".equalsIgnoreCase(exp);
        return new String[][] {
            {"Monday","Push (Chest/Shoulders/Triceps)","Bench Press, Incline DB Press, Lateral Raise, Tricep Pushdown",beg?"3":"4",beg?"10-12":"8-12","90s"},
            {"Tuesday","Pull (Back/Biceps)","Pull-ups, Barbell Row, Face Pull, EZ Bar Curl",beg?"3":"4",beg?"10-12":"8-12","90s"},
            {"Wednesday","Legs","Squat, Romanian Deadlift, Leg Press, Calf Raises",beg?"3":"4","10-12","90s"},
            {"Thursday","Rest / Light Cardio","20 min walk, Stretching","-","-","-"},
            {"Friday","Upper Body","OHP, Chest Fly, Cable Row, Lateral Raise, Hammer Curl","4","10-15","60s"},
            {"Saturday","Lower Body & Core","Front Squat, Hip Thrust, Leg Curl, Plank, Cable Crunch","4","10-15","60s"},
            {"Sunday","Rest","Full Rest Day","-","-","-"}
        };
    }

    private String[][] getStrengthPlan(String exp) {
        boolean adv = "ADVANCED".equalsIgnoreCase(exp);
        return new String[][] {
            {"Monday","Heavy Squat Day","Back Squat, Front Squat, Leg Press, Good Morning",adv?"5":"4",adv?"3-5":"5-8","180s"},
            {"Tuesday","Heavy Bench Day","Bench Press, Close Grip Bench, DB Press, Tricep Dips",adv?"5":"4",adv?"3-5":"5-8","180s"},
            {"Wednesday","Active Recovery","Light Cardio, Mobility Work, Band Pull-aparts","-","-","-"},
            {"Thursday","Heavy Deadlift Day","Conventional Deadlift, Barbell Row, Pull-ups, Shrugs",adv?"5":"4",adv?"3-5":"5-8","180s"},
            {"Friday","OHP & Accessories","Overhead Press, Push Press, Lateral Raise, Face Pull","4","5-8","120s"},
            {"Saturday","Volume Day","Squat 60%, Bench 60%, Deadlift 60%, Accessories","4","8-12","90s"},
            {"Sunday","Rest","Full Rest Day","-","-","-"}
        };
    }

    private String[][] getPowerliftingPlan(String exp) {
        boolean adv = "ADVANCED".equalsIgnoreCase(exp);
        return new String[][] {
            {"Monday","Competition Squat","Back Squat, Pause Squat, Box Squat, Leg Press",adv?"5":"4",adv?"1-5":"3-6","240s"},
            {"Tuesday","Competition Bench","Bench Press, Spoto Press, Close Grip Bench, DB Fly",adv?"5":"4",adv?"1-5":"3-6","240s"},
            {"Wednesday","GPP & Accessories","Sled Push, Lunges, Rows, Core Work","3","10-15","60s"},
            {"Thursday","Competition Deadlift","Deadlift, Deficit Deadlift, Block Pull, Barbell Row",adv?"5":"4",adv?"1-5":"3-6","240s"},
            {"Friday","Bench Variation","Floor Press, Incline Bench, DB Bench, Tricep Work","4","6-10","120s"},
            {"Saturday","Light Squat & Deadlift","Squat 60%, Deadlift 50%, Accessories","3","6-8","120s"},
            {"Sunday","Rest","Full Rest Day","-","-","-"}
        };
    }

    private String[][] getSportsPlan(String exp, String sport) {
        String sportLabel = (sport != null && !sport.isBlank()) ? sport : "General Athletics";
        boolean beg = "BEGINNER".equalsIgnoreCase(exp);
        return new String[][] {
            {"Monday","Explosive Power","Power Clean, Box Jump, Squat, Push Press",beg?"3":"4","5-8","120s"},
            {"Tuesday","Speed & Agility","Sprint Drills, Agility Ladder, Plyometrics for " + sportLabel,"5","30s work","60s"},
            {"Wednesday","Upper Strength","Bench Press, Pull-ups, Rows, Shoulder Press","4","8-10","90s"},
            {"Thursday","Sport-Specific Drills","Practice drills for " + sportLabel + ", Conditioning","-","-","-"},
            {"Friday","Lower Strength","Squat, Deadlift, Lunges, Calf Raises","4","6-10","120s"},
            {"Saturday","Endurance & Core","Interval Running, Plank, Russian Twist, Medicine Ball","4","15-20","45s"},
            {"Sunday","Rest / Active Recovery","Light jog, Yoga, Stretching","-","-","-"}
        };
    }

    // ---------- DIET PLAN GENERATOR ----------
    private String generateDietPlan(String goal, Map<String, Integer> macros) {
        String[][] meals;

        String sanitizedGoal = (goal != null && !goal.isBlank()) ? goal.trim().toUpperCase() : "AESTHETIC";
        switch (sanitizedGoal) {
            case "COMPETITION": meals = getCompetitionDiet(); break;
            case "AESTHETIC": meals = getAestheticDiet(); break;
            case "POWERLIFTING": case "STRENGTH": meals = getStrengthDiet(); break;
            case "SPORTS": meals = getSportsDiet(); break;
            default: meals = getAestheticDiet();
        }

        List<DietMealDto> dietMeals = new ArrayList<>();
        for (String[] mealPlan : meals) {
            dietMeals.add(new DietMealDto(mealPlan[0], mealPlan[1], mealPlan[2], mealPlan[3]));
        }

        try {
            return objectMapper.writeValueAsString(dietMeals);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to generate diet plan JSON", e);
        }
    }

    private String[][] getCompetitionDiet() {
        return new String[][] {
            {"Meal 1 - Breakfast","7:00 AM","6 Egg Whites + 2 Whole Eggs, Oatmeal (50g), Banana","High protein start"},
            {"Meal 2 - Mid Morning","10:00 AM","Chicken Breast (150g), Brown Rice (100g), Broccoli","Lean protein + complex carbs"},
            {"Meal 3 - Lunch","1:00 PM","Fish (200g), Sweet Potato (150g), Mixed Greens, Olive Oil","Omega-3 fatty acids"},
            {"Meal 4 - Pre-Workout","4:00 PM","Whey Protein Shake, Rice Cakes, Peanut Butter (1 tbsp)","Quick digesting energy"},
            {"Meal 5 - Post-Workout","6:30 PM","Chicken Breast (200g), White Rice (150g), Asparagus","Fast absorbing post-training"},
            {"Meal 6 - Dinner","8:30 PM","Casein Protein, Almonds (30g), Cottage Cheese","Slow-digesting before sleep"}
        };
    }

    private String[][] getAestheticDiet() {
        return new String[][] {
            {"Meal 1 - Breakfast","8:00 AM","3 Whole Eggs, Avocado Toast (whole wheat), Berries","Balanced macros to start"},
            {"Meal 2 - Snack","11:00 AM","Greek Yogurt (200g), Granola (30g), Honey","Protein-rich snack"},
            {"Meal 3 - Lunch","1:30 PM","Grilled Chicken (180g), Quinoa (100g), Cucumber Salad","Lean and clean"},
            {"Meal 4 - Pre-Workout","4:30 PM","Banana, Whey Protein Shake, Handful of Almonds","Fuel for training"},
            {"Meal 5 - Post-Workout","7:00 PM","Salmon (180g), Brown Rice (120g), Steamed Veggies","Recovery nutrition"},
            {"Meal 6 - Evening","9:00 PM","Cottage Cheese (150g), Walnuts, Cinnamon","Slow protein before bed"}
        };
    }

    private String[][] getStrengthDiet() {
        return new String[][] {
            {"Meal 1 - Breakfast","7:00 AM","4 Whole Eggs, Oatmeal (80g), Peanut Butter (2 tbsp), Banana","Calorie-dense breakfast"},
            {"Meal 2 - Mid Morning","10:00 AM","Mass Gainer or Chicken (200g) + Rice (150g)","Sustained energy"},
            {"Meal 3 - Lunch","1:00 PM","Beef/Mutton (250g), Pasta (150g), Mixed Vegetables, Olive Oil","Iron-rich protein"},
            {"Meal 4 - Pre-Workout","4:00 PM","Whey Protein, 2 Bananas, Rice Cakes with Jam","Glycogen loading"},
            {"Meal 5 - Post-Workout","6:30 PM","Chicken (250g), White Rice (200g), Broccoli","Maximum recovery"},
            {"Meal 6 - Dinner","9:00 PM","Eggs (3), Cheese, Whole Wheat Bread, Milk (300ml)","Calorie surplus before bed"}
        };
    }

    private String[][] getSportsDiet() {
        return new String[][] {
            {"Meal 1 - Breakfast","7:00 AM","Oatmeal (60g), 3 Eggs, Fruit Smoothie, Toast","Balanced carb-protein start"},
            {"Meal 2 - Mid Morning","10:00 AM","Protein Bar, Apple, Mixed Nuts (40g)","Portable sports snack"},
            {"Meal 3 - Lunch","1:00 PM","Grilled Chicken (180g), Brown Rice (130g), Salad, Olive Oil","Performance fuel"},
            {"Meal 4 - Pre-Training","3:30 PM","Energy Drink, Banana, Rice Cake with Honey","Quick energy boost"},
            {"Meal 5 - Post-Training","6:00 PM","Whey Protein, Sweet Potato (200g), Grilled Veggies","Glycogen replenishment"},
            {"Meal 6 - Dinner","8:30 PM","Fish (200g), Quinoa, Steamed Vegetables, Yogurt","Anti-inflammatory recovery"}
        };
    }
}
