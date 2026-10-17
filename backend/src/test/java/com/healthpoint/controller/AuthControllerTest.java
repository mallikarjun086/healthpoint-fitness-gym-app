package com.healthpoint.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthpoint.dto.LoginRequest;
import com.healthpoint.dto.RegisterRequest;
import com.healthpoint.entity.User;
import com.healthpoint.service.AuthService;
import com.healthpoint.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtil jwtUtil;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("Test Athlete");
        sampleUser.setEmail("athlete@healthpoint.com");
        sampleUser.setPassword("hashedpassword123");
        sampleUser.setRole("MEMBER");
    }

    @Test
    void register_ShouldReturnSuccess() throws Exception {
        RegisterRequest req = new RegisterRequest("Test Athlete", "athlete@healthpoint.com", "password123", "+123456789");
        when(authService.register(anyString(), anyString(), anyString(), anyString())).thenReturn(sampleUser);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    void login_ShouldReturnJwtTokenAndUserData() throws Exception {
        LoginRequest req = new LoginRequest("athlete@healthpoint.com", "password123");
        when(authService.loginUser("athlete@healthpoint.com", "password123")).thenReturn(sampleUser);
        when(jwtUtil.generateToken(1L, "athlete@healthpoint.com", "MEMBER")).thenReturn("mocked.jwt.token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked.jwt.token"))
                .andExpect(jsonPath("$.user.name").value("Test Athlete"))
                .andExpect(jsonPath("$.user.password").doesNotExist()); // Verify password is NOT exposed!
    }

    @Test
    void me_WithValidToken_ShouldReturnUserProfile() throws Exception {
        when(jwtUtil.extractUserId("mocked.jwt.token")).thenReturn(1L);
        when(authService.getUserById(1L)).thenReturn(sampleUser);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer mocked.jwt.token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("athlete@healthpoint.com"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }
}
