package com.healthpoint.ai.memory;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_chat_message")
@Data
public class AiChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    
    private String role; 
    
    @Column(columnDefinition = "TEXT")
    private String content;

    private int tokenCount;

    private LocalDateTime createdAt = LocalDateTime.now();
}
