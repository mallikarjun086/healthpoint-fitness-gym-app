package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String email;

    @Column(nullable = false)
    private String phone;

    private String status = "NEW"; // NEW, TRIAL_SCHEDULED, FOLLOW_UP, CONVERTED, LOST

    private String source = "WALK_IN"; // WALK_IN, INSTAGRAM, GOOGLE_MAPS, WEBSITE, REFERRAL

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(name = "trial_date")
    private LocalDate trialDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
