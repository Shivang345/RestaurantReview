import React, { useState } from "react";
import { reviewAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import StarRating from "./StarRAting";
import PhotoGallery from "./PhotoGallery";  // Import PhotoGallery here
import { Edit, Trash2, Save, X, MoreVertical } from 'lucide-react';

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
  const [showMenu, setShowMenu] = useState(false);

  // Check if current user owns this review
  const isOwner = isAuthenticated && user && 
    review.userEmail.toLowerCase() === user.email.toLowerCase();
  const canEdit = isOwner && review.canBeEdited;

  // Helper: prepend backend URL for photo URLs
  const getImageUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http')) return photoUrl;
    return `http://localhost:8080${photoUrl}`;
  };

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
      showNotification("✅ Review updated successfully!", "success");
    } catch (error) {
      console.error("Error updating review:", error);
      showNotification("❌ Failed to update review. Please try again.", "error");
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
        showNotification("🗑️ Review deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting review:", error);
        showNotification("❌ Failed to delete review. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white notification ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
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
    <div className="card p-6 transition-all duration-200 hover:shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {review.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">{review.username}</h4>
            <div className="text-sm text-gray-500 space-y-1">
              <p>{formatDate(review.createdAt)}</p>
              {review.lastEdited && review.lastEdited !== review.createdAt && (
                <p className="italic">Edited {formatDate(review.lastEdited)}</p>
              )}
            </div>
          </div>
        </div>
        
        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <MoreVertical size={18} className="text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                {canEdit && !isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-gray-700 transition-colors duration-200"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-red-600 transition-colors duration-200"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-4">
        <StarRating
          rating={isEditing ? editData.rating : review.rating}
          editable={isEditing}
          onChange={isEditing ? (val) => setEditData({ ...editData, rating: val }) : null}
          size="1.5rem"
        />
        {isEditing && (
          <p className="text-sm text-gray-600 mt-1">
            {editData.rating} out of 5 stars
          </p>
        )}
      </div>

      {/* Review Content */}
      {!isEditing ? (
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">{review.content}</p>
        </div>
      ) : (
        <div className="mb-4">
          <textarea
            className="form-textarea w-full h-24"
            value={editData.content}
            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            disabled={loading}
            placeholder="Update your review..."
          />
        </div>
      )}

      {/* Review Photos */}
      {!isEditing && review.photoUrls && review.photoUrls.length > 0 && (
        <PhotoGallery
          photos={review.photoUrls.map(getImageUrl)}
          altText={`${review.username}'s review photos`}
          maxPreview={4}
          showCount={true}
        />
      )}

      {/* Editing Buttons */}
      {isEditing && (
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={handleEdit}
            disabled={loading || !editData.content.trim()}
            className="btn-primary px-4 py-2 flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{loading ? 'Saving...' : 'Save'}</span>
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditData({ content: review.content, rating: review.rating });
            }}
            disabled={loading}
            className="btn-secondary px-4 py-2 flex items-center space-x-2"
          >
            <X size={16} />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Edit time warning */}
      {!isEditing && isOwner && !canEdit && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            You can edit your review within 48 hours of posting.
          </p>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default ReviewCard;
