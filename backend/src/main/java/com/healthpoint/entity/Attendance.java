package com.healthpoint.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance", indexes = {@Index(name = "idx_att_user_date", columnList = "userId, checkInDate")})
@Data
public class Attendance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private LocalDate checkInDate;
    
    private LocalDateTime checkInTime = LocalDateTime.now();
}
