package com.healthpoint.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins:http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174,http://localhost:3000,http://localhost:80,http://localhost}")
    private String allowedOrigins;

    @Override
    @SuppressWarnings("null")
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        List<String> originsList = new ArrayList<>();
        if (allowedOrigins != null) {
            for (String origin : allowedOrigins.split(",")) {
                if (origin != null) {
                    String trimmed = origin.trim();
                    if (!trimmed.isEmpty()) {
                        originsList.add(trimmed);
                    }
                }
            }
        }
        if (originsList.isEmpty()) {
            originsList.add("http://localhost:5173");
        }

        registry.addMapping("/api/**")
                .allowedOrigins(originsList.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}