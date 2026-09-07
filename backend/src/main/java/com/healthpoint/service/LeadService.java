package com.healthpoint.service;

import com.healthpoint.entity.Lead;
import com.healthpoint.repository.LeadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

    private final LeadRepository leadRepository;

    public LeadService(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    public List<Lead> getAllLeads() {
        return leadRepository.findAllByOrderByCreatedAtDesc();
    }

    public Lead saveLead(@org.springframework.lang.NonNull Lead lead) {
        return leadRepository.save(lead);
    }

    public Lead updateStatus(@org.springframework.lang.NonNull Long id, String status) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        lead.setStatus(status);
        return leadRepository.save(lead);
    }

    public void deleteLead(@org.springframework.lang.NonNull Long id) {
        leadRepository.deleteById(id);
    }
}
