package com.healthpoint.service;

import com.healthpoint.entity.AddOnPlan;
import com.healthpoint.entity.AddOnSubscription;
import com.healthpoint.entity.User;
import com.healthpoint.repository.AddOnPlanRepository;
import com.healthpoint.repository.AddOnSubscriptionRepository;
import com.healthpoint.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AddOnService {

    private final AddOnPlanRepository planRepository;
    private final AddOnSubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public AddOnService(AddOnPlanRepository planRepository,
            AddOnSubscriptionRepository subscriptionRepository,
            UserRepository userRepository) {
        this.planRepository = planRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    // Get all active plans
    public List<AddOnPlan> getActivePlans() {
        return planRepository.findByIsActiveTrue();
    }

    // Get plans by type (WORKOUT, DIET, VIDEO)
    public List<AddOnPlan> getPlansByType(String contentType) {
        return planRepository.findByContentTypeAndIsActiveTrue(contentType);
    }

    // Purchase AddOn
    public AddOnSubscription purchaseAddOn(@NonNull Long userId, @NonNull Long planId, String paymentId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AddOnPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        AddOnSubscription subscription = new AddOnSubscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setEndDate(LocalDateTime.now().plusDays(plan.getDurationDays())); // better than fixed 30

        return subscriptionRepository.save(subscription);
    }

    // Check if user has active add-on by type
    public boolean hasActiveAddOn(@NonNull Long userId, String contentType) {
        return subscriptionRepository.findActiveByUserId(userId)
                .stream()
                .anyMatch(sub -> sub.getPlan().getContentType().equalsIgnoreCase(contentType));
    }

    // Check specific plan
    public boolean hasSpecificAddOn(@NonNull Long userId, @NonNull Long planId) {
        return subscriptionRepository.findActiveByUserIdAndPlanId(userId, planId).isPresent();
    }
}