package com.healthpoint.service;

import com.healthpoint.entity.AddOnSubscription;
import com.healthpoint.entity.Content;
import com.healthpoint.repository.ContentRepository;
import com.healthpoint.repository.AddOnSubscriptionRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentService {

    private final ContentRepository contentRepository;
    private final AddOnSubscriptionRepository addOnRepository;

    public ContentService(ContentRepository contentRepository,
                          AddOnSubscriptionRepository addOnRepository) {
        this.contentRepository = contentRepository;
        this.addOnRepository = addOnRepository;
    }

    public List<Content> getAccessibleContent(Long userId, String type) {
        List<AddOnSubscription> userAddons = addOnRepository.findActiveByUserId(userId);
        List<String> addonTypes = userAddons.stream()
                .map(sub -> sub.getPlan().getContentType())
                .toList();

        return contentRepository.findAccessibleContent(type, addonTypes);
    }

    public Content getContentById(@NonNull Long contentId) {
        return contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));
    }
}