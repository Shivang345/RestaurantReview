import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { restaurantAPI } from "../services/api";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRAting";
import ReviewList from "./ReviewList";
import PhotoGallery from "./PhotoGallery"; // ADD THIS IMPORT
import { MapPin, Edit, ArrowLeft, MessageSquare, Loader2, Camera, Image } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchRestaurant(); // eslint-disable-next-line
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await restaurantAPI.getRestaurantById(id);
      
      
      
      setRestaurant(response.data);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      setError("Restaurant not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    fetchRestaurant();
    setShowReviewForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Restaurant Not Found</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/restaurants"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Restaurants</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Photos */}
      <div className="relative">
        {/* Restaurant Photos - UPDATED SECTION */}
        {restaurant.photoUrls && restaurant.photoUrls.length > 0 ? (
          <div className="relative h-96 lg:h-[500px] overflow-hidden">
            <img
              src={`http://localhost:8080${restaurant.photoUrls[0]}`}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {/* Photo count badge */}
            {restaurant.photoUrls.length > 1 && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
                <Camera size={16} />
                <span className="font-medium">{restaurant.photoUrls.length} Photos</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-96 lg:h-[500px] flex items-center justify-center">
            <div className="text-center text-white">
              <Image size={48} className="mx-auto mb-4 opacity-60" />
              <p className="text-lg opacity-80">No photos available</p>
            </div>
          </div>
        )}

        {/* Restaurant Info Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full bg-gradient-to-t from-black via-black/50 to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-white">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">{restaurant.name}</h1>
                
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {restaurant.cuisineType}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <StarRating rating={restaurant.averageRating} size="2rem" />
                    <span className="text-2xl font-bold">{restaurant.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-200">
                    ({restaurant.totalReviews} reviews)
                  </span>
                </div>

                {restaurant.description && (
                  <p className="text-xl text-gray-200 mb-6 max-w-2xl leading-relaxed">
                    {restaurant.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Restaurant Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Photos Gallery */}
            <div>
              {restaurant.photoUrls && restaurant.photoUrls.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Camera className="mr-3" size={24} />
                    Restaurant Gallery
                  </h2>
                  {/* ADD PHOTOGALLERY COMPONENT */}
                  <PhotoGallery
                    photos={restaurant.photoUrls}
                    altText={restaurant.name}
                    className="mb-6"
                    maxPreview={4}
                    showCount={true}
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <Image size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No photos available for this restaurant</p>
                </div>
              )}
            </div>

            {/* Right Column - Restaurant Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                  <MapPin className="mr-2" size={20} />
                  Location & Contact
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{restaurant.address}</p>
                    <p className="text-gray-600">{restaurant.city}</p>
                  </div>
                  
                  {restaurant.phoneNumber && (
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">{restaurant.phoneNumber}</p>
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-gray-900">Cuisine Type</p>
                    <p className="text-gray-600">{restaurant.cuisineType}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/restaurants/edit/${restaurant.id}`}
                  className="btn-primary flex items-center justify-center space-x-2 py-3"
                >
                  <Edit size={18} />
                  <span>Edit Restaurant</span>
                </Link>
                <Link
                  to="/restaurants"
                  className="btn-outline flex items-center justify-center space-x-2 py-3"
                >
                  <ArrowLeft size={18} />
                  <span>Back to List</span>
                </Link>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <MessageSquare size={18} />
                <span>{showReviewForm ? 'Cancel Review' : 'Write Review'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="mr-3" size={24} />
                Write Your Review
              </h2>
              <ReviewForm
                restaurantId={id}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Customer Reviews ({restaurant.totalReviews})
          </h2>
          <ReviewList restaurantId={id} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
