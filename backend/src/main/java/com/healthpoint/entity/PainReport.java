package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "pain_reports")
@Data
public class PainReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "body_part", nullable = false, length = 100)
    private String bodyPart; // KNEE, LOWER_BACK, SHOULDER, ELBOW, WRIST, HIP, NECK, ANKLE

    @Column(name = "pain_level", nullable = false)
    private int painLevel; // 1 to 10

    @Column(name = "exercise_name", length = 255)
    private String exerciseName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "reported_at")
    private LocalDateTime reportedAt = LocalDateTime.now();
}
