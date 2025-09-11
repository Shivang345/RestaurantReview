import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { restaurantAPI } from "../services/api";
import StarRating from "./StarRAting";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");

  const cuisineTypes = [
    "Italian",
    "Chinese",
    "Indian",
    "Mexican",
    "American"
  ];

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await restaurantAPI.getAllRestaurants();
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError("Failed to load restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchRestaurants();
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await restaurantAPI.searchRestaurants(searchTerm);
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCuisineFilter = async (cuisine) => {
    setSelectedCuisine(cuisine);
    if (!cuisine) {
      fetchRestaurants();
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await restaurantAPI.getRestaurantsByCuisine(cuisine);
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error filtering restaurants:", error);
      setError("Filter failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await restaurantAPI.deleteRestaurant(id);
        setRestaurants(restaurants.filter((r) => r.id !== id));
        // Show a Bootstrap toast or alert here instead of alert()
        alert("Restaurant deleted successfully!");
      } catch (error) {
        console.error("Error deleting restaurants:", error);
        alert("Failed to delete restaurant. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <div className="spinner-border text-warning" role="status" />
        <span className="ms-3 text-muted">Loading restaurants...</span>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* Search and filter section */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="row g-3">
          <div className="col-md-8 d-flex align-items-center">
            <input
              type="search"
              className="form-control me-2"
              placeholder="Search restaurants by name, cuisine, or location"
              aria-label="Search restaurants"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-warning me-2">
              Search
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setSearchTerm("");
                setSelectedCuisine("");
                fetchRestaurants();
              }}
            >
              Clear
            </button>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              aria-label="Filter by cuisine"
              value={selectedCuisine}
              onChange={(e) => handleCuisineFilter(e.target.value)}
            >
              <option value="">All Cuisines</option>
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Result count */}
      <p className="text-muted my-3">
        {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""}{" "}
        found
      </p>

      {/* Restaurants grid */}
      {restaurants.length === 0 ? (
        <div className="text-center my-5">
          <h4>No restaurants found</h4>
          <p className="mb-3">Be the first to add a restaurant!</p>
          <Link to="/restaurants/add" className="btn btn-success">
            Add Restaurant
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="col">
              <div
                className="card h-100 shadow-sm cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() =>
                  (window.location = `/restaurants/${restaurant.id}`)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (window.location = `/restaurants/${restaurant.id}`)
                }
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <div className="mb-2 d-inline-block">
                    <span className="badge bg-secondary">
                      {restaurant.cuisineType}
                    </span>
                  </div>
                  <p className="mb-1 text-muted">
                    📍 {restaurant.address}, {restaurant.city}
                  </p>
                  {restaurant.phoneNumber && (
                    <p className="mb-2 text-muted">
                      📞 {restaurant.phoneNumber}
                    </p>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <StarRating rating={restaurant.averageRating} />
                    <div className="text-end">
                      <p className="mb-0 fw-bold fs-5">
                        {restaurant.averageRating.toFixed(1)}
                      </p>
                      <small className="text-muted">
                        {restaurant.totalReviews} review
                        {restaurant.totalReviews !== 1 && "s"}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex gap-2">
                  <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="btn btn-primary btn-sm flex-fill"
                  >
                    View
                  </Link>
                  <Link
                    to={`/restaurants/edit/${restaurant.id}`}
                    className="btn btn-outline-secondary btn-sm flex-fill"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(restaurant.id, restaurant.name);
                    }}
                    className="btn btn-outline-danger btn-sm flex-fill"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
