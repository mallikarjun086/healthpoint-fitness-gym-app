-- HealthPoint Fitness - Seed Data Migration
-- Flyway Migration V2: Seed Data

-- 1. Users (password is 'password123' bcrypt hash: $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a)
INSERT INTO users (id, name, email, password, phone_number, role, is_active, created_at, updated_at)
VALUES 
(1, 'Admin User', 'admin@hp.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '+91 9876543210', 'ADMIN', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Master Trainer Alex', 'trainer@hp.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '+91 9876543211', 'TRAINER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Mallikarjun Gala', 'user@hp.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '+91 9876543212', 'MEMBER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Sarah Jenkins', 'sarah@hp.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '+91 9876543213', 'MEMBER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 2. User Profiles
INSERT INTO user_profiles (id, user_id, height_cm, weight_kg, experience_level, goal_type, bmi, daily_calories, daily_protein, daily_carbs, daily_fat)
VALUES
(1, 3, 178.0, 75.0, 'INTERMEDIATE', 'AESTHETIC', 23.7, 2650, 185, 280, 65),
(2, 4, 165.0, 62.0, 'BEGINNER', 'AESTHETIC', 22.8, 1750, 110, 190, 45)
ON CONFLICT (id) DO NOTHING;

-- 3. Membership Plans
INSERT INTO membership_plans (id, name, description, price, duration_days, is_active)
VALUES
(1, 'Monthly Starter', 'Flexible month-to-month gym floor & locker access', 1499.00, 30, TRUE),
(2, 'Quarterly Pro Athlete', 'Our most popular quarterly conditioning package', 3999.00, 90, TRUE),
(3, 'Annual Elite VIP Pass', 'Complete 365-day transformation VIP experience', 11999.00, 365, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Subscriptions
INSERT INTO subscriptions (id, user_id, plan_id, start_date, end_date, is_active)
VALUES
(1, 3, 3, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP + INTERVAL '335 days', TRUE),
(2, 4, 2, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP + INTERVAL '80 days', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. Trainer Assignments
INSERT INTO trainer_client_assignments (id, trainer_id, client_id, status, notes)
VALUES
(1, 2, 3, 'ACTIVE', 'Focusing on upper body progressive overload and 185g protein adherence.'),
(2, 2, 4, 'ACTIVE', 'Focusing on HIIT conditioning and core stabilization.')
ON CONFLICT (id) DO NOTHING;

-- 6. Class Sessions (Live schedule)
INSERT INTO class_sessions (id, title, instructor_name, category, start_time, end_time, session_date, capacity, enrolled_count, room, status, description)
VALUES
(1, 'Sunrise Power Yoga & Mobility', 'Elena Rostova', 'YOGA', '06:30 AM', '07:30 AM', CURRENT_DATE, 20, 14, 'Studio A (Zen Hall)', 'SCHEDULED', 'Dynamic vinyasa flow with deep hip opening and breathwork.'),
(2, 'HIIT Metabolic Inferno', 'Alex Mercer', 'HIIT', '08:00 AM', '08:45 AM', CURRENT_DATE, 25, 22, 'Functional Zone', 'SCHEDULED', 'High-octane interval circuits targeting maximum caloric expenditure.'),
(3, 'Barbell Strength & Deadlift Clinic', 'Marcus Vance', 'STRENGTH', '05:30 PM', '06:30 PM', CURRENT_DATE, 15, 12, 'Olympic Platform', 'SCHEDULED', 'Biomechanics breakdown of the clean, deadlift, and squat.'),
(4, 'Zumba Dance Cardio Party', 'Priya Sharma', 'CARDIO', '07:00 PM', '08:00 PM', CURRENT_DATE, 30, 26, 'Studio B (Main)', 'SCHEDULED', 'High-energy Latin and Bollywood cardio choreography.'),
(5, 'CrossFit MetCon Blitz', 'Alex Mercer', 'CROSSFIT', '07:00 AM', '08:00 AM', CURRENT_DATE + INTERVAL '1 day', 20, 10, 'CrossFit Rig', 'SCHEDULED', 'WOD featuring kettlebell snatches, box jumps, and row intervals.')
ON CONFLICT (id) DO NOTHING;

-- 7. Indian & Global Food Database
INSERT INTO food_items (id, name, calories, protein_grams, carbs_grams, fat_grams, serving_size, category, is_vegetarian)
VALUES
(1, 'Boiled Whole Eggs (2 large)', 140, 12.0, 1.0, 10.0, '2 eggs (100g)', 'Eggs & Dairy', FALSE),
(2, 'Egg Whites (4 large)', 68, 14.4, 0.8, 0.2, '4 whites (132g)', 'Eggs & Dairy', FALSE),
(3, 'Grilled Chicken Breast', 165, 31.0, 0.0, 3.6, '100g', 'Poultry', FALSE),
(4, 'Paneer (Raw Indian Cottage Cheese)', 265, 18.0, 3.0, 20.0, '100g', 'Dairy', TRUE),
(5, 'Low-Fat Paneer / Tofu', 140, 24.0, 2.5, 4.0, '100g', 'Dairy & Vegan', TRUE),
(6, 'Cooked Brown Rice', 111, 2.6, 23.0, 0.9, '100g cooked', 'Grains', TRUE),
(7, 'Yellow Moong Dal (Cooked)', 105, 7.0, 19.0, 0.5, '100g / 1 katori', 'Lentils & Pulses', TRUE),
(8, 'Cooked Chana (Chickpeas)', 164, 8.9, 27.4, 2.6, '100g', 'Lentils & Pulses', TRUE),
(9, 'Soya Chunks (Dry)', 345, 52.0, 33.0, 0.5, '100g dry', 'Plant Protein', TRUE),
(10, 'Rolled Oats with Water', 150, 5.0, 27.0, 2.5, '40g dry', 'Grains', TRUE),
(11, 'Whey Protein Isolate (1 scoop)', 120, 25.0, 1.5, 1.0, '1 scoop (30g)', 'Supplements', TRUE),
(12, 'Whole Wheat Roti / Chapati', 85, 3.0, 17.0, 0.4, '1 medium (35g)', 'Grains', TRUE),
(13, 'Greek Yogurt (Plain 0% Fat)', 59, 10.0, 3.6, 0.4, '100g', 'Dairy', TRUE),
(14, 'Raw Almonds', 160, 6.0, 6.0, 14.0, '28g (23 nuts)', 'Nuts & Seeds', TRUE),
(15, 'Peanut Butter (Natural)', 190, 8.0, 7.0, 16.0, '2 tbsp (32g)', 'Spreads', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 8. Sample Food Logs for Member (user_id=3)
INSERT INTO food_logs (id, user_id, food_name, meal_type, calories, protein_grams, carbs_grams, fat_grams, quantity, log_date, logged_at)
VALUES
(1, 3, 'Rolled Oats with Whey & Almonds', 'BREAKFAST', 430, 36.0, 48.0, 12.0, 1.0, CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(2, 3, 'Grilled Chicken Breast with Brown Rice & Broccoli', 'LUNCH', 580, 52.0, 65.0, 9.0, 1.0, CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- 9. Sample Attendance for Member
INSERT INTO attendance (id, user_id, check_in_time, check_out_time, attendance_date, status, branch_name)
VALUES
(1, 3, CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '2.5 hours', CURRENT_DATE, 'PRESENT', 'Main Flagship'),
(2, 3, CURRENT_TIMESTAMP - INTERVAL '28 hours', CURRENT_TIMESTAMP - INTERVAL '26.5 hours', CURRENT_DATE - INTERVAL '1 day', 'PRESENT', 'Main Flagship'),
(3, 3, CURRENT_TIMESTAMP - INTERVAL '52 hours', CURRENT_TIMESTAMP - INTERVAL '50.5 hours', CURRENT_DATE - INTERVAL '2 days', 'PRESENT', 'Main Flagship')
ON CONFLICT (id) DO NOTHING;

-- 10. Sample Leads (for Admin Lead Management)
INSERT INTO leads (id, name, email, phone, status, source, notes, assigned_to, trial_date)
VALUES
(1, 'Rohan Verma', 'rohan.v@gmail.com', '+91 9811223344', 'TRIAL_SCHEDULED', 'INSTAGRAM', 'Interested in personal training for fat loss.', 'Alex Mercer', CURRENT_DATE + INTERVAL '2 days'),
(2, 'Ananya Sen', 'ananya.sen@outlook.com', '+91 9822334455', 'FOLLOW_UP', 'WALK_IN', 'Inquired about annual couple membership pricing.', 'Front Desk', CURRENT_DATE + INTERVAL '1 day'),
(3, 'Dev Patel', 'dev.patel@yahoo.com', '+91 9833445566', 'CONVERTED', 'GOOGLE_MAPS', 'Converted to 1-Year VIP Elite membership.', 'Admin User', CURRENT_DATE - INTERVAL '3 days'),
(4, 'Kavita Rao', 'kavita.r@gmail.com', '+91 9844556677', 'NEW', 'WEBSITE', 'Booked a free trial pass for Zumba.', 'Elena Rostova', CURRENT_DATE + INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- 11. Sample Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, link_url)
VALUES
(1, 3, 'Coach Note Updated', 'Master Trainer Alex updated your Push hypertrophy volume targets.', 'COACH', FALSE, '/member/workouts'),
(2, 3, 'Class Reminder', 'Barbell Strength & Deadlift Clinic begins today at 05:30 PM.', 'CLASS', FALSE, '/member/classes'),
(3, 3, 'Streak Milestones: 7 Days 🔥', 'Incredible consistency! You have logged 7 consecutive days at HealthPoint.', 'STREAK', TRUE, '/member/attendance')
ON CONFLICT (id) DO NOTHING;
