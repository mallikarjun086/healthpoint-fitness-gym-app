package com.healthpoint.service;

import com.healthpoint.repository.SubscriptionRepository;
import com.healthpoint.repository.AddOnSubscriptionRepository;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionAccessService {

    private final SubscriptionRepository subscriptionRepository;
    private final AddOnSubscriptionRepository addOnRepository;

    public SubscriptionAccessService(SubscriptionRepository subscriptionRepository,
                                     AddOnSubscriptionRepository addOnRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.addOnRepository = addOnRepository;
    }

    public boolean canAccessContent(Long userId, String requiredAddon) {
        // Check base membership
        boolean hasMembership = subscriptionRepository.findActiveByUserId(userId).isPresent();

        if (!hasMembership) {
            return false;
        }

        // If no specific addon required, allow access
        if (requiredAddon == null || requiredAddon.isEmpty()) {
            return true;
        }

        // Check specific addon
        return addOnRepository.findActiveByUserId(userId)
                .stream()
                .anyMatch(sub -> sub.getPlan().getContentType().equals(requiredAddon));
    }
}