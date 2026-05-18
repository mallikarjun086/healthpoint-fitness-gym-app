package com.healthpoint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietMealDto {
    private String meal;
    private String time;
    private String items;
    private String notes;
}
