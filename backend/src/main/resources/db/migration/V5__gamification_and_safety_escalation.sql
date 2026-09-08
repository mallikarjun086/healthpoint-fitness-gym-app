-- HealthPoint Fitness Gym Ecosystem - PostgreSQL Migration V5
-- Gamification Engine & Hybrid Human-AI Safety Escalation Schema

-- 1. Achievements Catalog & Unlocked Badges
CREATE TABLE IF NOT EXISTS achievements (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(100) NOT NULL DEFAULT 'Trophy',
    badge_tier VARCHAR(50) NOT NULL DEFAULT 'BRONZE', -- 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'
    points INT NOT NULL DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id BIGINT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_achievement UNIQUE (user_id, achievement_id)
);

-- 2. User Streak Mechanics with Readiness Freeze
CREATE TABLE IF NOT EXISTS user_streaks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    total_workouts_completed INT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    is_frozen BOOLEAN DEFAULT FALSE,
    frozen_date DATE,
    freeze_reason VARCHAR(255),
    consistency_index DOUBLE PRECISION DEFAULT 85.0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Time-Boxed Challenges & Progress Tracking
CREATE TABLE IF NOT EXISTS challenges (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'CONSISTENCY', -- 'SQUAT', 'CONSISTENCY', 'VOLUME', 'MOBILITY'
    target_metric VARCHAR(100) NOT NULL, -- 'SQUATS_COMPLETED', 'DAYS_ACTIVE', 'VOLUME_KG'
    target_value INT NOT NULL,
    duration_days INT NOT NULL DEFAULT 30,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reward_badge_code VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS challenge_enrollments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id BIGINT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    current_progress INT NOT NULL DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT uq_user_challenge UNIQUE (user_id, challenge_id)
);

-- 4. Social Friendships for Consistency Leaderboards
CREATE TABLE IF NOT EXISTS friendships (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACCEPTED', -- 'PENDING', 'ACCEPTED', 'BLOCKED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_friend UNIQUE (user_id, friend_user_id)
);

-- 5. Safety Net: Pain Tracking & Trainer Escalation Queue
CREATE TABLE IF NOT EXISTS pain_reports (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body_part VARCHAR(100) NOT NULL, -- 'KNEE', 'LOWER_BACK', 'SHOULDER', 'ELBOW', 'WRIST', 'HIP'
    pain_level INT NOT NULL, -- 1 to 10
    exercise_name VARCHAR(255),
    notes TEXT,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS safety_escalations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trainer_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    escalation_type VARCHAR(100) NOT NULL, -- 'PAIN_REPORT', 'REPEATED_FORM_FAULT', 'PLATEAU_AUDIT'
    severity VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'IN_REVIEW', 'RESOLVED'
    details_json TEXT NOT NULL,
    user_notes TEXT,
    trainer_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Seed Baseline Achievements
INSERT INTO achievements (code, title, description, icon_name, badge_tier, points) VALUES
('FIRST_WORKOUT', 'First Step Titan (Day 1)', 'Completed your first recorded workout session at HealthPoint.', 'Zap', 'BRONZE', 100),
('STREAK_7_DAY', '7-Day Discipline Master', 'Maintained an unbroken 7-day training consistency streak.', 'Flame', 'SILVER', 250),
('STREAK_30_DAY', '30-Day Iron Legend', 'Achieved 30 days of consistent athletic dedication.', 'Trophy', 'GOLD', 750),
('CENTURY_LIFTER', 'Century Lifter (100 Sessions)', 'Logged 100 total verified training sessions.', 'Crown', 'PLATINUM', 1500),
('FORM_PERFECTIONIST', 'Precision Biomechanics 95%', 'Completed a live camera form coaching set with >95% accuracy score.', 'ShieldCheck', 'GOLD', 400),
('RECOVERY_SCHOLAR', 'Autonomic Balance Master', 'Completed a 0.1Hz pre-workout coherence breathing session during low readiness.', 'Wind', 'BRONZE', 150)
ON CONFLICT (code) DO NOTHING;

-- Seed Challenges
INSERT INTO challenges (code, title, description, category, target_metric, target_value, duration_days, start_date, end_date, reward_badge_code) VALUES
('SQUAT_30_DAY', '30-Day Olympic Squat & Mobility Challenge', 'Accumulate 1,000 deep squats with calibrated camera joint angles over 30 days.', 'SQUAT', 'SQUATS_COMPLETED', 1000, 30, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'FORM_PERFECTIONIST'),
('CORE_21_DAY', '21-Day Core & Postural Stability Sprint', 'Complete 21 consecutive days of core bracing and rotational stiffness training.', 'CONSISTENCY', 'DAYS_ACTIVE', 21, 21, CURRENT_DATE, CURRENT_DATE + INTERVAL '21 days', 'STREAK_7_DAY')
ON CONFLICT (code) DO NOTHING;

-- Seed Sample Friendships for Member 3
INSERT INTO friendships (user_id, friend_user_id, status) VALUES
(3, 1, 'ACCEPTED'),
(3, 2, 'ACCEPTED')
ON CONFLICT DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_enroll_user ON challenge_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_pain_reports_user_date ON pain_reports(user_id, reported_at);
CREATE INDEX IF NOT EXISTS idx_safety_escalations_status ON safety_escalations(status, escalation_type);
