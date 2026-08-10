package com.healthpoint.controller;

import com.healthpoint.dto.LoginRequest;
import com.healthpoint.dto.RegisterRequest;
import com.healthpoint.entity.User;
import com.healthpoint.service.AuthService;
import com.healthpoint.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

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
            if (request.getName() == null || request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Name, email, and password are required"));
            }
            String name = Objects.requireNonNull(request.getName());
            String email = Objects.requireNonNull(request.getEmail());
            String password = Objects.requireNonNull(request.getPassword());

            User registered = authService.register(name, email, password, request.getPhoneNumber());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", registered.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @NonNull LoginRequest request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
            }
            String email = Objects.requireNonNull(request.getEmail());
            String password = Objects.requireNonNull(request.getPassword());

            User loggedIn = authService.loginUser(email, password);
            String userRole = loggedIn.getRole() != null ? loggedIn.getRole() : "MEMBER";
            String token = jwtUtil.generateToken(loggedIn.getId(), loggedIn.getEmail(), userRole);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", loggedIn.getId());
            userData.put("name", loggedIn.getName());
            userData.put("email", loggedIn.getEmail());
            userData.put("role", userRole);
            userData.put("phoneNumber", loggedIn.getPhoneNumber());

            Map<String, Object> loginResponse = new HashMap<>();
            loginResponse.put("token", token);
            loginResponse.put("user", userData);

            return ResponseEntity.ok(loginResponse);
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
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
            }
            User currentUser = authService.getUserById(userId);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", currentUser.getId());
            userData.put("name", currentUser.getName());
            userData.put("email", currentUser.getEmail());
            userData.put("role", currentUser.getRole() != null ? currentUser.getRole() : "MEMBER");
            userData.put("phoneNumber", currentUser.getPhoneNumber());

            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
    }
}