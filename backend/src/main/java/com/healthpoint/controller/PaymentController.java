package com.healthpoint.controller;

import com.healthpoint.dto.PaymentRequest;
import com.healthpoint.dto.VerifyPaymentRequest;
import com.healthpoint.entity.Payment;
import com.healthpoint.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final com.healthpoint.service.RazorpayService razorpayService;

    public PaymentController(PaymentService paymentService, com.healthpoint.service.RazorpayService razorpayService) {
        this.paymentService = paymentService;
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest request, Authentication auth) {
        try {
            Long resolvedUserId = com.healthpoint.util.SecurityUtil.resolveUserId(auth, request.getUserId());
            if (resolvedUserId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User ID is required to create a payment order"));
            }
            if (request.getAmount() == null || request.getCurrency() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount and currency are required"));
            }

            Payment payment = paymentService.createPaymentOrder(
                resolvedUserId,
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
    public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        try {
            if (request.getRazorpayOrderId() == null || request.getRazorpayPaymentId() == null || request.getRazorpaySignature() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Razorpay orderId, paymentId, and signature are required"));
            }

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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getUserPayments(@PathVariable Long userId, Authentication auth) {
        Long authenticatedId = com.healthpoint.util.SecurityUtil.resolveUserId(auth, userId);
        if (authenticatedId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(paymentService.getUserPayments(authenticatedId));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody String payload,
                                           @RequestHeader("X-Razorpay-Signature") String signature) {
        try {
            boolean isValid = verifyWebhookSignature(payload, signature);
            if (!isValid) {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid signature"));
            }
            return ResponseEntity.ok(Map.of("status", "success"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    private boolean verifyWebhookSignature(String payload, String signature) {
        if (signature == null || signature.isBlank()) {
            return false;
        }
        return razorpayService.verifyWebhookSignature(payload, signature);
    }
}