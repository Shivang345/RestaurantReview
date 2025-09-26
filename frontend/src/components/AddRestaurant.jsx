import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { Save, Loader2, MapPin, Phone, FileText, Tag } from 'lucide-react';

const AddRestaurant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisineType: '',
    address: '',
    city: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cuisineTypes = ['Italian', 'Chinese', 'Indian', 'Mexican', 'American'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await restaurantAPI.createRestaurant(formData);
      
      // Success notification
      const notification = document.createElement("div");
      notification.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 notification";
      notification.textContent = "✅ Restaurant added successfully!";
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
      
      navigate('/restaurants');
    } catch (error) {
      console.error('Error creating restaurant:', error);
      setError('Failed to create restaurant. Please check all required fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="alert-error">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <FileText size={18} className="text-gray-500" />
              <span>Restaurant Name *</span>
            </div>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-input"
            placeholder="Enter restaurant name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <FileText size={18} className="text-gray-500" />
              <span>Description</span>
            </div>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            className="form-textarea h-24"
            placeholder="Tell us about this restaurant..."
          />
        </div>

        <div>
          <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Tag size={18} className="text-gray-500" />
              <span>Cuisine Type *</span>
            </div>
          </label>
          <select
            id="cuisineType"
            name="cuisineType"
            value={formData.cuisineType}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-select"
          >
            <option value="">Select Cuisine Type</option>
            {cuisineTypes.map(cuisine => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-gray-500" />
                <span>Address *</span>
              </div>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-input"
              placeholder="Street address"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-gray-500" />
                <span>City *</span>
              </div>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={loading}
              className="form-input"
              placeholder="City name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Phone size={18} className="text-gray-500" />
              <span>Phone Number</span>
            </div>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={loading}
            className="form-input"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={() => navigate('/restaurants')}
            className="btn-outline px-6 py-3"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-success px-8 py-3 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Create Restaurant</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;
