package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "friendships", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_friend", columnNames = {"user_id", "friend_user_id"})
})
@Data
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "friend_user_id", nullable = false)
    private Long friendUserId;

    @Column(nullable = false, length = 50)
    private String status = "ACCEPTED"; // PENDING, ACCEPTED, BLOCKED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
