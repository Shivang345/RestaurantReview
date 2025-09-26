import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Home, MapPin, Plus, LogIn, UserPlus, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  const NavLink = ({ to, children, icon: Icon, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
        isActive(to)
          ? 'bg-blue-700 text-white'
          : 'text-blue-100 hover:bg-blue-600 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-white text-xl font-bold">Restaurant Reviews</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/restaurants" icon={MapPin}>Restaurants</NavLink>
            <NavLink to="/add-restaurant" icon={Plus}>Add Restaurant</NavLink>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  <User size={18} />
                  <span className="font-medium">{user.fullName}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink to="/login" icon={LogIn}>Sign In</NavLink>
                <NavLink to="/register" icon={UserPlus}>Sign Up</NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col space-y-2">
              <NavLink to="/" icon={Home} onClick={() => setIsOpen(false)}>Home</NavLink>
              <NavLink to="/restaurants" icon={MapPin} onClick={() => setIsOpen(false)}>Restaurants</NavLink>
              <NavLink to="/add-restaurant" icon={Plus} onClick={() => setIsOpen(false)}>Add Restaurant</NavLink>
              
              <div className="border-t border-blue-500 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-blue-100">
                      <p className="text-sm">Signed in as</p>
                      <p className="font-medium">{user.fullName}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-blue-100 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <NavLink to="/login" icon={LogIn} onClick={() => setIsOpen(false)}>Sign In</NavLink>
                    <NavLink to="/register" icon={UserPlus} onClick={() => setIsOpen(false)}>Sign Up</NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
