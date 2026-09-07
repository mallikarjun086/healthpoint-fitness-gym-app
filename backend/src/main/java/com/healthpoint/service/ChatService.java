package com.healthpoint.service;

import com.healthpoint.entity.ChatMessage;
import com.healthpoint.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    public List<ChatMessage> getConversation(Long user1, Long user2) {
        List<ChatMessage> thread = chatMessageRepository.findConversation(user1, user2);
        // Mark as read
        for (ChatMessage msg : thread) {
            if (msg.getReceiverId().equals(user1) && !Boolean.TRUE.equals(msg.getIsRead())) {
                msg.setIsRead(true);
                chatMessageRepository.save(msg);
            }
        }
        return thread;
    }

    public ChatMessage sendMessage(ChatMessage message) {
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }
        message.setIsRead(false);
        return chatMessageRepository.save(message);
    }
}
