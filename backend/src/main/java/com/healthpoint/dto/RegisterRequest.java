package com.healthpoint.dto;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class RegisterRequest {
    @NonNull private String name;
    @NonNull private String email;
    @NonNull private String password;
    private String phoneNumber;
}
