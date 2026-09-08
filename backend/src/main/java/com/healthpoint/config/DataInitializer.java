package com.healthpoint.config;

import com.healthpoint.entity.MembershipPlan;
import com.healthpoint.entity.TrainerClientAssignment;
import com.healthpoint.entity.User;
import com.healthpoint.repository.MembershipPlanRepository;
import com.healthpoint.repository.TrainerClientAssignmentRepository;
import com.healthpoint.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final TrainerClientAssignmentRepository trainerClientAssignmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.healthpoint.repository.ClassSessionRepository classSessionRepository;
    private final com.healthpoint.repository.FoodItemRepository foodItemRepository;
    private final com.healthpoint.repository.NotificationRepository notificationRepository;
    private final com.healthpoint.repository.LeadRepository leadRepository;
    private final com.healthpoint.repository.ChallengeRepository challengeRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public DataInitializer(UserRepository userRepository,
                           MembershipPlanRepository membershipPlanRepository,
                           TrainerClientAssignmentRepository trainerClientAssignmentRepository,
                           PasswordEncoder passwordEncoder,
                           com.healthpoint.repository.ClassSessionRepository classSessionRepository,
                           com.healthpoint.repository.FoodItemRepository foodItemRepository,
                           com.healthpoint.repository.NotificationRepository notificationRepository,
                           com.healthpoint.repository.LeadRepository leadRepository,
                           com.healthpoint.repository.ChallengeRepository challengeRepository,
                           org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.membershipPlanRepository = membershipPlanRepository;
        this.trainerClientAssignmentRepository = trainerClientAssignmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.classSessionRepository = classSessionRepository;
        this.foodItemRepository = foodItemRepository;
        this.notificationRepository = notificationRepository;
        this.leadRepository = leadRepository;
        this.challengeRepository = challengeRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        // Seed default users if empty or missing
        seedUser("Member User", "user@hp.com", "password123", "9876543210", "MEMBER");
        seedUser("Trainer Alex", "trainer@hp.com", "password123", "9876543211", "TRAINER");
        seedUser("Admin System", "admin@hp.com", "password123", "9876543212", "ADMIN");

        // Seed default membership plans
        if (membershipPlanRepository.count() == 0) {
            MembershipPlan basic = new MembershipPlan();
            basic.setName("Basic Starter");
            basic.setDescription("Access to gym floor & basic cardio equipment");
            basic.setPrice(new BigDecimal("999"));
            basic.setDurationDays(30);
            membershipPlanRepository.save(basic);

            MembershipPlan pro = new MembershipPlan();
            pro.setName("Pro Fitness");
            pro.setDescription("Full gym access, group classes, & AI coach");
            pro.setPrice(new BigDecimal("1999"));
            pro.setDurationDays(30);
            membershipPlanRepository.save(pro);

            MembershipPlan elite = new MembershipPlan();
            elite.setName("Annual Elite Membership");
            elite.setDescription("All inclusive, personal trainer, AI plan generation & VIP locker");
            elite.setPrice(new BigDecimal("2999"));
            elite.setDurationDays(365);
            membershipPlanRepository.save(elite);
        }

        // Seed initial trainer assignment
        Optional<User> trainer = userRepository.findByEmail("trainer@hp.com");
        Optional<User> member = userRepository.findByEmail("user@hp.com");
        if (trainer.isPresent() && member.isPresent()) {
            if (!trainerClientAssignmentRepository.existsByTrainerIdAndClientId(trainer.get().getId(), member.get().getId())) {
                TrainerClientAssignment tca = new TrainerClientAssignment();
                tca.setTrainer(trainer.get());
                tca.setClient(member.get());
                tca.setStatus("ACTIVE");
                tca.setNotes("Assigned primary personal trainer for Hypertrophy & Physique transformation.");
                trainerClientAssignmentRepository.save(tca);
            }
        }

        // Seed Class Sessions
        if (classSessionRepository.count() == 0) {
            com.healthpoint.entity.ClassSession s1 = new com.healthpoint.entity.ClassSession();
            s1.setTitle("Sunrise Power Yoga & Flexibility");
            s1.setInstructorName("Elena Rostova");
            s1.setCategory("YOGA");
            s1.setStartTime("06:30 AM");
            s1.setEndTime("07:30 AM");
            s1.setSessionDate(java.time.LocalDate.now());
            s1.setCapacity(20);
            s1.setEnrolledCount(14);
            s1.setRoom("Studio A (Zen Hall)");
            s1.setStatus("SCHEDULED");
            s1.setDescription("Dynamic vinyasa flow with deep hip opening and breathwork.");
            classSessionRepository.save(s1);

            com.healthpoint.entity.ClassSession s2 = new com.healthpoint.entity.ClassSession();
            s2.setTitle("HIIT Metabolic Inferno");
            s2.setInstructorName("Alex Mercer");
            s2.setCategory("HIIT");
            s2.setStartTime("08:00 AM");
            s2.setEndTime("08:45 AM");
            s2.setSessionDate(java.time.LocalDate.now());
            s2.setCapacity(25);
            s2.setEnrolledCount(22);
            s2.setRoom("Functional Zone");
            s2.setStatus("SCHEDULED");
            s2.setDescription("High-octane interval circuits targeting maximum caloric expenditure.");
            classSessionRepository.save(s2);

            com.healthpoint.entity.ClassSession s3 = new com.healthpoint.entity.ClassSession();
            s3.setTitle("Barbell Strength & Deadlift Clinic");
            s3.setInstructorName("Marcus Vance");
            s3.setCategory("STRENGTH");
            s3.setStartTime("05:30 PM");
            s3.setEndTime("06:30 PM");
            s3.setSessionDate(java.time.LocalDate.now());
            s3.setCapacity(15);
            s3.setEnrolledCount(12);
            s3.setRoom("Olympic Platform");
            s3.setStatus("SCHEDULED");
            s3.setDescription("Biomechanics breakdown of the clean, deadlift, and squat.");
            classSessionRepository.save(s3);
        }

        // Seed Food Database
        if (foodItemRepository.count() == 0) {
            com.healthpoint.entity.FoodItem f1 = new com.healthpoint.entity.FoodItem();
            f1.setName("Boiled Whole Eggs (2 large)");
            f1.setCalories(140);
            f1.setProteinGrams(12.0);
            f1.setCarbsGrams(1.0);
            f1.setFatGrams(10.0);
            f1.setServingSize("2 eggs (100g)");
            f1.setCategory("Eggs & Dairy");
            f1.setIsVegetarian(false);
            foodItemRepository.save(f1);

            com.healthpoint.entity.FoodItem f2 = new com.healthpoint.entity.FoodItem();
            f2.setName("Grilled Chicken Breast");
            f2.setCalories(165);
            f2.setProteinGrams(31.0);
            f2.setCarbsGrams(0.0);
            f2.setFatGrams(3.6);
            f2.setServingSize("100g");
            f2.setCategory("Poultry");
            f2.setIsVegetarian(false);
            foodItemRepository.save(f2);

            com.healthpoint.entity.FoodItem f3 = new com.healthpoint.entity.FoodItem();
            f3.setName("Paneer (Raw Cottage Cheese)");
            f3.setCalories(265);
            f3.setProteinGrams(18.0);
            f3.setCarbsGrams(3.0);
            f3.setFatGrams(20.0);
            f3.setServingSize("100g");
            f3.setCategory("Dairy");
            f3.setIsVegetarian(true);
            foodItemRepository.save(f3);
        }

        // Seed Sample Leads
        if (leadRepository.count() == 0) {
            com.healthpoint.entity.Lead l1 = new com.healthpoint.entity.Lead();
            l1.setName("Rahul Sharma");
            l1.setEmail("rahul.sharma@example.com");
            l1.setPhone("+91 98765 43210");
            l1.setNotes("HealthPoint Indiranagar - Goal: Hypertrophy & Muscle Gain");
            l1.setStatus("NEW");
            l1.setSource("WEBSITE");
            leadRepository.save(l1);
        }

        // Seed Initial Notification
        if (notificationRepository.count() == 0) {
            com.healthpoint.entity.Notification n = new com.healthpoint.entity.Notification();
            n.setUserId(1L);
            n.setTitle("Welcome to HealthPoint Club! 🏆");
            n.setMessage("Your 3D Biomechanical Muscle Map & AI Training Plan are ready.");
            n.setType("COACH");
            n.setLinkUrl("/member/ai-planner");
            notificationRepository.save(n);
        }

        // Seed Default Challenges
        if (challengeRepository.count() == 0) {
            com.healthpoint.entity.Challenge c1 = new com.healthpoint.entity.Challenge();
            c1.setCode("SQUAT_30_DAY");
            c1.setTitle("30-Day Squat Mastery Challenge");
            c1.setDescription("Complete 1,000 squats across 30 days verified by MediaPipe CV angle analysis.");
            c1.setCategory("SQUAT");
            c1.setTargetMetric("SQUATS_COMPLETED");
            c1.setTargetValue(1000);
            c1.setDurationDays(30);
            c1.setStartDate(java.time.LocalDate.now());
            c1.setEndDate(java.time.LocalDate.now().plusDays(30));
            c1.setRewardBadgeCode("SQUAT_MASTER_1K");
            c1.setIsActive(true);
            challengeRepository.save(c1);

            com.healthpoint.entity.Challenge c2 = new com.healthpoint.entity.Challenge();
            c2.setCode("STREAK_TITAN_21");
            c2.setTitle("21-Day Habit Transformation");
            c2.setDescription("Maintain daily training or active recovery check-ins for 21 consecutive days.");
            c2.setCategory("CONSISTENCY");
            c2.setTargetMetric("DAYS_ACTIVE");
            c2.setTargetValue(21);
            c2.setDurationDays(21);
            c2.setStartDate(java.time.LocalDate.now());
            c2.setEndDate(java.time.LocalDate.now().plusDays(21));
            c2.setRewardBadgeCode("CONSISTENCY_KING");
            c2.setIsActive(true);
            challengeRepository.save(c2);
        }

        syncPostgresSequences();
    }

    private void syncPostgresSequences() {
        try {
            String[] tables = {
                "users", "user_profiles", "user_achievements", "user_streaks",
                "workout_plans", "custom_workouts", "workout_logs", "wearable_connections",
                "safety_escalations", "pain_reports", "challenges", "challenge_enrollments",
                "payments", "membership_plans", "exercises", "diet_plans", "food_items", "leads"
            };

            for (String table : tables) {
                try {
                    String sql = "SELECT setval(pg_get_serial_sequence('" + table + "', 'id'), COALESCE(MAX(id), 1)) FROM " + table;
                    jdbcTemplate.execute(sql);
                } catch (Exception ignored) {
                    // Ignore if sequence doesn't exist for a particular table
                }
            }
        } catch (Exception e) {
            // Sequence sync non-fatal
        }
    }

    private void seedUser(String name, String email, String password, String phone, String role) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setPhoneNumber(phone);
            user.setRole(role);
            userRepository.save(user);
        }
    }
}

