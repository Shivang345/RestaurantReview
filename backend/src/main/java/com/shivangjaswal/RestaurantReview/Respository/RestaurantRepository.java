package com.shivangjaswal.RestaurantReview.Respository;

import com.shivangjaswal.RestaurantReview.Entity.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {

    // Basic query methods
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    List<Restaurant> findByCuisineTypeIgnoreCase(String cuisineType);
    List<Restaurant> findByCityIgnoreCase(String city);
    List<Restaurant> findByAverageRatingGreaterThanEqual(Double rating);

    // Custom query for search
//    @Query("{ $or: [ " +
//            "{ 'name': { $regex: ?0, $options: 'i' } }, " +
//            "{ 'description': { $regex: ?0, $options: 'i' } }, " +
//            "{ 'cuisineType': { $regex: ?0, $options: 'i' } } " +
//            "] }")
//    List<Restaurant> searchRestaurants(String searchTerm);
}

