package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "class_bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_session_id", nullable = false)
    private ClassSession classSession;

    @Column(name = "booked_at")
    private LocalDateTime bookedAt = LocalDateTime.now();

    private String status = "CONFIRMED"; // CONFIRMED, CANCELLED, ATTENDED, WAITLIST
}
