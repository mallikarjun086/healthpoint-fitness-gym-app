package com.healthpoint.controller;

import com.healthpoint.dto.PaymentRequest;
import com.healthpoint.dto.VerifyPaymentRequest;
import com.healthpoint.entity.Payment;
import com.healthpoint.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody @NonNull PaymentRequest request) {
        try {
            Payment payment = paymentService.createPaymentOrder(
                request.getUserId(),
                request.getAmount(),
                request.getCurrency(),
                request.getPaymentFor(),
                request.getReferenceId()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", payment.getRazorpayOrderId());
            response.put("amount", payment.getAmount());
            response.put("currency", payment.getCurrency());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody @NonNull VerifyPaymentRequest request) {
        try {
            Payment payment = paymentService.verifyAndUpdatePayment(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature(),
                    request.getPaymentFor(),
                    request.getReferenceId()
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment verified successfully",
                    "payment", payment
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody String payload,
                                           @RequestHeader("X-Razorpay-Signature") String signature) {
        try {
            // Verify webhook signature
            boolean isValid = verifyWebhookSignature(payload, signature);

            if (!isValid) {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid signature"));
            }

            // Process webhook
            // Parse payload and update payment status

            return ResponseEntity.ok(Map.of("status", "success"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    private boolean verifyWebhookSignature(String payload, String signature) {
        // Implement Razorpay webhook signature verification
        return true;
    }
}