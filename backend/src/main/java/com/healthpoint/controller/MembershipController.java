package com.healthpoint.controller;

import com.healthpoint.entity.MembershipPlan;
import com.healthpoint.service.MembershipService;  // ✅ FIXED: Import from service package, not controller
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    private final MembershipService membershipService;  // ✅ Uses correct import above

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<MembershipPlan>> getPlans() {
        return ResponseEntity.ok(membershipService.getActivePlans());
    }

    @GetMapping("/check/{userId}")
    public ResponseEntity<?> checkMembership(@PathVariable Long userId) {
        boolean hasMembership = membershipService.hasActiveMembership(userId);
        return ResponseEntity.ok(Map.of("hasMembership", hasMembership));
    }
}