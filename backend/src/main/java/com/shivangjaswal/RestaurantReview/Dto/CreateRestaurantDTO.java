package com.shivangjaswal.RestaurantReview.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRestaurantDTO {
    @NotBlank(message = "Restaurant name is required")
    private String name;

    private String description;

    @NotBlank(message = "Cuisine type is required")
    private String cuisineType;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private String phoneNumber;
}
