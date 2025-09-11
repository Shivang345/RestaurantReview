import React, { useState } from "react";
import { reviewAPI } from "../services/api";

const ReviewForm = ({
  restaurantId,
  onReviewSubmitted,
  currentUserEmail = "guest@example.com",
}) => {
  const [formData, setFormData] = useState({
    username: "",
    userEmail: "",
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
    if (!formData.username.trim() || !formData.content.trim()) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await reviewAPI.createReview(restaurantId, formData);
      onReviewSubmitted();
      setFormData({ username: "", userEmail: "", content: "", rating: 5 });
    } catch {
      setError("Submission failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Simple star rating with bootstrap btn classes
  // Bootstrap star rating with hover and click
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
    <form onSubmit={handleSubmit} className="border rounded p-4 mb-4 bg-white">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Your Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="form-control"
          placeholder="Enter your name"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="userEmail" className="form-label">
          Your Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          id="userEmail"
          name="userEmail"
          className="form-control"
          placeholder="Enter your email"
          value={formData.userEmail}
          onChange={handleChange}
          required
        />
      </div>

      <label className="form-label">
        Rating <span className="text-danger">*</span>
      </label>
      <StarRating rating={formData.rating} onChange={handleRatingChange} />

      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          Review <span className="text-danger">*</span>
        </label>
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
        className="btn btn-success w-100"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
