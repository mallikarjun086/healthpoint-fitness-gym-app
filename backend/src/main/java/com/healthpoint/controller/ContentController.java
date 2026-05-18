package com.healthpoint.controller;

import com.healthpoint.entity.Content;
import com.healthpoint.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "*")
public class ContentController {

    @Autowired
    private ContentRepository repository;

    @GetMapping("/all")
    public List<Content> getAllContent() {
        return repository.findAll();
    }

    @GetMapping("/premium")
    public List<Content> getPremiumContent() {
        return repository.findByIsPremium(true);
    }
}