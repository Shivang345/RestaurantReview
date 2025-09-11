import React, { useState } from "react";
import { reviewAPI } from "../services/api";
import StarRating from "./StarRAting";

const ReviewCard = ({
  review,
  restaurantId,
  onReviewUpdated,
  onReviewDeleted,
  currentUserEmail,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    content: review.content,
    rating: review.rating,
  });
  const [loading, setLoading] = useState(false);

  const isOwner =
    currentUserEmail && review.userEmail.toLowerCase() === currentUserEmail.toLowerCase();
  const canEdit = isOwner && review.canBeEdited;

  const handleEdit = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.updateReview(
        restaurantId,
        review.id,
        editData,
        currentUserEmail
      );
      onReviewUpdated(response.data);
      setIsEditing(false);

      // Success notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-success text-white px-4 py-2 rounded shadow-lg z-50 d-flex align-items-center";
      notification.textContent = "✅ Review updated successfully!";
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        setLoading(true);
        await reviewAPI.deleteReview(restaurantId, review.id, currentUserEmail);
        onReviewDeleted(review.id);

        // Success notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-danger text-white px-4 py-2 rounded shadow-lg z-50 d-flex align-items-center";
        notification.textContent = "🗑️ Review deleted successfully!";
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="card shadow-sm review-card"
      style={{ borderRadius: "12px", cursor: "default", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
    >
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="m-auto">
            <strong>{review.username}</strong>
            <div className="text-muted small">
              {formatDate(review.createdAt)}
              {review.lastEdited && review.lastEdited !== review.createdAt && (
                <em className="ms-2">(edited {formatDate(review.lastEdited)})</em>
              )}
            </div>
          </div>

          {isOwner && (
            <div>
              {canEdit && !isEditing && (
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="mb-2">
          <StarRating rating={isEditing ? editData.rating : review.rating} editable={isEditing} onChange={(val) => setEditData({ ...editData, rating: val })} size="1.5rem" />
        </div>

        {/* Review Content */}
        {!isEditing ? (
          <p className="text-truncate" style={{ maxHeight: "4rem", overflow: "hidden", lineHeight: "1.2rem" }}>
            {review.content}
          </p>
        ) : (
          <textarea
            className="form-control mb-2"
            rows={3}
            value={editData.content}
            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            disabled={loading}
          />
        )}

        {/* Editing Buttons */}
        {isEditing && (
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-sm btn-success"
              onClick={handleEdit}
              disabled={loading}
            >
              Save
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setEditData({
                  content: review.content,
                  rating: review.rating,
                });
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Edit time warning */}
        {!isEditing && isOwner && !canEdit && (
          <small className="text-warning d-block mt-2">
            ⏰ You can edit your review within 48 hours of posting.
          </small>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
