package com.healthpoint.dto;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class VerifyPaymentRequest {
    @NonNull private String razorpayOrderId;
    @NonNull private String razorpayPaymentId;
    @NonNull private String razorpaySignature;
    private Long userId;
    private String paymentFor;
    private Long referenceId;
}
