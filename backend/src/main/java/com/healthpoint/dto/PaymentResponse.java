package com.healthpoint.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentResponse {
    private String orderId;
    private String keyId;
    private BigDecimal amount;
    private String currency;
}