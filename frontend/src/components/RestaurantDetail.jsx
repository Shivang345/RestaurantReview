import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { restaurantAPI } from "../services/api";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRAting";
import ReviewList from "./ReviewList";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const currentUserEmail = "guest@example.com";

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
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary me-3" role="status"></div>
        <span className="fs-5">Loading restaurant details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <Link to="/restaurants" className="btn btn-primary">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="container my-5">
      {/* ✨ CHANGE 7: Enhanced Restaurant Info Section */}
      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold mb-3">{restaurant.name}</h1>

              <div className="mb-3">
                <span className="badge bg-primary fs-6 px-3 py-2">
                  {restaurant.cuisineType}
                </span>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={restaurant.averageRating} />
                <span className="fw-bold fs-5 ms-2">
                  {restaurant.averageRating}
                </span>
                <span className="text-muted ms-1">
                  ({restaurant.totalReviews} reviews)
                </span>
              </div>

              {restaurant.description && (
                <p className="fs-5 text-muted mb-4 lh-base">
                  {restaurant.description}
                </p>
              )}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <h6 className="fw-semibold text-dark mb-2">📍 Address</h6>
                  <p className="text-muted mb-0">{restaurant.address}</p>
                  <p className="text-muted">{restaurant.city}</p>
                </div>
                {restaurant.phoneNumber && (
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-semibold text-dark mb-2">📞 Contact</h6>
                    <p className="text-muted">{restaurant.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4 text-lg-end">
              <div className="d-flex flex-column gap-3">
                <button
                  className="btn btn-success"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? "Cancel Review" : "Write Review"}
                </button>
                <Link
                  to={`/restaurants/edit/${restaurant.id}`}
                  className="btn btn-outline-primary"
                >
                  Edit Restaurant
                </Link>
                <Link to="/restaurants" className="btn btn-outline-secondary">
                  ← Back to List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ CHANGE 8: Review Form with Better Spacing */}
      {showReviewForm && (
        <div className="mb-5">
          <div className="card shadow-lg">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">✍️ Write Your Review</h4>
            </div>
            <div className="card-body">
              <ReviewForm
                restaurantId={id}
                currentUserEmail={currentUserEmail}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          </div>
        </div>
      )}

      {/* ✨ CHANGE 9: Reviews Section with Professional Look */}
      <div className="card shadow-lg">
        <div className="card-body p-4">
          <ReviewList restaurantId={id} currentUserEmail={currentUserEmail} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
