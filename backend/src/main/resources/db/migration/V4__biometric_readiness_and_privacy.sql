-- HealthPoint Fitness Gym Ecosystem - PostgreSQL Migration V4
-- Biometric-Driven Training Readiness & Wearable Privacy Migration

CREATE TABLE IF NOT EXISTS biometric_data (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL,
    device_source VARCHAR(100) NOT NULL DEFAULT 'APPLE_HEALTH',
    rmssd_hrv_enc TEXT NOT NULL,
    resting_hr_enc TEXT NOT NULL,
    sleep_minutes_enc TEXT NOT NULL,
    raw_payload_enc TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_biometric_date UNIQUE (user_id, recorded_date)
);

CREATE TABLE IF NOT EXISTS wearable_connections (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'APPLE_HEALTH', 'GOOGLE_FIT', 'SIMULATOR', 'WHOOP', 'OURA', 'GARMIN'
    is_connected BOOLEAN DEFAULT TRUE,
    access_token_enc TEXT,
    refresh_token_enc TEXT,
    sync_status VARCHAR(50) DEFAULT 'SYNCED',
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_wearable_provider UNIQUE (user_id, provider)
);

CREATE TABLE IF NOT EXISTS readiness_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    calculation_date DATE NOT NULL,
    readiness_score INT NOT NULL, -- 0 to 100
    hrv_z_score DOUBLE PRECISION NOT NULL,
    sleep_score INT NOT NULL, -- 0 to 100
    rhr_score INT NOT NULL, -- 0 to 100
    status_category VARCHAR(50) NOT NULL, -- 'PEAK', 'OPTIMAL', 'RECOVERY', 'DELOAD_TRIGGERED'
    is_consecutive_low BOOLEAN DEFAULT FALSE,
    consecutive_low_days INT DEFAULT 0,
    adaptive_adjustment_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_readiness_date UNIQUE (user_id, calculation_date)
);

CREATE INDEX IF NOT EXISTS idx_biometric_user_date ON biometric_data(user_id, recorded_date);
CREATE INDEX IF NOT EXISTS idx_readiness_user_date ON readiness_logs(user_id, calculation_date);
CREATE INDEX IF NOT EXISTS idx_wearable_user ON wearable_connections(user_id);
