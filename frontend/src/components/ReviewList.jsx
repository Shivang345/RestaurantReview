import React, { useState, useEffect } from "react";
import { reviewAPI } from "../services/api";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRAting";

const ReviewList = ({
  restaurantId,
  currentUserEmail = "guest@example.com",
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary me-3" role="status"></div>
        <span className="text-muted fs-5">Loading reviews...</span>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      {/* ✨ CHANGE 1: Enhanced Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h3 className="mb-2 fw-bold text-dark">
            💬 Customer Reviews
            <span className="badge bg-primary ms-2">{reviews.length}</span>
          </h3>
          {reviews.length > 0 && (
            <div className="d-flex align-items-center">
              <span className="me-3">
                <StarRating rating={averageRating} />
              </span>
              <span className="fw-semibold fs-5 text-dark">
                {averageRating}
              </span>
              <span className="text-muted ms-1">out of 5</span>
            </div>
          )}
        </div>

        {/* ✨ CHANGE 2: Modern Sort Dropdown */}
        {reviews.length > 0 && (
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className={`dropdown-item ${
                    sortBy === "newest" ? "active" : ""
                  }`}
                  onClick={() => setSortBy("newest")}
                >
                  Newest First
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item ${
                    sortBy === "oldest" ? "active" : ""
                  }`}
                  onClick={() => setSortBy("oldest")}
                >
                  Oldest First
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item ${
                    sortBy === "highest" ? "active" : ""
                  }`}
                  onClick={() => setSortBy("highest")}
                >
                  Highest Rating
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item ${
                    sortBy === "lowest" ? "active" : ""
                  }`}
                  onClick={() => setSortBy("lowest")}
                >
                  Lowest Rating
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ✨ CHANGE 3: Better Error Display */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center mb-4"
          role="alert"
        >
          <span className="me-2">⚠️</span>
          <div>{error}</div>
        </div>
      )}

      {/* ✨ CHANGE 4: Enhanced Empty State */}
      {reviews.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4" style={{ fontSize: "4rem" }}>
            📝
          </div>
          <h4 className="mb-3 text-muted">No reviews yet</h4>
          <p className="text-muted mb-4 fs-5">
            Be the first to share your experience at this restaurant!
          </p>
          <div className="bg-light p-4 rounded-3 border">
            <p className="mb-0 text-muted">
              <strong>💡 Tip:</strong> Your honest review helps other food
              lovers discover great dining experiences!
            </p>
          </div>
        </div>
      ) : (
        /* ✨ CHANGE 5: Cleaner Review Cards Layout */
        <div className="row g-4">
          {sortedReviews.map((review) => (
            <div key={review.id} className="col-12">
              <div className="review-card-wrapper">
                <ReviewCard
                  review={review}
                  restaurantId={restaurantId}
                  onReviewUpdated={handleReviewUpdated}
                  onReviewDeleted={handleReviewDeleted}
                  currentUserEmail={currentUserEmail}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✨ CHANGE 6: Review Statistics Footer */}
      {reviews.length > 0 && (
        <div className="mt-4 pt-4 border-top">
          <div className="row text-center">
            <div className="col-md-3">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-2">
                    {reviews.length}
                  </h5>
                  <p className="card-text text-muted small mb-0">
                    Total Reviews
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <h5 className="card-title text-warning mb-2">
                    {averageRating}
                  </h5>
                  <p className="card-text text-muted small mb-0">
                    Average Rating
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <h5 className="card-title text-success mb-2">
                    {Math.round(
                      (reviews.filter((r) => r.rating >= 4).length /
                        reviews.length) *
                        100
                    )}
                    %
                  </h5>
                  <p className="card-text text-muted small mb-0">
                    Positive Reviews
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <h5 className="card-title text-info mb-2">
                    {Math.max(...reviews.map((r) => r.rating))}⭐
                  </h5>
                  <p className="card-text text-muted small mb-0">
                    Highest Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
