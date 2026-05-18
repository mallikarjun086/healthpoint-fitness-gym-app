package com.healthpoint.dto;

import lombok.Data;
import org.springframework.lang.NonNull;

import java.math.BigDecimal;

@Data
public class PaymentRequest {
    @NonNull private Long userId;
    @NonNull private BigDecimal amount;
    @NonNull private String currency;
    private String paymentFor; // MEMBERSHIP or ADDON
    private Long referenceId; // planId
}