package com.shivangjaswal.RestaurantReview.Controllers;

import com.shivangjaswal.RestaurantReview.Dto.CreateReviewDTO;
import com.shivangjaswal.RestaurantReview.Dto.ReviewDTO;
import com.shivangjaswal.RestaurantReview.Dto.UpdateReviewDTO;
import com.shivangjaswal.RestaurantReview.Service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/reviews")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Create a new review
    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @PathVariable String restaurantId,
            @Valid @RequestBody CreateReviewDTO createReviewDTO) {
        try {
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

    // Update a review
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable String restaurantId,
            @PathVariable String reviewId,
            @Valid @RequestBody UpdateReviewDTO updateReviewDTO,
            @RequestParam String userEmail) {
        try {
            ReviewDTO updatedReview = reviewService.updateReview(restaurantId, reviewId, updateReviewDTO, userEmail);
            return ResponseEntity.ok(updatedReview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Delete a review
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String restaurantId,
            @PathVariable String reviewId,
            @RequestParam String userEmail) {
        try {
            reviewService.deleteReview(restaurantId, reviewId, userEmail);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}

