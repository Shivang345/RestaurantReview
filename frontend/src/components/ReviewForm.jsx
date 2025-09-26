import React, { useState } from "react";
import { reviewAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const ReviewForm = ({
  restaurantId,
  onReviewSubmitted
}) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    content: "",
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleRatingChange = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("Please sign in to write a review");
      return;
    }

    if (!formData.content.trim()) {
      setError("Please write a review");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await reviewAPI.createReview(restaurantId, formData);
      onReviewSubmitted();
      setFormData({ content: "", rating: 5 });
    } catch {
      setError("Submission failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="alert alert-info">
        <h5>Want to write a review?</h5>
        <p>Please <a href="/login" className="alert-link">sign in</a> or <a href="/register" className="alert-link">create an account</a> to share your experience.</p>
      </div>
    );
  }

  const StarRating = ({ rating, onChange }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className="mb-3 d-flex justify-content-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hover || rating);
          return (
            <button
              key={star}
              type="button"
              className="btn btn-link p-0 m-1 border-0"
              style={{ cursor: "pointer" }}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${star} Star`}
            >
              <i
                className={`bi ${
                  isActive
                    ? "bi-star-fill text-warning"
                    : "bi-star text-secondary"
                }`}
                style={{
                  fontSize: "1.8rem",
                  transition: "transform 0.15s ease-in-out",
                }}
              ></i>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-light p-4 rounded">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-3">
        <label className="form-label">
          <strong>Writing as: {user.fullName}</strong>
        </label>
      </div>

      <div className="mb-3">
        <label className="form-label">Rating *</label>
        <StarRating rating={formData.rating} onChange={handleRatingChange} />
      </div>

      <div className="mb-3">
        <label htmlFor="content" className="form-label">Review *</label>
        <textarea
          id="content"
          name="content"
          className="form-control"
          placeholder="Write your review"
          rows="4"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
