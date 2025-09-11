import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { restaurantAPI } from "../services/api";
import { Link } from "react-router-dom";

const EditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cuisineType: "",
    address: "",
    city: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const cuisineTypes = [
    "Italian",
    "Chinese",
    "Indian",
    "Mexican",
    "American"
  ];

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await restaurantAPI.getRestaurantById(id);
        const restaurant = response.data;
        setFormData({
          name: restaurant.name || "",
          description: restaurant.description || "",
          cuisineType: restaurant.cuisineType || "",
          address: restaurant.address || "",
          city: restaurant.city || "",
          phoneNumber: restaurant.phoneNumber || "",
        });
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        setError("Failed to load restaurant data.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError("");
      await restaurantAPI.updateRestaurant(id, formData);
      alert("Restaurant updated successfully!");
      navigate(`/restaurants/${id}`);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      setError("Failed to update restaurant. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading restaurant data...</div>;
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/restaurants">Restaurants</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/restaurants/${id}`}>{formData.name}</Link>
          </li>
          <li className="breadcrumb-item active">Edit</li>
        </ol>
      </nav>

      <h2 className="mb-4">Edit Restaurant</h2>

      <div className="form-container">
        {error && <div className="error">{error}</div>}

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
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
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
            />
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-success"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Restaurant"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/restaurants/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurant;
