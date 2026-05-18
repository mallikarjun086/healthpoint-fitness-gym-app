package com.healthpoint.ai.security;

import com.healthpoint.ai.exception.UnauthorizedAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AiSecurityUtil {
    
    public Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedAccessException("User is not authenticated");
        }
        
        try {
            return (Long) authentication.getPrincipal();
        } catch (ClassCastException e) {
            throw new UnauthorizedAccessException("Invalid authentication principal format");
        }
    }
    
    public void validateOwnership(Long resourceUserId) {
        Long currentUserId = getAuthenticatedUserId();
        if (!currentUserId.equals(resourceUserId)) {
            throw new UnauthorizedAccessException("You do not have permission to access this resource");
        }
    }
}
