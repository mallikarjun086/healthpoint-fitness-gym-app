package com.healthpoint.entity;

import com.healthpoint.util.Aes256Converter;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "biometric_data", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_biometric_date", columnNames = {"user_id", "recorded_date"})
})
@Data
public class BiometricData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "recorded_date", nullable = false)
    private LocalDate recordedDate;

    @Column(name = "device_source", nullable = false)
    private String deviceSource; // 'APPLE_HEALTH', 'GOOGLE_FIT', 'WHOOP', 'OURA', 'GARMIN', 'SIMULATOR'

    @Convert(converter = Aes256Converter.class)
    @Column(name = "rmssd_hrv_enc", nullable = false, columnDefinition = "TEXT")
    private String rmssdHrv; // HRV RMSSD in ms, stored encrypted

    @Convert(converter = Aes256Converter.class)
    @Column(name = "resting_hr_enc", nullable = false, columnDefinition = "TEXT")
    private String restingHr; // Resting Heart Rate in BPM, stored encrypted

    @Convert(converter = Aes256Converter.class)
    @Column(name = "sleep_minutes_enc", nullable = false, columnDefinition = "TEXT")
    private String sleepMinutes; // Total Sleep Duration in minutes, stored encrypted

    @Convert(converter = Aes256Converter.class)
    @Column(name = "raw_payload_enc", columnDefinition = "TEXT")
    private String rawPayload; // Raw wearable JSON payload, stored encrypted

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Convenience numeric accessors
    public Double getRmssdHrvDouble() {
        try {
            return rmssdHrv != null ? Double.parseDouble(rmssdHrv) : 55.0;
        } catch (Exception e) {
            return 55.0;
        }
    }

    public Integer getRestingHrInt() {
        try {
            return restingHr != null ? Integer.parseInt(restingHr) : 60;
        } catch (Exception e) {
            return 60;
        }
    }

    public Integer getSleepMinutesInt() {
        try {
            return sleepMinutes != null ? Integer.parseInt(sleepMinutes) : 450;
        } catch (Exception e) {
            return 450;
        }
    }
}
