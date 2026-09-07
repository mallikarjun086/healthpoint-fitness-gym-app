-- HealthPoint Fitness Gym Ecosystem - PostgreSQL Baseline Schema
-- Flyway Migration V1: Initial Schema Definition

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    height_cm DOUBLE PRECISION,
    weight_kg DOUBLE PRECISION,
    experience_level VARCHAR(50) NOT NULL DEFAULT 'INTERMEDIATE',
    goal_type VARCHAR(100) NOT NULL DEFAULT 'AESTHETIC',
    sport_name VARCHAR(100),
    workout_plan_json TEXT,
    diet_plan_json TEXT,
    bmi DOUBLE PRECISION,
    daily_calories INT,
    daily_protein INT,
    daily_carbs INT,
    daily_fat INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS membership_plans (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    duration_days INT NOT NULL DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    plan_id BIGINT REFERENCES membership_plans(id),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addon_plans (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    content_type VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS addon_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    addon_plan_id BIGINT REFERENCES addon_plans(id),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercises (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sets INT,
    reps INT,
    rest_time VARCHAR(50),
    muscle_impact VARCHAR(255),
    form_cues TEXT,
    video_url TEXT
);

CREATE TABLE IF NOT EXISTS workout_plans (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50),
    duration_minutes INT,
    body_part VARCHAR(100),
    workout_split_json TEXT,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workout_plan_exercises (
    workout_plan_id BIGINT REFERENCES workout_plans(id) ON DELETE CASCADE,
    exercise_id BIGINT REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    workout_plan_id BIGINT REFERENCES workout_plans(id),
    log_date TIMESTAMP,
    completion_percentage INT DEFAULT 0,
    session_notes TEXT,
    total_volume_kg DOUBLE PRECISION DEFAULT 0.0,
    duration_minutes INT DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercise_logs (
    id BIGSERIAL PRIMARY KEY,
    workout_log_id BIGINT REFERENCES workout_logs(id) ON DELETE CASCADE,
    exercise_id BIGINT REFERENCES exercises(id),
    sets_completed INT,
    reps_completed INT,
    weight_lifted_kg DOUBLE PRECISION,
    rpe INT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS diet_plans (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    calories INT,
    protein INT,
    carbs INT,
    fat INT,
    meal_type VARCHAR(50),
    items TEXT,
    meal_schedule_json TEXT,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    attendance_date DATE,
    status VARCHAR(50) DEFAULT 'PRESENT',
    branch_name VARCHAR(100) DEFAULT 'Main Flagship'
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_for VARCHAR(100),
    reference_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    url TEXT,
    thumbnail TEXT,
    category VARCHAR(100),
    views VARCHAR(50) DEFAULT '0',
    duration VARCHAR(50),
    target_muscles VARCHAR(255),
    cues TEXT,
    mistakes TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    required_addon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE,
    weight_kg DOUBLE PRECISION,
    body_fat_percentage DOUBLE PRECISION,
    chest_cm DOUBLE PRECISION,
    waist_cm DOUBLE PRECISION,
    arms_cm DOUBLE PRECISION,
    thighs_cm DOUBLE PRECISION,
    photo_url TEXT,
    notes TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trainer_client_assignments (
    id BIGSERIAL PRIMARY KEY,
    trainer_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    client_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    notes TEXT
);

CREATE TABLE IF NOT EXISTS class_sessions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructor_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50) NOT NULL,
    session_date DATE NOT NULL,
    capacity INT DEFAULT 25,
    enrolled_count INT DEFAULT 0,
    room VARCHAR(100) DEFAULT 'Studio 1',
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    class_session_id BIGINT REFERENCES class_sessions(id) ON DELETE CASCADE,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'CONFIRMED'
);

CREATE TABLE IF NOT EXISTS leads (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'NEW',
    source VARCHAR(100) DEFAULT 'WALK_IN',
    notes TEXT,
    assigned_to VARCHAR(255),
    trial_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    calories INT NOT NULL,
    protein_grams DOUBLE PRECISION DEFAULT 0,
    carbs_grams DOUBLE PRECISION DEFAULT 0,
    fat_grams DOUBLE PRECISION DEFAULT 0,
    serving_size VARCHAR(100) DEFAULT '100g',
    category VARCHAR(100) DEFAULT 'General',
    is_vegetarian BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS food_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    food_name VARCHAR(255) NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    calories INT NOT NULL,
    protein_grams DOUBLE PRECISION DEFAULT 0,
    carbs_grams DOUBLE PRECISION DEFAULT 0,
    fat_grams DOUBLE PRECISION DEFAULT 0,
    quantity DOUBLE PRECISION DEFAULT 1.0,
    log_date DATE NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    sender_name VARCHAR(255),
    receiver_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    receiver_name VARCHAR(255),
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    link_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index creation for speed and performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance(user_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_progress_logs_user ON progress_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_food_logs_user ON food_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_chat_messages_pair ON chat_messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
