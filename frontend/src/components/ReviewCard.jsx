import React, { useState } from "react";
import { reviewAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import StarRating from "./StarRAting";

const ReviewCard = ({
  review,
  restaurantId,
  onReviewUpdated,
  onReviewDeleted,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    content: review.content,
    rating: review.rating,
  });
  const [loading, setLoading] = useState(false);

  // Check if current user owns this review
  const isOwner = isAuthenticated && user && 
    review.userEmail.toLowerCase() === user.email.toLowerCase();
  const canEdit = isOwner && review.canBeEdited;

  const handleEdit = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.updateReview(
        restaurantId,
        review.id,
        editData
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
        await reviewAPI.deleteReview(restaurantId, review.id);
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
    const options = { 
      year: "numeric", 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className="card shadow-sm review-card"
      style={{ 
        borderRadius: "12px", 
        cursor: "default", 
        transition: "transform 0.2s ease, box-shadow 0.2s ease" 
      }}
    >
      <div className="card-body">
        {/* Header - Updated layout */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Centered name and date */}
          <div className="text-center flex-grow-1">
            <div>
              <strong className="d-block">{review.username}</strong>
              <small className="text-muted">
                {formatDate(review.createdAt)}
                {review.lastEdited && review.lastEdited !== review.createdAt && (
                  <em> (edited {formatDate(review.lastEdited)})</em>
                )}
              </small>
            </div>
          </div>
          
          {/* Three-dot menu positioned absolutely */}
          {isOwner && (
            <div className="dropdown position-relative" style={{ marginLeft: "auto", zIndex: 1 }}>
              <button
                className="btn btn-link btn-sm text-muted border-0"
                type="button"
                data-bs-toggle="dropdown"
                style={{ marginTop: "-8px" }}
              >
                ⋮
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {canEdit && !isEditing && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  </li>
                )}
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Rating - Centered */}
        <div className="mb-3 text-center">
          <StarRating 
            rating={isEditing ? editData.rating : review.rating} 
            editable={isEditing} 
            onChange={(val) => setEditData({ ...editData, rating: val })} 
            size="1.5rem" 
          />
        </div>

        {/* Review Content */}
        {!isEditing ? (
          <p className="card-text text-center">{review.content}</p>
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
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleEdit}
              disabled={loading}
            >
              Save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Edit time warning */}
        {!isEditing && isOwner && !canEdit && (
          <small className="text-muted d-block text-center mt-2">
            ⏰ You can edit your review within 48 hours of posting.
          </small>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;