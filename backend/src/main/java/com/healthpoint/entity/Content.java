package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "content")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private String type; // WORKOUT, DIET, VIDEO

    @Column(nullable = false)
    private String url; // URL to content

    @Column(name = "required_addon")
    private String requiredAddon; // WORKOUT, DIET, or NULL for basic

    @Column(name = "is_premium")
    private Boolean isPremium = false;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;
}