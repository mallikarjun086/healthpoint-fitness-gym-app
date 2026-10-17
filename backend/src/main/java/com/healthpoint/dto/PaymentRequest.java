package com.healthpoint.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class PaymentRequest {
    private Long userId;
    private BigDecimal amount;
    private String currency;
    private String paymentFor; // MEMBERSHIP or ADDON
    private Long referenceId; // planId
}