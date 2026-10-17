package com.healthpoint.ai.security;

import com.healthpoint.ai.exception.UnauthorizedAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AiSecurityUtil {
    
    public Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = com.healthpoint.util.SecurityUtil.extractUserId(authentication);
        if (userId == null) {
            throw new UnauthorizedAccessException("User is not authenticated or invalid principal format");
        }
        return userId;
    }
    
    public void validateOwnership(Long resourceUserId) {
        Long currentUserId = getAuthenticatedUserId();
        if (!currentUserId.equals(resourceUserId)) {
            throw new UnauthorizedAccessException("You do not have permission to access this resource");
        }
    }
}
