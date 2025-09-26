import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { Save, Loader2, MapPin, Phone, FileText, Tag, ArrowLeft } from 'lucide-react';

const EditRestaurant = () => {
  const { id } = useParams();
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
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');

  const cuisineTypes = ['Italian', 'Chinese', 'Indian', 'Mexican', 'American'];

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      setFetchingData(true);
      const response = await restaurantAPI.getRestaurantById(id);
      const restaurant = response.data;
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        cuisineType: restaurant.cuisineType || '',
        address: restaurant.address || '',
        city: restaurant.city || '',
        phoneNumber: restaurant.phoneNumber || ''
      });
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setError('Failed to load restaurant data.');
    } finally {
      setFetchingData(false);
    }
  };

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
      await restaurantAPI.updateRestaurant(id, formData);
      
      // Success notification
      const notification = document.createElement("div");
      notification.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 notification";
      notification.textContent = "✅ Restaurant updated successfully!";
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
      
      navigate(`/restaurants/${id}`);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      setError('Failed to update restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Edit Restaurant</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Update restaurant information to keep details current and accurate
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg p-8">
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
                onClick={() => navigate(`/restaurants/${id}`)}
                className="btn-outline px-6 py-3 flex items-center space-x-2"
                disabled={loading}
              >
                <ArrowLeft size={18} />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Update Restaurant</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Editing tips:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Make sure all information is current and accurate</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Update contact details if they have changed</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Improve the description to attract more diners</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurant;
