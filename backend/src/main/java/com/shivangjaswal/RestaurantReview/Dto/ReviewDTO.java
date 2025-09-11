package com.shivangjaswal.RestaurantReview.Dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private String id;
    private String username;
    private String userEmail;
    private String content;
    private Integer rating;
    private List<String> photoUrls;
    private LocalDateTime createdAt;
    private LocalDateTime lastEditedAt;
    private boolean canBeEdited;
}
