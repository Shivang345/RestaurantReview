import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantsPage from './pages/RestaurantsPage';
import AddRestaurantPage from './pages/AddRestaurantPage';
import RestaurantDetail from './components/RestaurantDetail';
import EditRestaurant from './components/EditRestaurant';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurants/add" element={<AddRestaurantPage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/restaurants/edit/:id" element={<EditRestaurant />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
