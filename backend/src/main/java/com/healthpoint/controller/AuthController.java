package com.healthpoint.controller;

import com.healthpoint.dto.LoginRequest;
import com.healthpoint.dto.RegisterRequest;
import com.healthpoint.entity.User;
import com.healthpoint.service.AuthService;
import com.healthpoint.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @NonNull RegisterRequest request) {
        try {
            User user = authService.register(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getPhoneNumber()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", user.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @NonNull LoginRequest request) {
        try {
            User user = authService.loginUser(request.getEmail(), request.getPassword());
            String token = jwtUtil.generateToken(user.getId(), user.getEmail());

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole() != null ? user.getRole() : "MEMBER");
            userMap.put("phoneNumber", user.getPhoneNumber());

            return ResponseEntity.ok(Map.of(
                "token", token,
                "user", userMap
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "No authorization token provided"));
            }
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            User user = authService.getUserById(userId);

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole() != null ? user.getRole() : "MEMBER");
            userMap.put("phoneNumber", user.getPhoneNumber());

            return ResponseEntity.ok(userMap);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
    }
}