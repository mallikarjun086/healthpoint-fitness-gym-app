package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "readiness_logs", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_readiness_date", columnNames = {"user_id", "calculation_date"})
})
@Data
public class ReadinessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "calculation_date", nullable = false)
    private LocalDate calculationDate;

    @Column(name = "readiness_score", nullable = false)
    private int readinessScore; // 0 to 100

    @Column(name = "hrv_z_score", nullable = false)
    private double hrvZScore;

    @Column(name = "sleep_score", nullable = false)
    private int sleepScore; // 0 to 100

    @Column(name = "rhr_score", nullable = false)
    private int rhrScore; // 0 to 100

    @Column(name = "status_category", nullable = false)
    private String statusCategory; // 'PEAK', 'OPTIMAL', 'RECOVERY', 'DELOAD_TRIGGERED'

    @Column(name = "is_consecutive_low")
    private Boolean isConsecutiveLow = false;

    @Column(name = "consecutive_low_days")
    private Integer consecutiveLowDays = 0;

    @Column(name = "adaptive_adjustment_json", columnDefinition = "TEXT")
    private String adaptiveAdjustmentJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
