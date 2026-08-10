package com.healthpoint.controller;

import com.healthpoint.entity.User;
import com.healthpoint.repository.PaymentRepository;
import com.healthpoint.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    public AdminController(UserRepository userRepository, PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable @NonNull Long id) {
        return userRepository.findById(id).map(user -> {
            boolean currentActive = user.getIsActive() != null ? user.getIsActive() : true;
            user.setIsActive(!currentActive);
            userRepository.save(user);
            Map<String, Object> res = new HashMap<>();
            res.put("id", user.getId());
            res.put("isActive", user.getIsActive());
            res.put("message", "User status updated to " + (user.getIsActive() ? "ACTIVE" : "INACTIVE"));
            return ResponseEntity.ok(res);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalUsers = userRepository.count();
        long totalPayments = paymentRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMembers", totalUsers);
        stats.put("totalPayments", totalPayments);
        stats.put("activeSubscriptions", Math.max(1, totalUsers - 1));
        stats.put("mrr", 340900);
        return ResponseEntity.ok(stats);
    }
}
