import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Plus, Search, Star, Users } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Search,
      title: "Discover",
      description: "Find restaurants by cuisine, location, or your favorite dishes.",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Star,
      title: "Review",
      description: "Share your experiences and help others make great choices.",
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Plus,
      title: "Add",
      description: "Own a restaurant? Add your establishment and attract more customers.",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-6xl sm:text-7xl mb-4 block">🍽️</span>
              Welcome to Restaurant Reviews
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover amazing restaurants, read reviews, and share your experiences!
            </p>
            
            <hr className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded" />
            
            <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
              Browse restaurants nearby, explore cuisines, and add your own favorites.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/restaurants"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <MapPin size={20} />
                <span>Browse Restaurants</span>
              </Link>
              <Link
                to="/add-restaurant"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <Plus size={20} />
                <span>Add Restaurant</span>
              </Link>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-float"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-float-delayed"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`${feature.bgColor} p-8 rounded-2xl border border-gray-200 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-6`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">Restaurants Listed</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-blue-200">Reviews Written</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Happy Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
