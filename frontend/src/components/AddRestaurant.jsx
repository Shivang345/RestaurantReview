import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await restaurantAPI.createRestaurant(formData);
      alert('Restaurant added successfully!');
      navigate('/restaurants');
    } catch (error) {
      console.error('Error creating restaurant:', error);
      setError('Failed to create restaurant. Please check all required fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      {error && (
        <div className="error">{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Restaurant Name *</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Tell us about this restaurant..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cuisine Type *</label>
          <select
            className="form-select"
            name="cuisineType"
            value={formData.cuisineType}
            onChange={handleChange}
            required
          >
            <option value="">Select Cuisine Type</option>
            {cuisineTypes.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Address *</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Street address"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City *</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Restaurant'}
          </button>
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/restaurants')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;
