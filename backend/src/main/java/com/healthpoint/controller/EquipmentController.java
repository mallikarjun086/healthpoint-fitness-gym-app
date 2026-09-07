package com.healthpoint.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private static final List<Map<String, Object>> equipmentList = new ArrayList<>();

    static {
        equipmentList.add(createEquip(1L, "Olympic Squat Rack #1", "Free Weights Zone", "OPERATIONAL", "100%", "Cleaned 2h ago"));
        equipmentList.add(createEquip(2L, "Dual Cable Crossover #2", "Functional Zone", "NEEDS_MAINTENANCE", "85%", "Cable tension check due"));
        equipmentList.add(createEquip(3L, "Matrix Treadmill Pro #4", "Cardio Deck", "OPERATIONAL", "98%", "In use (Occupied)"));
        equipmentList.add(createEquip(4L, "Leg Press 45-Degree", "Leg Machines Zone", "OPERATIONAL", "95%", "Cleaned 1h ago"));
        equipmentList.add(createEquip(5L, "Smith Machine #1", "Strength Zone", "OUT_OF_SERVICE", "0%", "Replacing safety bar pin"));
    }

    private static Map<String, Object> createEquip(Long id, String name, String zone, String status, String health, String notes) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", id);
        item.put("name", name);
        item.put("zone", zone);
        item.put("status", status); // OPERATIONAL, NEEDS_MAINTENANCE, OUT_OF_SERVICE
        item.put("healthScore", health);
        item.put("notes", notes);
        return item;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllEquipment() {
        return ResponseEntity.ok(equipmentList);
    }

    @PostMapping("/toggle-status/{id}")
    public ResponseEntity<Map<String, Object>> toggleStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.getOrDefault("status", "OPERATIONAL");
        for (Map<String, Object> eq : equipmentList) {
            if (eq.get("id").toString().equals(id.toString())) {
                eq.put("status", newStatus);
                eq.put("notes", "Updated by Admin at " + java.time.LocalTime.now().toString().substring(0, 5));
                return ResponseEntity.ok(eq);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
