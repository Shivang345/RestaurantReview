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
import java.util.List;

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
//    @GetMapping("/search")
//    public ResponseEntity<List<RestaurantDTO>> searchRestaurants(@RequestParam(required = false) String q) {
//        List<RestaurantDTO> restaurants = restaurantService.searchRestaurants(q);
//        return ResponseEntity.ok(restaurants);
//    }

    // READ - Filter by cuisine
    @GetMapping("/cuisine/{cuisineType}")
    public ResponseEntity<List<RestaurantDTO>> getRestaurantsByCuisine(@PathVariable String cuisineType) {
        List<RestaurantDTO> restaurants = restaurantService.getRestaurantsByCuisine(cuisineType);
        return ResponseEntity.ok(restaurants);
    }

    // READ - Filter by city
//    @GetMapping("/city/{city}")
//    public ResponseEntity<List<RestaurantDTO>> getRestaurantsByCity(@PathVariable String city) {
//        List<RestaurantDTO> restaurants = restaurantService.getRestaurantsByCity(city);
//        return ResponseEntity.ok(restaurants);
//    }

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
