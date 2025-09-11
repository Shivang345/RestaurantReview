package com.shivangjaswal.RestaurantReview.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {
    @Id
    private String id;

    private String name;
    private String description;
    private String cuisineType;
    private String address;
    private String city;
    private String phoneNumber;

    // Rating fields - calculated from reviews
    private Double averageRating = 0.0;
    private Integer totalReviews = 0;

    // Embedded reviews
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
