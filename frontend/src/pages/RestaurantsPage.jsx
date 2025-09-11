import React from 'react';
import RestaurantList from '../components/RestaurantList';

const RestaurantsPage = () => {
  return (
    <div>
      <h2 className="mb-4">All Restaurants</h2>
      <RestaurantList />
    </div>
  );
};

export default RestaurantsPage;
