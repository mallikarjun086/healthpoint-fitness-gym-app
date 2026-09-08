package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_enrollments", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_challenge", columnNames = {"user_id", "challenge_id"})
})
@Data
public class ChallengeEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @Column(name = "current_progress", nullable = false)
    private int currentProgress = 0;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
