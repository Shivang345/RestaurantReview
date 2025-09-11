import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const restaurantAPI = {
  // CREATE
  createRestaurant: (restaurant) => api.post('/restaurants', restaurant),
  
  // READ
  getAllRestaurants: () => api.get('/restaurants'),
  getRestaurantById: (id) => api.get(`/restaurants/${id}`),
  searchRestaurants: (searchTerm) => api.get(`/restaurants/search`, {
    params: { q: searchTerm }
  }),
  getRestaurantsByCuisine: (cuisine) => api.get(`/restaurants/cuisine/${cuisine}`),
  getRestaurantsByCity: (city) => api.get(`/restaurants/city/${city}`),
  
  // UPDATE
  updateRestaurant: (id, restaurant) => api.put(`/restaurants/${id}`, restaurant),
  
  // DELETE
  deleteRestaurant: (id) => api.delete(`/restaurants/${id}`),
};

export const reviewAPI = {
  // REVIEW CRUD
  createReview: (restaurantId, review) => 
    api.post(`/restaurants/${restaurantId}/reviews`, review),
  
  getReviewsByRestaurant: (restaurantId) => 
    api.get(`/restaurants/${restaurantId}/reviews`),
  
  getReview: (restaurantId, reviewId) => 
    api.get(`/restaurants/${restaurantId}/reviews/${reviewId}`),
  
  updateReview: (restaurantId, reviewId, review, userEmail) => 
    api.put(`/restaurants/${restaurantId}/reviews/${reviewId}?userEmail=${userEmail}`, review),
  
  deleteReview: (restaurantId, reviewId, userEmail) => 
    api.delete(`/restaurants/${restaurantId}/reviews/${reviewId}?userEmail=${userEmail}`),
  
  getReviewsByUser: (userEmail) => 
    api.get(`/users/${userEmail}/reviews`),
};

export default api;
