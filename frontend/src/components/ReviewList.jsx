import React, { useState, useEffect } from "react";
import { reviewAPI } from "../services/api";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRAting";
import { MessageSquare, SortAsc, Loader2, TrendingUp, Users, Award } from 'lucide-react';

const ReviewList = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await reviewAPI.getReviewsByRestaurant(restaurantId);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== reviewId)
    );
  };

  const sortReviews = (reviews, sortBy) => {
    const sorted = [...reviews];
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  };

  const sortedReviews = sortReviews(reviews, sortBy);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  const sortOptions = [
    { value: "newest", label: "Newest First", icon: SortAsc },
    { value: "oldest", label: "Oldest First", icon: SortAsc },
    { value: "highest", label: "Highest Rating", icon: TrendingUp },
    { value: "lowest", label: "Lowest Rating", icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="p-8 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="mr-3" size={32} />
              Customer Reviews ({reviews.length})
            </h2>
            {reviews.length > 0 && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <StarRating rating={parseFloat(averageRating)} size="2rem" />
                  <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                  <span className="text-gray-600">out of 5</span>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          {reviews.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <SortAsc size={18} />
                <span>Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200 ${
                        sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <option.icon size={16} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-8">
          <div className="alert-error">
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📝</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No reviews yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Be the first to share your experience at this restaurant!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-blue-800">
              <strong>💡 Tip:</strong> Your honest review helps other food lovers discover great dining experiences!
            </p>
          </div>
        </div>
      ) : (
        <div className="p-8">
          {/* Review Cards */}
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                restaurantId={restaurantId}
                onReviewUpdated={handleReviewUpdated}
                onReviewDeleted={handleReviewDeleted}
              />
            ))}
          </div>

          {/* Statistics Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">{reviews.length}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <MessageSquare size={16} className="mr-1" />
                  Total Reviews
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">{averageRating}</div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <StarRating size={16} className="mr-1" />
                  Average Rating
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.round(
                    (reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100
                  )}%
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <TrendingUp size={16} className="mr-1" />
                  Positive Reviews
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.max(...reviews.map((r) => r.rating))}⭐
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <Award size={16} className="mr-1" />
                  Highest Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close sort menu */}
      {showSortMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowSortMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default ReviewList;
