package com.shivangjaswal.RestaurantReview.Service;


import com.shivangjaswal.RestaurantReview.Dto.CreateRestaurantDTO;
import com.shivangjaswal.RestaurantReview.Dto.RestaurantDTO;
import com.shivangjaswal.RestaurantReview.Dto.UpdateRestaurantDTO;
import com.shivangjaswal.RestaurantReview.Entity.Restaurant;
import com.shivangjaswal.RestaurantReview.Respository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    // CREATE
    public RestaurantDTO createRestaurant(CreateRestaurantDTO createDTO) {
        Restaurant restaurant = Restaurant.builder()
                .name(createDTO.getName())
                .description(createDTO.getDescription())
                .cuisineType(createDTO.getCuisineType())
                .address(createDTO.getAddress())
                .city(createDTO.getCity())
                .phoneNumber(createDTO.getPhoneNumber())
                .averageRating(0.0)
                .totalReviews(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return convertToDTO(savedRestaurant);
    }

    // READ - Get all restaurants
    public List<RestaurantDTO> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        return restaurants.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ - Get restaurant by ID
    public RestaurantDTO getRestaurantById(String id) {
        Optional<Restaurant> restaurant = restaurantRepository.findById(id);
        if (restaurant.isPresent()) {
            return convertToDTO(restaurant.get());
        } else {
            throw new RuntimeException("Restaurant not found with id: " + id);
        }
    }

    // READ - Search restaurants
    public List<RestaurantDTO> searchRestaurants(String searchTerm) {
        List<Restaurant> restaurants;
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            restaurants = restaurantRepository.findAll();
        } else {
            restaurants = restaurantRepository.searchRestaurants(searchTerm);
        }
        return restaurants.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ - Filter by cuisine
    public List<RestaurantDTO> getRestaurantsByCuisine(String cuisineType) {
        List<Restaurant> restaurants = restaurantRepository.findByCuisineTypeIgnoreCase(cuisineType);
        return restaurants.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // UPDATE
    public RestaurantDTO updateRestaurant(String id, UpdateRestaurantDTO updateDTO) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(id);
        if (optionalRestaurant.isPresent()) {
            Restaurant restaurant = optionalRestaurant.get();

            // Update fields only if they are provided
            if (updateDTO.getName() != null) {
                restaurant.setName(updateDTO.getName());
            }
            if (updateDTO.getDescription() != null) {
                restaurant.setDescription(updateDTO.getDescription());
            }
            if (updateDTO.getCuisineType() != null) {
                restaurant.setCuisineType(updateDTO.getCuisineType());
            }
            if (updateDTO.getAddress() != null) {
                restaurant.setAddress(updateDTO.getAddress());
            }
            if (updateDTO.getCity() != null) {
                restaurant.setCity(updateDTO.getCity());
            }
            if (updateDTO.getPhoneNumber() != null) {
                restaurant.setPhoneNumber(updateDTO.getPhoneNumber());
            }

            restaurant.setUpdatedAt(LocalDateTime.now());
            Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
            return convertToDTO(updatedRestaurant);
        } else {
            throw new RuntimeException("Restaurant not found with id: " + id);
        }
    }

    // DELETE
    public void deleteRestaurant(String id) {
        if (restaurantRepository.existsById(id)) {
            restaurantRepository.deleteById(id);
        } else {
            throw new RuntimeException("Restaurant not found with id: " + id);
        }
    }

    // Helper method to convert entity to DTO
    private RestaurantDTO convertToDTO(Restaurant restaurant) {
        return RestaurantDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .cuisineType(restaurant.getCuisineType())
                .address(restaurant.getAddress())
                .city(restaurant.getCity())
                .phoneNumber(restaurant.getPhoneNumber())
                .averageRating(restaurant.getAverageRating())
                .totalReviews(restaurant.getTotalReviews())
                .createdAt(restaurant.getCreatedAt())
                .updatedAt(restaurant.getUpdatedAt())
                .build();
    }
}
