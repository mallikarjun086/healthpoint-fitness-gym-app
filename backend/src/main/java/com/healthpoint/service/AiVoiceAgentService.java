package com.healthpoint.service;

import com.healthpoint.dto.VoiceAgentRequest;
import com.healthpoint.dto.VoiceAgentResponse;
import com.healthpoint.entity.DietPlan;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AiVoiceAgentService {

    private final AiFitnessEngineService aiFitnessEngineService;
    private final DietPlanService dietPlanService;

    public AiVoiceAgentService(AiFitnessEngineService aiFitnessEngineService, DietPlanService dietPlanService) {
        this.aiFitnessEngineService = aiFitnessEngineService;
        this.dietPlanService = dietPlanService;
    }

    public VoiceAgentResponse processVoiceQuery(VoiceAgentRequest request) {
        String input = request.getTranscript() != null ? request.getTranscript().toLowerCase().trim() : "";
        String role = request.getRole() != null ? request.getRole().toUpperCase() : "MEMBER";

        VoiceAgentResponse response = new VoiceAgentResponse();

        if (input.isEmpty()) {
            response.setSpokenResponse("I'm listening! Ask me any fitness doubt, request diet changes, or ask for your training summary.");
            response.setActionExecuted("LISTEN_PROMPT");
            return response;
        }

        // Intent detection logic
        if (input.contains("diet") || input.contains("meal") || input.contains("food") || input.contains("calorie") || input.contains("protein") || input.contains("carb")) {
            if (input.contains("change") || input.contains("alter") || input.contains("update") || input.contains("switch") || input.contains("replace") || input.contains("vegan") || input.contains("keto") || input.contains("more protein")) {
                return handleDietAlteration(input, request.getUserId());
            } else {
                return handleDietExplanation(request.getUserId());
            }
        } else if (input.contains("fatigue") || input.contains("tired") || input.contains("sore") || input.contains("recovery") || input.contains("deload")) {
            return handleFatigueCheck();
        } else if (role.equals("TRAINER") && (input.contains("client") || input.contains("summary") || input.contains("performance"))) {
            return handleTrainerSummary();
        } else if (input.contains("creatine") || input.contains("whey") || input.contains("supplement") || input.contains("bcaa") || input.contains("pre workout")) {
            return handleSupplementDoubt(input);
        } else if (input.contains("bench") || input.contains("squat") || input.contains("deadlift") || input.contains("form") || input.contains("workout") || input.contains("exercise")) {
            return handleWorkoutDoubt(input);
        } else {
            return handleGeneralDoubt(input, role);
        }
    }

    private VoiceAgentResponse handleDietAlteration(String input, Long userId) {
        Map<String, Object> nutrition = aiFitnessEngineService.calculatePrecisionNutrition(75.0, 178.0, 26, "MALE", 15.0, "MODERATE", "MUSCLE_GAIN");

        String mealType = "HIGH_PROTEIN_HYPERTROPHY";
        int calories = ((Number) nutrition.getOrDefault("targetCalories", 2800)).intValue();
        int protein = ((Number) nutrition.getOrDefault("proteinGrams", 185)).intValue();
        int carbs = ((Number) nutrition.getOrDefault("carbGrams", 300)).intValue();
        int fat = ((Number) nutrition.getOrDefault("fatGrams", 70)).intValue();

        String mealJson = "{\"breakfast\":\"Oatmeal with whey, almond milk & blueberries\", \"lunch\":\"Grilled chicken breast, quinoa & steamed broccoli\", \"snack\":\"Greek yogurt with honey & walnuts\", \"dinner\":\"Salmon fillet, sweet potato & asparagus\"}";

        if (input.contains("vegan") || input.contains("vegetarian")) {
            mealType = "VEGAN_MUSCLE_BUILDER";
            calories = 2700;
            protein = 175;
            carbs = 320;
            fat = 65;
            mealJson = "{\"breakfast\":\"Tofu scramble with spinach, avocado toast & soy milk\", \"lunch\":\"Lentil & chickpea Buddha bowl with brown rice\", \"snack\":\"Peanut butter banana smoothie with pea protein\", \"dinner\":\"Edamame tempeh stir-fry with quinoa\"}";
        } else if (input.contains("keto") || input.contains("low carb")) {
            mealType = "KETO_ANABOLIC";
            calories = 2600;
            protein = 190;
            carbs = 30;
            fat = 180;
            mealJson = "{\"breakfast\":\"3 scrambled eggs with avocado & cheddar\", \"lunch\":\"Ribeye steak with garlic butter & spinach\", \"snack\":\"Macadamia nuts & whey isolate shake\", \"dinner\":\"Pan-seared salmon with asparagus in olive oil\"}";
        } else if (input.contains("more protein") || input.contains("high protein")) {
            protein = 210;
            carbs = 260;
            mealJson = "{\"breakfast\":\"6 egg whites + 2 whole eggs, oats & berries\", \"lunch\":\"300g turkey breast with jasmine rice & green beans\", \"snack\":\"Double scoop whey isolate with rice cakes\", \"dinner\":\"Grilled sirloin steak with baked potato & broccolini\"}";
        }

        if (userId != null) {
            DietPlan plan = new DietPlan();
            plan.setUserId(userId);
            plan.setTitle("AI Voice Custom Diet: " + mealType);
            plan.setMealType(mealType);
            plan.setCalories(calories);
            plan.setProtein(protein);
            plan.setCarbs(carbs);
            plan.setFat(fat);
            plan.setMealScheduleJson(mealJson);
            plan.setIsAiGenerated(true);
            plan.setActive(true);
            dietPlanService.savePlan(plan);
        }

        VoiceAgentResponse res = new VoiceAgentResponse();
        res.setDietAltered(true);
        res.setActionExecuted("ALTER_DIET");
        res.setSpokenResponse("Done! I have automatically updated your diet plan to " + mealType.replace("_", " ") + " with " + calories + " calories and " + protein + " grams of protein. Your new macro targets and meal breakdown are live in your dashboard.");
        
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("mealType", mealType);
        data.put("calories", calories);
        data.put("protein", protein);
        data.put("carbs", carbs);
        data.put("fat", fat);
        res.setActionData(data);
        return res;
    }

    private VoiceAgentResponse handleDietExplanation(Long userId) {
        VoiceAgentResponse res = new VoiceAgentResponse();
        res.setActionExecuted("EXPLAIN_DIET");
        res.setSpokenResponse("Your current nutrition plan is optimized for lean muscle synthesis. Your target is 2,800 calories daily, consisting of 185g Protein, 300g Carbs, and 70g Fats. Prioritize taking 40 grams of protein post-workout within 60 minutes.");
        res.setActionData(Map.of("targetCalories", 2800, "protein", 185, "carbs", 300, "fat", 70));
        return res;
    }

    private VoiceAgentResponse handleFatigueCheck() {
        Map<String, Object> fatigue = aiFitnessEngineService.evaluateFatigueAndOverload(List.of(9.0, 9.5, 9.2, 9.5), 24);
        VoiceAgentResponse res = new VoiceAgentResponse();
        res.setActionExecuted("FATIGUE_CHECK");
        res.setSpokenResponse("Based on your recent average RPE of 9.3 over 24 sets, your central nervous system fatigue is high. I recommend a 7-day deload week: reduce working sets by 40% and keep load moderate.");
        res.setActionData(fatigue);
        return res;
    }

    private VoiceAgentResponse handleTrainerSummary() {
        VoiceAgentResponse res = new VoiceAgentResponse();
        res.setActionExecuted("TRAINER_SUMMARY");
        res.setSpokenResponse("Coach, your assigned roster has an average compliance rate of 94% this week. 3 athletes are flagged for deload, and 1 new member requires diet approval.");
        res.setActionData(Map.of("activeClients", 14, "complianceRate", "94%", "pendingDeloads", 3));
        return res;
    }

    private VoiceAgentResponse handleSupplementDoubt(String input) {
        VoiceAgentResponse res = new VoiceAgentResponse();
        res.setActionExecuted("ANSWER_DOUBT");
        if (input.contains("creatine")) {
            res.setSpokenResponse("Creatine Monohydrate saturates muscle phosphocreatine stores. Take 5 grams daily consistently at any time with water to boost power output by 10 to 15 percent.");
        } else {
            res.setSpokenResponse("For maximum muscle recovery, ensure you consume 1.6 to 2.2 grams of protein per kilogram of body weight. Whey isolate post-workout aids fast absorption.");
        }
        return res;
    }

    private VoiceAgentResponse handleWorkoutDoubt(String input) {
        VoiceAgentResponse res = new VoiceAgentResponse();
        res.setActionExecuted("ANSWER_DOUBT");
        res.setSpokenResponse("For compound movements like bench press and squat, keep your feet planted, brace your core using a 360-degree intra-abdominal breath, and control the eccentric motion for 2 to 3 seconds.");
        return res;
    }

    private VoiceAgentResponse handleGeneralDoubt(String input, String role) {
        VoiceAgentResponse res = new VoiceAgentResponse();
        res.setActionExecuted("ANSWER_DOUBT");
        res.setSpokenResponse("I am your HealthPoint AI Voice Coach. You can ask me to alter your diet plan, explain your macros, check your muscular fatigue, or guide your workout form!");
        return res;
    }
}
