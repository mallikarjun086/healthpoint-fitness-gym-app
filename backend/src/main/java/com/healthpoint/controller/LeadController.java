package com.healthpoint.controller;

import com.healthpoint.entity.Lead;
import com.healthpoint.service.LeadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Lead>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @PostMapping("/create")
    public ResponseEntity<Lead> createLead(@RequestBody @org.springframework.lang.NonNull Lead lead) {
        return ResponseEntity.ok(leadService.saveLead(lead));
    }

    @PostMapping("/update-status/{id}")
    public ResponseEntity<Lead> updateStatus(@PathVariable @org.springframework.lang.NonNull Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(leadService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable @org.springframework.lang.NonNull Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.ok().build();
    }
}
