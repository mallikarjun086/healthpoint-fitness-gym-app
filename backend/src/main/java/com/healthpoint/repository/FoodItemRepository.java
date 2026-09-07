package com.healthpoint.repository;

import com.healthpoint.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByNameContainingIgnoreCase(String name);
    List<FoodItem> findByCategoryIgnoreCase(String category);
}
