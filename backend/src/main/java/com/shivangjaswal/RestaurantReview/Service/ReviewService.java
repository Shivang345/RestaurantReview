package com.shivangjaswal.RestaurantReview.Service;

import com.shivangjaswal.RestaurantReview.Dto.CreateReviewDTO;
import com.shivangjaswal.RestaurantReview.Dto.ReviewDTO;
import com.shivangjaswal.RestaurantReview.Dto.UpdateReviewDTO;
import com.shivangjaswal.RestaurantReview.Entity.Restaurant;
import com.shivangjaswal.RestaurantReview.Entity.Review;
import com.shivangjaswal.RestaurantReview.Respository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final RestaurantRepository restaurantRepository;

    // Create a new review
    public ReviewDTO createReview(String restaurantId, CreateReviewDTO createReviewDTO) {
        log.info("Creating review for restaurant: {} by user: {}", restaurantId, createReviewDTO.getUserEmail());

        // Find restaurant
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));

        // Check if user already reviewed this restaurant
        boolean alreadyReviewed = restaurant.getReviews().stream()
                .anyMatch(review -> review.getUserEmail().equalsIgnoreCase(createReviewDTO.getUserEmail()));

        if (alreadyReviewed) {
            throw new RuntimeException("User has already reviewed this restaurant");
        }

        // Create new review
        Review review = Review.builder()
                .id(UUID.randomUUID().toString())
                .username(createReviewDTO.getUsername())
                .userEmail(createReviewDTO.getUserEmail().toLowerCase())
                .content(createReviewDTO.getContent())
                .rating(createReviewDTO.getRating())
                .photoUrls(createReviewDTO.getPhotoUrls())
                .createdAt(LocalDateTime.now())
                .lastEditedAt(LocalDateTime.now())
                .build();

        // Add review to restaurant
        restaurant.getReviews().add(review);

        // Update restaurant ratings
        updateRestaurantRating(restaurant);

        // Save restaurant
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        log.info("Review created successfully with id: {}", review.getId());
        return convertToDTO(review);
    }

    // Get all reviews for a restaurant
    public List<ReviewDTO> getReviewsByRestaurant(String restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));

        return restaurant.getReviews().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get a specific review
    public ReviewDTO getReview(String restaurantId, String reviewId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));

        Review review = restaurant.getReviews().stream()
                .filter(r -> r.getId().equals(reviewId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        return convertToDTO(review);
    }

    // Update a review
    public ReviewDTO updateReview(String restaurantId, String reviewId, UpdateReviewDTO updateReviewDTO, String userEmail) {
        log.info("Updating review: {} for restaurant: {} by user: {}", reviewId, restaurantId, userEmail);

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));

        Review review = restaurant.getReviews().stream()
                .filter(r -> r.getId().equals(reviewId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        // Check if user owns this review
        if (!review.getUserEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("User can only update their own reviews");
        }

        // Check if review can still be edited (within 48 hours)
        if (!review.canBeEdited()) {
            throw new RuntimeException("Review can only be edited within 48 hours of creation");
        }

        // Update review fields
        if (updateReviewDTO.getContent() != null) {
            review.setContent(updateReviewDTO.getContent());
        }
        if (updateReviewDTO.getRating() != null) {
            review.setRating(updateReviewDTO.getRating());
        }
        if (updateReviewDTO.getPhotoUrls() != null) {
            review.setPhotoUrls(updateReviewDTO.getPhotoUrls());
        }

        review.setLastEditedAt(LocalDateTime.now());

        // Update restaurant ratings
        updateRestaurantRating(restaurant);

        // Save restaurant
        restaurantRepository.save(restaurant);

        log.info("Review updated successfully: {}", reviewId);
        return convertToDTO(review);
    }

    // Delete a review
    public void deleteReview(String restaurantId, String reviewId, String userEmail) {
        log.info("Deleting review: {} from restaurant: {} by user: {}", reviewId, restaurantId, userEmail);

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));

        Review review = restaurant.getReviews().stream()
                .filter(r -> r.getId().equals(reviewId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        // Check if user owns this review
        if (!review.getUserEmail().equalsIgnoreCase(userEmail)) {
            throw new RuntimeException("User can only delete their own reviews");
        }

        // Remove review from restaurant
        restaurant.getReviews().removeIf(r -> r.getId().equals(reviewId));

        // Update restaurant ratings
        updateRestaurantRating(restaurant);

        // Save restaurant
        restaurantRepository.save(restaurant);

        log.info("Review deleted successfully: {}", reviewId);
    }

    // Get reviews by user email
    public List<ReviewDTO> getReviewsByUser(String userEmail) {
        List<Restaurant> restaurants = restaurantRepository.findAll();

        return restaurants.stream()
                .flatMap(restaurant -> restaurant.getReviews().stream())
                .filter(review -> review.getUserEmail().equalsIgnoreCase(userEmail))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to update restaurant rating
    private void updateRestaurantRating(Restaurant restaurant) {
        List<Review> reviews = restaurant.getReviews();

        if (reviews.isEmpty()) {
            restaurant.setAverageRating(0.0);
            restaurant.setTotalReviews(0);
        } else {
            double averageRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);

            restaurant.setAverageRating(Math.round(averageRating * 100.0) / 100.0); // Round to 2 decimal places
            restaurant.setTotalReviews(reviews.size());
        }

        log.debug("Updated restaurant {} rating to: {} ({} reviews)",
                restaurant.getId(), restaurant.getAverageRating(), restaurant.getTotalReviews());
    }

    // Helper method to convert Review to ReviewDTO
    private ReviewDTO convertToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .username(review.getUsername())
                .userEmail(review.getUserEmail())
                .content(review.getContent())
                .rating(review.getRating())
                .photoUrls(review.getPhotoUrls())
                .createdAt(review.getCreatedAt())
                .lastEditedAt(review.getLastEditedAt())
                .canBeEdited(review.canBeEdited())
                .build();
    }
}
