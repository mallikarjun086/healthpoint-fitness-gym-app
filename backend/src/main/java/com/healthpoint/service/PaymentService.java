package com.healthpoint.service;

import com.healthpoint.entity.Payment;
import com.healthpoint.entity.User;
import com.healthpoint.repository.PaymentRepository;
import com.healthpoint.repository.SubscriptionRepository;
import com.healthpoint.repository.AddOnSubscriptionRepository;
import com.healthpoint.repository.UserRepository;
import com.razorpay.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AddOnSubscriptionRepository addOnRepository;
    private final UserRepository userRepository;
    private final com.healthpoint.repository.MembershipPlanRepository planRepository;
    private final RazorpayService razorpayService;

    public PaymentService(PaymentRepository paymentRepository,
                          SubscriptionRepository subscriptionRepository,
                          AddOnSubscriptionRepository addOnRepository,
                          UserRepository userRepository,
                          com.healthpoint.repository.MembershipPlanRepository planRepository,
                          RazorpayService razorpayService) {
        this.paymentRepository = paymentRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.addOnRepository = addOnRepository;
        this.userRepository = userRepository;
        this.planRepository = planRepository;
        this.razorpayService = razorpayService;
    }

    public Payment createPaymentOrder(@NonNull Long userId, @NonNull BigDecimal amount,
                                      @NonNull String currency, String paymentFor, Long referenceId) throws Exception {
        String receipt = paymentFor + "_" + referenceId + "_" + System.currentTimeMillis();

        Order order = razorpayService.createOrder(amount, currency, receipt);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Payment payment = new Payment();
        payment.setUser(user);
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

        if (!isValid) {
            payment.setRazorpayPaymentId(razorpayPaymentId);
            payment.setRazorpaySignature(razorpaySignature);
            payment.setStatus("FAILED");
            paymentRepository.save(payment);
            throw new SecurityException("Invalid Razorpay payment signature verification failed");
        }

        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        payment.setStatus("PAID");
        paymentRepository.save(payment);

        if (referenceId != null) {
            if ("MEMBERSHIP".equalsIgnoreCase(paymentFor)) {
                if (planRepository.existsById(referenceId)) {
                    // Deactivate existing active subscriptions for this user
                    subscriptionRepository.findByUserIdAndIsActiveTrue(payment.getUser().getId())
                            .ifPresent(sub -> {
                                sub.setIsActive(false);
                                subscriptionRepository.save(sub);
                            });

                    com.healthpoint.entity.MembershipPlan plan = planRepository.findById(referenceId).orElse(null);
                    if (plan != null) {
                        com.healthpoint.entity.Subscription subscription = new com.healthpoint.entity.Subscription();
                        subscription.setUser(payment.getUser());
                        subscription.setPlan(plan);
                        subscription.setStartDate(LocalDateTime.now());
                        int days = plan.getDurationDays() != null ? plan.getDurationDays() : 30;
                        subscription.setEndDate(LocalDateTime.now().plusDays(days));
                        subscription.setIsActive(true);
                        subscriptionRepository.save(subscription);
                    }
                } else {
                    subscriptionRepository.findById(referenceId).ifPresent(sub -> {
                        sub.setIsActive(true);
                        sub.setStartDate(LocalDateTime.now());
                        int days = (sub.getPlan() != null && sub.getPlan().getDurationDays() != null) ? sub.getPlan().getDurationDays() : 30;
                        sub.setEndDate(LocalDateTime.now().plusDays(days));
                        subscriptionRepository.save(sub);
                    });
                }
            } else if ("ADDON".equalsIgnoreCase(paymentFor)) {
                addOnRepository.findById(referenceId).ifPresent(addon -> {
                    addon.setIsActive(true);
                    addon.setStartDate(LocalDateTime.now());
                    addon.setEndDate(LocalDateTime.now().plusDays(30));
                    addOnRepository.save(addon);
                });
            }
        }

        return payment;
    }

    public List<Payment> getUserPayments(@NonNull Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}