package com.healthpoint.ai.security;

import com.healthpoint.ai.exception.UnauthorizedAccessException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class AiSecurityUtilTest {

    private final AiSecurityUtil securityUtil = new AiSecurityUtil();

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldExtractUserIdWhenAuthenticated() {
        Long expectedUserId = 42L;
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(expectedUserId, null, Collections.emptyList())
        );

        Long actualUserId = securityUtil.getAuthenticatedUserId();
        assertEquals(expectedUserId, actualUserId);
    }

    @Test
    void shouldThrowWhenNotAuthenticated() {
        assertThrows(UnauthorizedAccessException.class, () -> securityUtil.getAuthenticatedUserId());
    }

    @Test
    void shouldValidateOwnershipSuccessfully() {
        Long userId = 100L;
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList())
        );

        assertDoesNotThrow(() -> securityUtil.validateOwnership(userId));
    }

    @Test
    void shouldThrowWhenOwnershipFails() {
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(100L, null, Collections.emptyList())
        );

        assertThrows(UnauthorizedAccessException.class, () -> securityUtil.validateOwnership(999L));
    }
}
