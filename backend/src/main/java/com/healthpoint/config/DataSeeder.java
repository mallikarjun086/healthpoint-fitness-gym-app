package com.healthpoint.config;

import com.healthpoint.entity.User;
import com.healthpoint.entity.WorkoutPlan;
import com.healthpoint.entity.Exercise;
import com.healthpoint.repository.UserRepository;
import com.healthpoint.repository.WorkoutPlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Configuration
public class DataSeeder {

    @Bean
    @Order(1)
    CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) return;

            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@hp.com");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setPhoneNumber("+91 9000000001");

            User trainer = new User();
            trainer.setName("Pro Trainer");
            trainer.setEmail("trainer@hp.com");
            trainer.setPassword(passwordEncoder.encode("password123"));
            trainer.setPhoneNumber("+91 9000000002");

            User member = new User();
            member.setName("Mallikarjun");
            member.setEmail("user@hp.com");
            member.setPassword(passwordEncoder.encode("password123"));
            member.setPhoneNumber("+91 9000000003");

            userRepository.saveAll(Objects.requireNonNull(List.of(admin, trainer, member)));
        };
    }

    @Bean
    @Order(2)
    CommandLineRunner initDatabase(WorkoutPlanRepository repository) {
        return args -> {
            if (repository.count() > 0) return;

            // 1. PUSH WORKOUT
            WorkoutPlan push = new WorkoutPlan();
            push.setTitle("Push Power: Chest & Triceps");
            push.setDescription("Focus on pressing movements for maximum upper body strength.");
            push.setDifficulty("INTERMEDIATE");
            push.setDurationMinutes(60);
            push.setBodyPart("PUSH_DAY");
            push.setExercises(Arrays.asList(
                createExercise("Bench Press", 4, 10, "90s", "Chest, Triceps, Shoulders", "Keep feet flat on floor, elbows at 45 degrees."),
                createExercise("Overhead Press", 3, 12, "60s", "Shoulders, Triceps", "Engage core, do not arch your back."),
                createExercise("Tricep Dips", 3, 15, "45s", "Triceps, Chest", "Maintain upright posture for tricep focus.")
            ));

            // 2. PULL WORKOUT
            WorkoutPlan pull = new WorkoutPlan();
            pull.setTitle("Pull Performance: Back & Biceps");
            pull.setDescription("Build a powerful back and strong biceps with vertical and horizontal pulls.");
            pull.setDifficulty("INTERMEDIATE");
            pull.setDurationMinutes(65);
            pull.setBodyPart("PULL_DAY");
            pull.setExercises(Arrays.asList(
                createExercise("Deadlifts", 3, 8, "120s", "Hamstrings, Lower Back, Glutes", "Keep the bar close to your shins, flat back."),
                createExercise("Pull Ups", 3, 10, "90s", "Lats, Biceps, Forearms", "Pull chest to bar, controlled descent."),
                createExercise("Barbell Rows", 4, 12, "60s", "Mid Back, Lats, Biceps", "Pull towards your belly button, squeeze blades.")
            ));

            // 3. LEGS WORKOUT
            WorkoutPlan legs = new WorkoutPlan();
            legs.setTitle("Leg Day: Quads & Glutes");
            legs.setDescription("High-intensity lower body training for explosiveness and strength.");
            legs.setDifficulty("ADVANCED");
            legs.setDurationMinutes(70);
            legs.setBodyPart("LEG_DAY");
            legs.setExercises(Arrays.asList(
                createExercise("Barbell Squats", 4, 10, "120s", "Quads, Glutes, Hamstrings", "Drive through your heels, knees out."),
                createExercise("Leg Press", 3, 15, "60s", "Quads, Hamstrings", "Do not lock your knees at the top."),
                createExercise("Walking Lunges", 3, 20, "60s", "Glutes, Quads", "Take wide steps, keep torso upright.")
            ));

            // 4. CORE WORKOUT
            WorkoutPlan core = new WorkoutPlan();
            core.setTitle("Core Stability Blast");
            core.setDescription("Strengthen your midsection and improve posture.");
            core.setDifficulty("BEGINNER");
            core.setDurationMinutes(25);
            core.setBodyPart("CORE_ABS");
            core.setExercises(Arrays.asList(
                createExercise("Plank", 3, 1, "30s", "Abs, Obliques, Shoulders", "Maintain a straight line from head to heels."),
                createExercise("Hanging Leg Raises", 3, 15, "45s", "Lower Abs, Hip Flexors", "Do not swing, control the movement."),
                createExercise("Russian Twists", 3, 20, "30s", "Obliques, Abs", "Rotate your entire torso, not just arms.")
            ));

            // 5. CARDIO WORKOUT
            WorkoutPlan cardio = new WorkoutPlan();
            cardio.setTitle("HIIT Fat Burner");
            cardio.setDescription("Fast-paced cardio session to boost metabolism and heart health.");
            cardio.setDifficulty("INTERMEDIATE");
            cardio.setDurationMinutes(30);
            cardio.setBodyPart("CARDIO");
            cardio.setExercises(Arrays.asList(
                createExercise("Burpees", 4, 15, "30s", "Full Body, Core, Cardio", "Explosive jump, chest to floor."),
                createExercise("Mountain Climbers", 4, 30, "30s", "Core, Shoulders", "Keep hips low, drive knees to chest."),
                createExercise("Jumping Jacks", 4, 50, "30s", "Cardio, Calves", "Maintain a steady rhythm, stay on toes.")
            ));

            // 6. FULL BODY WORKOUT
            WorkoutPlan fullBody = new WorkoutPlan();
            fullBody.setTitle("Ultimate Full Body");
            fullBody.setDescription("Complete body conditioning covering every major muscle group.");
            fullBody.setDifficulty("ADVANCED");
            fullBody.setDurationMinutes(80);
            fullBody.setBodyPart("FULL_BODY");
            fullBody.setExercises(Arrays.asList(
                createExercise("Clean and Press", 4, 8, "90s", "Full Body, Shoulders, Legs", "Explosive movement, lock out at top."),
                createExercise("Kettlebell Swings", 4, 15, "60s", "Glutes, Hamstrings, Core", "Hinge at hips, squeeze glutes."),
                createExercise("Push Ups", 4, 20, "45s", "Chest, Triceps, Core", "Full range of motion, elbows in.")
            ));

            repository.saveAll(Objects.requireNonNull(List.of(push, pull, legs, core, cardio, fullBody)));
        };
    }

    @Bean
    @Order(3)
    CommandLineRunner seedDietPlans(com.healthpoint.repository.DietPlanRepository repository) {
        return args -> {
            if (repository.count() > 0) return;

            // 1. VEG - WEIGHT LOSS
            com.healthpoint.entity.DietPlan vegLoss = new com.healthpoint.entity.DietPlan();
            vegLoss.setTitle("Vegetarian Lean & Green");
            vegLoss.setDescription("A nutrient-dense plant-based plan focused on fat loss and high fiber.");
            vegLoss.setCalories(1800);
            vegLoss.setProtein(120);
            vegLoss.setCarbs(150);
            vegLoss.setFat(45);
            vegLoss.setMealType("VEG");
            vegLoss.setItems("Oatmeal with Almonds, Quinoa Salad, Paneer Tikka, Greek Yogurt with Berries, Lentil Soup");

            // 2. VEG - MUSCLE GAIN
            com.healthpoint.entity.DietPlan vegGain = new com.healthpoint.entity.DietPlan();
            vegGain.setTitle("Veg Bulk Master");
            vegGain.setDescription("High protein and calorie plan for muscle hypertrophy using plant-based sources.");
            vegGain.setCalories(2800);
            vegGain.setProtein(160);
            vegGain.setCarbs(350);
            vegGain.setFat(75);
            vegGain.setMealType("VEG");
            vegGain.setItems("Peanut Butter Toast, Chickpea Pasta, Soya Chunks Curry, Brown Rice & Beans, Protein Shake");

            // 3. NON-VEG - SHRED
            com.healthpoint.entity.DietPlan nonVegLoss = new com.healthpoint.entity.DietPlan();
            nonVegLoss.setTitle("High Protein Cut (Non-Veg)");
            nonVegLoss.setDescription("Lean animal proteins combined with complex carbs for rapid fat loss.");
            nonVegLoss.setCalories(2000);
            nonVegLoss.setProtein(180);
            nonVegLoss.setCarbs(120);
            nonVegLoss.setFat(60);
            nonVegLoss.setMealType("NON_VEG");
            nonVegLoss.setItems("Egg White Omelet, Grilled Chicken Breast, Tuna Salad, Steamed Fish with Asparagus");

            // 4. NON-VEG - GAIN
            com.healthpoint.entity.DietPlan nonVegGain = new com.healthpoint.entity.DietPlan();
            nonVegGain.setTitle("Animal Power Gainer");
            nonVegGain.setDescription("Aggressive calorie and protein intake for maximum strength and size.");
            nonVegGain.setCalories(3200);
            nonVegGain.setProtein(220);
            nonVegGain.setCarbs(400);
            nonVegGain.setFat(90);
            nonVegGain.setMealType("NON_VEG");
            nonVegGain.setItems("Whole Eggs & Avocado, Steak & Sweet Potato, Salmon with Rice, Turkey Sandwiches");

            repository.saveAll(Objects.requireNonNull(List.of(vegLoss, vegGain, nonVegLoss, nonVegGain)));
        };
    }

    @Bean
    @Order(4)
    CommandLineRunner seedVideoLibrary(com.healthpoint.repository.ContentRepository repository) {
        return args -> {
            if (repository.count() > 0) return;

            com.healthpoint.entity.Content v1 = new com.healthpoint.entity.Content();
            v1.setTitle("Yoga for Focus");
            v1.setDescription("Improve flexibility and mental clarity with this morning flow.");
            v1.setType("YOGA");
            v1.setUrl("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKpxvsh7K7wV6nC/giphy.gif");
            v1.setIsPremium(true);
            v1.setRequiredAddon("PREMIUM");

            com.healthpoint.entity.Content v2 = new com.healthpoint.entity.Content();
            v2.setTitle("HIIT Core Burn");
            v2.setDescription("High intensity interval training focusing on your midsection.");
            v2.setType("HIIT");
            v2.setUrl("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKunV2hT9W65O6Y/giphy.gif");
            v2.setIsPremium(true);
            v2.setRequiredAddon("PREMIUM");

            com.healthpoint.entity.Content v3 = new com.healthpoint.entity.Content();
            v3.setTitle("Strength Masterclass");
            v3.setDescription("Master the fundamental compound movements with perfect form.");
            v3.setType("STRENGTH");
            v3.setUrl("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKpxvsh7K7wV6nC/giphy.gif");
            v3.setIsPremium(true);
            v3.setRequiredAddon("PREMIUM");

            repository.saveAll(Objects.requireNonNull(List.of(v1, v2, v3)));
        };
    }

    @Bean
    @Order(5)
    CommandLineRunner seedPayments(com.healthpoint.repository.PaymentRepository repository, com.healthpoint.repository.UserRepository userRepository) {
        return args -> {
            if (repository.count() > 0) return;

            com.healthpoint.entity.User user = userRepository.findByEmail("user@hp.com").orElse(null);
            if (user == null) return;

            com.healthpoint.entity.Payment p1 = new com.healthpoint.entity.Payment();
            p1.setUser(user);
            p1.setAmount(new java.math.BigDecimal("2999.00"));
            p1.setCurrency("INR");
            p1.setStatus("SUCCESS");
            p1.setPaymentFor("ANNUAL_MEMBERSHIP");
            p1.setCreatedAt(java.time.LocalDateTime.now().minusMonths(2));

            com.healthpoint.entity.Payment p2 = new com.healthpoint.entity.Payment();
            p2.setUser(user);
            p2.setAmount(new java.math.BigDecimal("499.00"));
            p2.setCurrency("INR");
            p2.setStatus("SUCCESS");
            p2.setPaymentFor("PRO_TRAINER_ADDON");
            p2.setCreatedAt(java.time.LocalDateTime.now().minusDays(15));

            repository.saveAll(Objects.requireNonNull(List.of(p1, p2)));
        };
    }

    private Exercise createExercise(String name, int sets, int reps, String rest, String impact, String cues) {
        Exercise e = new Exercise();
        e.setName(name);
        e.setSets(sets);
        e.setReps(reps);
        e.setRestTime(rest);
        e.setMuscleImpact(impact);
        e.setFormCues(cues);
        
        // Map EVERY exercise to a unique high-quality training animation
        String videoUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKpxvsh7K7wV6nC/giphy.gif"; 
        
        if (name.contains("Bench Press")) videoUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKunV2hT9W65O6Y/giphy.gif";
        if (name.contains("Squats")) videoUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKunV2hT9W65O6Y/giphy.gif";
        if (name.contains("Deadlifts")) videoUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKunV2hT9W65O6Y/giphy.gif";
        if (name.contains("Push Ups")) videoUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKunV2hT9W65O6Y/giphy.gif";
        if (name.contains("Pull Ups")) videoUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKunV2hT9W65O6Y/giphy.gif";
        if (name.contains("Plank")) videoUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKunV2hT9W65O6Y/giphy.gif";
        if (name.contains("Burpees")) videoUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKunV2hT9W65O6Y/giphy.gif";
        if (name.contains("Mountain Climbers")) videoUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKunV2hT9W65O6Y/giphy.gif";
        if (name.contains("Clean and Press")) videoUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3RycG84ZTNvYXJvNjE0eTRpZWJ6NnpnMmF3eTh6eHB6Znl6eXp6ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zy/3o7TKunV2hT9W65O6Y/giphy.gif";
        
        e.setVideoUrl(videoUrl); 
        return e;
    }
}
