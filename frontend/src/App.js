import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantsPage from './pages/RestaurantsPage';
import AddRestaurantPage from './pages/AddRestaurantPage';
import RestaurantDetail from './components/RestaurantDetail';
import EditRestaurant from './components/EditRestaurant';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route 
              path="/add-restaurant" 
              element={
                <ProtectedRoute>
                  <AddRestaurantPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/restaurants/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditRestaurant />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
