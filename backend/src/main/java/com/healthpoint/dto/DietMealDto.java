package com.healthpoint.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DietMealDto {
    private String meal;
    private String time;
    private String items;
    private String notes;

    public DietMealDto(String meal, String time, String items, String notes) {
        this.meal = meal;
        this.time = time;
        this.items = items;
        this.notes = notes;
    }
}
