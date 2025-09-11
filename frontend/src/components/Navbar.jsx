import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  // To highlight active link
  const isActive = (path) => location.pathname === path;

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close menu on link click
  const handleLinkClick = () => {
    if (!isCollapsed) setIsCollapsed(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={handleLinkClick}>
          🍽️ Restaurant Reviews
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                to="/"
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/restaurants') ? 'active' : ''}`}
                to="/restaurants"
                onClick={handleLinkClick}
              >
                Restaurants
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/restaurants/add') ? 'active' : ''}`}
                to="/restaurants/add"
                onClick={handleLinkClick}
              >
                Add Restaurant
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
