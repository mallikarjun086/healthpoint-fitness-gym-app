package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "achievements")
@Data
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String code;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", nullable = false, length = 100)
    private String iconName = "Trophy";

    @Column(name = "badge_tier", nullable = false, length = 50)
    private String badgeTier = "BRONZE"; // BRONZE, SILVER, GOLD, PLATINUM, DIAMOND

    @Column(nullable = false)
    private int points = 50;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
