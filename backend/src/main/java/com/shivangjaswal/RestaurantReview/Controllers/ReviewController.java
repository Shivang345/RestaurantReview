package com.shivangjaswal.RestaurantReview.Controllers;

import com.shivangjaswal.RestaurantReview.Dto.CreateReviewDTO;
import com.shivangjaswal.RestaurantReview.Dto.ReviewDTO;
import com.shivangjaswal.RestaurantReview.Dto.UpdateReviewDTO;
import com.shivangjaswal.RestaurantReview.Entity.User;
import com.shivangjaswal.RestaurantReview.Service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/reviews")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Create a new review (now requires authentication)
    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @PathVariable String restaurantId,
            @Valid @RequestBody CreateReviewDTO createReviewDTO,
            @AuthenticationPrincipal User currentUser) {
        try {
            // Set the user details from the authenticated user
            createReviewDTO.setUsername(currentUser.getFullName());
            createReviewDTO.setUserEmail(currentUser.getEmail());

            ReviewDTO createdReview = reviewService.createReview(restaurantId, createReviewDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Get all reviews for a restaurant
    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getReviewsByRestaurant(@PathVariable String restaurantId) {
        try {
            List<ReviewDTO> reviews = reviewService.getReviewsByRestaurant(restaurantId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Get a specific review
    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> getReview(
            @PathVariable String restaurantId,
            @PathVariable String reviewId) {
        try {
            ReviewDTO review = reviewService.getReview(restaurantId, reviewId);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Update a review (requires authentication)
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable String restaurantId,
            @PathVariable String reviewId,
            @Valid @RequestBody UpdateReviewDTO updateReviewDTO,
            @AuthenticationPrincipal User currentUser) {
        try {
            ReviewDTO updatedReview = reviewService.updateReview(
                    restaurantId, reviewId, updateReviewDTO, currentUser.getEmail());
            return ResponseEntity.ok(updatedReview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Delete a review (requires authentication)
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String restaurantId,
            @PathVariable String reviewId,
            @AuthenticationPrincipal User currentUser) {
        try {
            reviewService.deleteReview(restaurantId, reviewId, currentUser.getEmail());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}

