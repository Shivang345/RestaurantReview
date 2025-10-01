package com.shivangjaswal.RestaurantReview.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRestaurantDTO {
    private String name;
    private String description;
    private String cuisineType;
    private String address;
    private String city;
    private String phoneNumber;

    private List<String> photoUrls;
}