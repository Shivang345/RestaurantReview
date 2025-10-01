import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Existing restaurant API (unchanged)
export const restaurantAPI = {
  createRestaurant: (restaurant) => api.post('/restaurants', restaurant),
  getAllRestaurants: () => api.get('/restaurants'),
  getRestaurantById: (id) => api.get(`/restaurants/${id}`),
  searchRestaurants: (searchTerm) => api.get(`/restaurants/search`, {
    params: { q: searchTerm }
  }),
  getRestaurantsByCuisine: (cuisine) => api.get(`/restaurants/cuisine/${cuisine}`),
  getRestaurantsByCity: (city) => api.get(`/restaurants/city/${city}`),
  updateRestaurant: (id, restaurant) => api.put(`/restaurants/${id}`, restaurant),
  deleteRestaurant: (id) => api.delete(`/restaurants/${id}`),

  updateRestaurantPhotos: async (restaurantId, photoUrls) => {
    const response = await fetch(`http://localhost:8080/api/restaurants/${restaurantId}/photos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add any auth headers if needed
      },
      body: JSON.stringify({ photoUrls })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  },
  
};

// Updated review API (removed userEmail parameters as they're now handled by backend)
export const reviewAPI = {
  createReview: (restaurantId, review) => 
    api.post(`/restaurants/${restaurantId}/reviews`, review),
  
  getReviewsByRestaurant: (restaurantId) => 
    api.get(`/restaurants/${restaurantId}/reviews`),
  
  getReview: (restaurantId, reviewId) => 
    api.get(`/restaurants/${restaurantId}/reviews/${reviewId}`),
  
  updateReview: (restaurantId, reviewId, review) => 
    api.put(`/restaurants/${restaurantId}/reviews/${reviewId}`, review),
  
  deleteReview: (restaurantId, reviewId) => 
    api.delete(`/restaurants/${restaurantId}/reviews/${reviewId}`),
};

export default api;
