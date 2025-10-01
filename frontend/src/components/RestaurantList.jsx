import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { restaurantAPI } from "../services/api";
import StarRating from "./StarRAting";
import { Search, Filter, MapPin, Phone, Eye, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import PhotoGallery from "./PhotoGallery";

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

  // Helper function to get full image URL
  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http')) return photoUrl;
    return `http://localhost:8080${photoUrl}`;
  };

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
        alert("Restaurant deleted successfully!");
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        alert("Failed to delete restaurant. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Restaurants</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect dining experience from our curated collection of restaurants
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="form-input pl-10"
                placeholder="Search restaurants by name, cuisine, or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-6 py-2 flex items-center space-x-2"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
          </form>

          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Filter by cuisine:</label>
            </div>
            <select
              className="form-select max-w-xs"
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

        {/* Error Message */}
        {error && (
          <div className="alert-error mb-8">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{restaurants.length}</span>{" "}
            restaurant{restaurants.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Restaurants Grid */}
        {restaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No restaurants found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any restaurants matching your search. Try adjusting your filters or search terms.
            </p>
            <Link
              to="/add-restaurant"
              className="btn-success inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Restaurant</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="card card-hover restaurant-card bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Restaurant Photo Section */}
                {restaurant.photoUrls && restaurant.photoUrls.length > 0 && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(restaurant.photoUrls[0])}
                      alt={restaurant.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => window.location.href = `/restaurants/${restaurant.id}`}
                    />
                    {restaurant.photoUrls.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs font-medium">
                        +{restaurant.photoUrls.length - 1} photos
                      </div>
                    )}
                    {/* Cuisine type badge on image */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {restaurant.cuisineType}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => window.location.href = `/restaurants/${restaurant.id}`}>
                      {restaurant.name}
                    </h3>
                    {/* Only show cuisine badge if no photo */}
                    {(!restaurant.photoUrls || restaurant.photoUrls.length === 0) && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        {restaurant.cuisineType}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {restaurant.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">{restaurant.address}, {restaurant.city}</span>
                    </div>
                    {restaurant.phoneNumber && (
                      <div className="flex items-center text-gray-600">
                        <Phone size={16} className="mr-2 flex-shrink-0" />
                        <span className="text-sm">{restaurant.phoneNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <StarRating rating={restaurant.averageRating} size="1.25rem" />
                      <span className="font-semibold text-gray-900">
                        {restaurant.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {restaurant.totalReviews} review{restaurant.totalReviews !== 1 && "s"}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/restaurants/${restaurant.id}`}
                      className="btn-primary flex-1 text-center py-2 px-4 text-sm flex items-center justify-center space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </Link>
                    <Link
                      to={`/restaurants/edit/${restaurant.id}`}
                      className="btn-outline flex-1 text-center py-2 px-4 text-sm flex items-center justify-center space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(restaurant.id, restaurant.name);
                      }}
                      className="btn-danger py-2 px-4 text-sm flex items-center justify-center space-x-1"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
