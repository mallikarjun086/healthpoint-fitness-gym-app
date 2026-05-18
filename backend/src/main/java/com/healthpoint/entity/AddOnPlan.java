package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "addon_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddOnPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "content_type")
    private String contentType; // WORKOUT, DIET, VIDEO

    @Column(name = "is_active")
    private Boolean isActive = true;

    public long getDurationDays() {
        return 0;
    }
}