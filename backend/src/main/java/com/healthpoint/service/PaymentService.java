package com.healthpoint.service;

import com.healthpoint.entity.Payment;
import com.healthpoint.entity.Subscription;
import com.healthpoint.entity.AddOnSubscription;
import com.healthpoint.repository.PaymentRepository;
import com.healthpoint.repository.SubscriptionRepository;
import com.healthpoint.repository.AddOnSubscriptionRepository;
import com.razorpay.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AddOnSubscriptionRepository addOnRepository;
    private final RazorpayService razorpayService;

    public PaymentService(PaymentRepository paymentRepository,
                          SubscriptionRepository subscriptionRepository,
                          AddOnSubscriptionRepository addOnRepository,
                          RazorpayService razorpayService) {
        this.paymentRepository = paymentRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.addOnRepository = addOnRepository;
        this.razorpayService = razorpayService;
    }

    public Payment createPaymentOrder(@NonNull Long userId, @NonNull BigDecimal amount,
                                      @NonNull String currency, String paymentFor, Long referenceId) throws Exception {
        String receipt = paymentFor + "_" + referenceId + "_" + System.currentTimeMillis();

        Order order = razorpayService.createOrder(amount, currency, receipt);

        Payment payment = new Payment();
        payment.setUser(new com.healthpoint.entity.User() {{ setId(userId); }});
        payment.setAmount(amount);
        payment.setCurrency(currency);
        payment.setRazorpayOrderId(order.get("id"));
        payment.setStatus("CREATED");
        payment.setPaymentFor(paymentFor);
        payment.setReferenceId(referenceId);

        return paymentRepository.save(payment);
    }

    public Payment verifyAndUpdatePayment(@NonNull String razorpayOrderId, @NonNull String razorpayPaymentId,
                                          @NonNull String razorpaySignature, String paymentFor, Long referenceId) throws Exception {
        boolean isValid = razorpayService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order id: " + razorpayOrderId));

        if (isValid) {
            payment.setRazorpayPaymentId(razorpayPaymentId);
            payment.setRazorpaySignature(razorpaySignature);
            payment.setStatus("PAID");
            paymentRepository.save(payment);

            if (referenceId == null) {
                throw new IllegalArgumentException("referenceId must not be null");
            }

            // Activate subscription based on payment type
            if ("MEMBERSHIP".equals(paymentFor)) {
                Subscription sub = subscriptionRepository.findById(referenceId).orElseThrow();
                sub.setStartDate(LocalDateTime.now());
                sub.setEndDate(LocalDateTime.now().plusDays(sub.getPlan().getDurationDays()));
                subscriptionRepository.save(sub);
            } else if ("ADDON".equals(paymentFor)) {
                AddOnSubscription addon = addOnRepository.findById(referenceId).orElseThrow();
                addon.setStartDate(LocalDateTime.now());
                addon.setEndDate(LocalDateTime.now().plusDays(30));
                addOnRepository.save(addon);
            }
        }

        return payment;
    }
}