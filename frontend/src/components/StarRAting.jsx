import React from 'react';

const StarRating = ({ rating, onChange, size = '1.5rem', editable = false }) => {
  // rating: number (1 to 5)
  // onChange: function when star clicked (passes new rating)
  // size: icon size in rem units
  // editable: boolean, if true allows click to change rating

  const stars = [1, 2, 3, 4, 5];

  const handleClick = (star) => {
    if (!editable) return;
    if (onChange) onChange(star);
  };

  return (
    <div className="flex align-items-center">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`btn p-0 border-0 ${
            star <= rating ? 'text-warning' : 'text-secondary'
          }`}
          aria-label={`Star ${star}`}
          onClick={() => handleClick(star)}
          style={{ fontSize: size, cursor: editable ? 'pointer' : 'default' }}
        >
          {star <= rating ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
};

export default StarRating;
