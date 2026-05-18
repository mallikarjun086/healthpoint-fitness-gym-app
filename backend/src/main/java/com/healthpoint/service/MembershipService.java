package com.healthpoint.service;

import com.healthpoint.entity.MembershipPlan;
import com.healthpoint.entity.Subscription;
import com.healthpoint.entity.User;
import com.healthpoint.repository.MembershipPlanRepository;
import com.healthpoint.repository.SubscriptionRepository;
import com.healthpoint.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MembershipService {

    private final MembershipPlanRepository planRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public MembershipService(MembershipPlanRepository planRepository,
                             SubscriptionRepository subscriptionRepository,
                             UserRepository userRepository) {
        this.planRepository = planRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    public List<MembershipPlan> getActivePlans() {
        return planRepository.findByIsActiveTrue();
    }

    public Subscription purchaseMembership(Long userId, Long planId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId must not be null");
        }
        if (planId == null) {
            throw new IllegalArgumentException("planId must not be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MembershipPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        // Deactivate any existing subscription
        subscriptionRepository.findByUserIdAndIsActiveTrue(userId)
                .ifPresent(sub -> {
                    sub.setIsActive(false);
                    subscriptionRepository.save(sub);
                });

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setEndDate(LocalDateTime.now().plusDays(plan.getDurationDays()));
        subscription.setIsActive(true);

        return subscriptionRepository.save(subscription);
    }

    public boolean hasActiveMembership(Long userId) {
        return subscriptionRepository.findActiveByUserId(userId).isPresent();
    }
}