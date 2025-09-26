import React, { useState } from "react";
import { reviewAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Star, Send, Loader2, LogIn } from 'lucide-react';

const ReviewForm = ({ restaurantId, onReviewSubmitted }) => {
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

  const StarRatingInput = ({ rating, onChange }) => {
    const [hover, setHover] = useState(0);
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hover || rating);
          return (
            <button
              key={star}
              type="button"
              className={`p-1 rounded transition-colors duration-150 ${
                isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => onChange(star)}
            >
              <Star
                size={32}
                className={`${isActive ? 'fill-current' : ''} transition-all duration-150`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="alert-info">
        <div className="flex items-start space-x-3">
          <LogIn className="mt-1 text-blue-600" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Want to write a review?</h3>
            <p className="text-blue-700">
              Please{' '}
              <a href="/login" className="font-medium underline hover:no-underline">
                sign in
              </a>{' '}
              or{' '}
              <a href="/register" className="font-medium underline hover:no-underline">
                create an account
              </a>{' '}
              to share your experience.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="alert-error">
          <span>{error}</span>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800">
          <span className="font-medium">Writing as:</span> {user.fullName}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Rating *
        </label>
        <StarRatingInput rating={formData.rating} onChange={handleRatingChange} />
        <p className="mt-2 text-sm text-gray-600">
          {formData.rating} out of 5 stars
        </p>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Review *
        </label>
        <textarea
          id="content"
          name="content"
          className="form-textarea h-32"
          placeholder="Share your experience at this restaurant..."
          value={formData.content}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !formData.content.trim()}
        className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Send size={20} />
            <span>Submit Review</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
