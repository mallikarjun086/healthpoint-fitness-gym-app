package com.healthpoint.controller;

import com.healthpoint.entity.AddOnPlan;
import com.healthpoint.service.AddOnService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addons")
public class AddOnController {

    private final AddOnService addOnService;

    public AddOnController(AddOnService addOnService) {
        this.addOnService = addOnService;
    }

    @GetMapping("/plans")
    public ResponseEntity<List<AddOnPlan>> getPlans() {
        return ResponseEntity.ok(addOnService.getActivePlans());
    }

    @GetMapping("/plans/type/{contentType}")
    public ResponseEntity<List<AddOnPlan>> getPlansByType(@PathVariable String contentType) {
        return ResponseEntity.ok(addOnService.getPlansByType(contentType));
    }

    @GetMapping("/check/{userId}/{contentType}")
    public ResponseEntity<?> checkAddOn(@PathVariable @NonNull Long userId, @PathVariable String contentType) {
        boolean hasAddOn = addOnService.hasActiveAddOn(userId, contentType);
        return ResponseEntity.ok(Map.of("hasAddOn", hasAddOn));
    }
}