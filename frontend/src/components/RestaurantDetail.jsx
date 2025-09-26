import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { restaurantAPI } from "../services/api";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRAting";
import ReviewList from "./ReviewList";
import { MapPin, Phone, Edit, ArrowLeft, MessageSquare, Loader2 } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchRestaurant();
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
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
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
                <span className="text-blue-100">
                  ({restaurant.totalReviews} reviews)
                </span>
              </div>

              {restaurant.description && (
                <p className="text-xl text-blue-100 mb-6 max-w-2xl leading-relaxed">
                  {restaurant.description}
                </p>
              )}
            </div>

            <div className="lg:ml-8 mt-8 lg:mt-0">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <MapPin className="mr-2" size={20} />
                    Location
                  </h3>
                  <p className="text-blue-100">{restaurant.address}</p>
                  <p className="text-blue-100">{restaurant.city}</p>
                </div>
                
                {restaurant.phoneNumber && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Phone className="mr-2" size={20} />
                      Contact
                    </h3>
                    <p className="text-blue-100">{restaurant.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link
              to={`/restaurants/edit/${restaurant.id}`}
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Edit size={18} />
              <span>Edit Restaurant</span>
            </Link>
            <Link
              to="/restaurants"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <ArrowLeft size={18} />
              <span>Back to List</span>
            </Link>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <MessageSquare size={18} />
              <span>{showReviewForm ? 'Cancel Review' : 'Write Review'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <ReviewList restaurantId={id} />
      </div>
    </div>
  );
};

export default RestaurantDetail;
