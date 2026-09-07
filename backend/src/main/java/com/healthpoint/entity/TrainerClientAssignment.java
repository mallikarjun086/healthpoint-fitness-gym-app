package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "trainer_client_assignments", indexes = {
    @Index(name = "idx_tca_trainer", columnList = "trainer_id"),
    @Index(name = "idx_tca_client", columnList = "client_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainerClientAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, PAUSED

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @PrePersist
    protected void onCreate() {
        if (assignedAt == null) {
            assignedAt = LocalDateTime.now();
        }
    }
}
