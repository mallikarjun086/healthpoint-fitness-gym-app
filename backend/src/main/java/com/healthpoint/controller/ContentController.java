package com.healthpoint.controller;

import com.healthpoint.entity.Content;
import com.healthpoint.repository.ContentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final ContentRepository repository;

    public ContentController(ContentRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Content>> getAllContent() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/premium")
    public ResponseEntity<List<Content>> getPremiumContent() {
        return ResponseEntity.ok(repository.findByIsPremium(true));
    }

    @PostMapping("/create")
    public ResponseEntity<Content> createContent(@RequestBody @NonNull Content content) {
        return ResponseEntity.ok(repository.save(content));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteContent(@PathVariable @NonNull Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Content deleted successfully"));
    }
}