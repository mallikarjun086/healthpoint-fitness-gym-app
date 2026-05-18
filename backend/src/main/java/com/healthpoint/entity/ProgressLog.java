package com.healthpoint.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "progress_log", indexes = {@Index(name = "idx_pl_user_date", columnList = "userId, loggedDate")})
@Data
public class ProgressLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private LocalDate loggedDate;
    private Double bodyWeightKg;
    private Double bodyFatPercentage;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
}
