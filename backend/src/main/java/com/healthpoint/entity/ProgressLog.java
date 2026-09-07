package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressLog {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "log_date")
    private LocalDate logDate = LocalDate.now();

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "body_fat_percentage")
    private Double bodyFatPercentage;

    @Column(name = "chest_cm")
    private Double chestCm;

    @Column(name = "waist_cm")
    private Double waistCm;

    @Column(name = "arms_cm")
    private Double armsCm;

    @Column(name = "thighs_cm")
    private Double thighsCm;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "logged_at")
    private LocalDateTime loggedAt = LocalDateTime.now();

    // Compatibility methods for AI analysis
    public Double getBodyWeightKg() {
        return weightKg;
    }

    public void setBodyWeightKg(Double bodyWeightKg) {
        this.weightKg = bodyWeightKg;
    }

    public LocalDate getLoggedDate() {
        return logDate;
    }

    public void setLoggedDate(LocalDate loggedDate) {
        this.logDate = loggedDate;
    }
}

