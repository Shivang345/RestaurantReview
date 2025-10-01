package com.shivangjaswal.RestaurantReview.Controllers;


import com.shivangjaswal.RestaurantReview.Dto.CreateRestaurantDTO;
import com.shivangjaswal.RestaurantReview.Dto.UpdateRestaurantDTO;
import com.shivangjaswal.RestaurantReview.Dto.RestaurantDTO;
import com.shivangjaswal.RestaurantReview.Service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    // CREATE - Add new restaurant
    @PostMapping
    public ResponseEntity<RestaurantDTO> createRestaurant(@Valid @RequestBody CreateRestaurantDTO createDTO) {
        try {
            RestaurantDTO createdRestaurant = restaurantService.createRestaurant(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // READ - Get all restaurants
    @GetMapping
    public ResponseEntity<List<RestaurantDTO>> getAllRestaurants() {
        List<RestaurantDTO> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    // READ - Get restaurant by ID
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDTO> getRestaurantById(@PathVariable String id) {
        try {
            RestaurantDTO restaurant = restaurantService.getRestaurantById(id);
            return ResponseEntity.ok(restaurant);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // READ - Search restaurants
    @GetMapping("/search")
    public ResponseEntity<List<RestaurantDTO>> searchRestaurants(@RequestParam(required = false) String q) {
        List<RestaurantDTO> restaurants = restaurantService.searchRestaurants(q);
        return ResponseEntity.ok(restaurants);
    }

    // READ - Filter by cuisine
    @GetMapping("/cuisine/{cuisineType}")
    public ResponseEntity<List<RestaurantDTO>> getRestaurantsByCuisine(@PathVariable String cuisineType) {
        List<RestaurantDTO> restaurants = restaurantService.getRestaurantsByCuisine(cuisineType);
        return ResponseEntity.ok(restaurants);
    }

    // UPDATE - Update restaurant
    @PutMapping("/{id}")
    public ResponseEntity<RestaurantDTO> updateRestaurant(
            @PathVariable String id,
            @RequestBody UpdateRestaurantDTO updateDTO) {
        try {
            RestaurantDTO updatedRestaurant = restaurantService.updateRestaurant(id, updateDTO);
            return ResponseEntity.ok(updatedRestaurant);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{id}/photos")
    public ResponseEntity<Map<String, Object>> updateRestaurantPhotos(
            @PathVariable String id,
            @RequestBody Map<String, List<String>> request) {

        System.out.println("Updating photos for restaurant: " + id);
        System.out.println("Photo URLs: " + request.get("photoUrls"));

        try {
            List<String> photoUrls = request.get("photoUrls");
            RestaurantDTO updatedRestaurant = restaurantService.updateRestaurantPhotos(id, photoUrls);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("photoUrls", updatedRestaurant.getPhotoUrls());
            response.put("message", "Photos updated successfully");

            System.out.println("Successfully updated restaurant photos");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Error updating restaurant photos: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to update photos");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // DELETE - Remove a specific photo from restaurant
    @DeleteMapping("/{id}/photos")
    public ResponseEntity<Map<String, Object>> removeRestaurantPhoto(
            @PathVariable String id,
            @RequestParam String photoUrl) {

        System.out.println("Removing photo from restaurant: " + id);
        System.out.println("Photo URL to remove: " + photoUrl);

        try {
            RestaurantDTO updatedRestaurant = restaurantService.removeRestaurantPhoto(id, photoUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("photoUrls", updatedRestaurant.getPhotoUrls());
            response.put("message", "Photo removed successfully");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to remove photo");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // DELETE - Delete restaurant
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable String id) {
        try {
            restaurantService.deleteRestaurant(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
