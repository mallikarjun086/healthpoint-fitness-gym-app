package com.healthpoint.ai.memory;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiChatMessageRepository extends JpaRepository<AiChatMessage, Long> {
    List<AiChatMessage> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
