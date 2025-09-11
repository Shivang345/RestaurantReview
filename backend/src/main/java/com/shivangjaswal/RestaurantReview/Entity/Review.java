package com.shivangjaswal.RestaurantReview.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    @Id
    private String id;

    // User info (simplified - you can enhance with User entity later)
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "User email is required")
    private String userEmail;

    // Review content
    @NotBlank(message = "Review content is required")
    private String content;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    // Photo URLs (for future image upload feature)
    @Builder.Default
    private List<String> photoUrls = new ArrayList<>();

    // Timestamps
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime lastEditedAt;

    // Helper method to check if review can be edited (within 48 hours)
    public boolean canBeEdited() {
        if (createdAt == null) return false;
        return LocalDateTime.now().isBefore(createdAt.plusHours(48));
    }
}
