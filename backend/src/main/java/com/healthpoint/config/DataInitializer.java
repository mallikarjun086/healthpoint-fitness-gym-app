package com.healthpoint.config;

import com.healthpoint.entity.MembershipPlan;
import com.healthpoint.entity.User;
import com.healthpoint.repository.MembershipPlanRepository;
import com.healthpoint.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           MembershipPlanRepository membershipPlanRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.membershipPlanRepository = membershipPlanRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default users if empty or missing
        seedUser("Member User", "user@hp.com", "password123", "9876543210", "MEMBER");
        seedUser("Trainer Alex", "trainer@hp.com", "password123", "9876543211", "TRAINER");
        seedUser("Admin System", "admin@hp.com", "password123", "9876543212", "ADMIN");

        // Seed default membership plans
        if (membershipPlanRepository.count() == 0) {
            MembershipPlan basic = new MembershipPlan();
            basic.setName("Basic Starter");
            basic.setDescription("Access to gym floor & basic cardio equipment");
            basic.setPrice(new BigDecimal("999"));
            basic.setDurationDays(30);
            membershipPlanRepository.save(basic);

            MembershipPlan pro = new MembershipPlan();
            pro.setName("Pro Fitness");
            pro.setDescription("Full gym access, group classes, & AI coach");
            pro.setPrice(new BigDecimal("1999"));
            pro.setDurationDays(30);
            membershipPlanRepository.save(pro);

            MembershipPlan elite = new MembershipPlan();
            elite.setName("Annual Elite Membership");
            elite.setDescription("All inclusive, personal trainer, AI plan generation & VIP locker");
            elite.setPrice(new BigDecimal("2999"));
            elite.setDurationDays(365);
            membershipPlanRepository.save(elite);
        }
    }

    private void seedUser(String name, String email, String password, String phone, String role) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setPhoneNumber(phone);
            user.setRole(role);
            userRepository.save(user);
        }
    }
}
