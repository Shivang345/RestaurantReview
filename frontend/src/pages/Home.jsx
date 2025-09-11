import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div className="p-5 rounded-4 text-center bg-light shadow-lg position-relative overflow-hidden">
        <h1 className="display-4 fw-bold mb-3">
          <span role="img" aria-label="restaurant">
            🍽️
          </span>{" "}
          Welcome to Restaurant Reviews
        </h1>
        <p className="lead mb-4">
          Discover amazing restaurants, read reviews, and share your experiences!
        </p>
        <hr className="my-4 mx-auto" style={{ maxWidth: "300px" }} />
        <p className="mb-4">
          Browse restaurants nearby, explore cuisines, and add your own favorites.
        </p>
        <div>
          <Link
            to="/restaurants"
            className="btn btn-primary btn-lg me-3 shadow-sm"
            role="button"
            aria-label="Browse Restaurants"
          >
            Browse Restaurants
          </Link>
          <Link
            to="/restaurants/add"
            className="btn btn-success btn-lg shadow-sm"
            role="button"
            aria-label="Add Restaurant"
          >
            Add Restaurant
          </Link>
        </div>

        {/* Animated floating circles */}
        <div
          className="position-absolute rounded-circle bg-primary opacity-25"
          style={{
            width: "150px",
            height: "150px",
            top: "-50px",
            right: "-50px",
            animation: "floatUpDown 6s ease-in-out infinite",
            zIndex: 0,
          }}
        ></div>
        <div
          className="position-absolute rounded-circle bg-success opacity-25"
          style={{
            width: "100px",
            height: "100px",
            bottom: "-30px",
            left: "-30px",
            animation: "floatUpDown 8s ease-in-out infinite",
            animationDelay: "2s",
            zIndex: 0,
          }}
        ></div>
      </div>

      {/* Features Section */}
      <div className="row text-center g-4 my-5">
        {[
          {
            emoji: "🔍",
            title: "Discover",
            description:
              "Find restaurants by cuisine, location, or your favorite dishes.",
            bg: "bg-primary bg-opacity-10",
          },
          {
            emoji: "⭐",
            title: "Review",
            description:
              "Share your experiences and help others make great choices.",
            bg: "bg-warning bg-opacity-10",
          },
          {
            emoji: "🏪",
            title: "Add",
            description:
              "Own a restaurant? Add your establishment and attract more customers.",
            bg: "bg-success bg-opacity-10",
          },
        ].map(({ emoji, title, description, bg }) => (
          <div key={title} className="col-lg-4 col-md-6">
            <div
              className={`h-100 p-4 rounded-3 shadow-sm ${bg} border border-opacity-25`}
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="display-5 mb-3" aria-label={title}>
                {emoji}
              </div>
              <h3 className="h5 mb-3 fw-semibold">{title}</h3>
              <p className="text-secondary m-0">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add custom keyframes */}
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default Home;
