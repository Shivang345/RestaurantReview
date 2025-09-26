import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onChange, size = '1.5rem', editable = false }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (star) => {
    if (!editable) return;
    if (onChange) onChange(star);
  };

  const sizeClasses = {
    '1rem': 'w-4 h-4',
    '1.25rem': 'w-5 h-5', 
    '1.5rem': 'w-6 h-6',
    '2rem': 'w-8 h-8',
    '2.5rem': 'w-10 h-10'
  };

  const sizeClass = sizeClasses[size] || 'w-6 h-6';

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => {
        const isFilled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            disabled={!editable}
            className={`${
              editable 
                ? 'cursor-pointer hover:scale-110 transition-transform duration-150' 
                : 'cursor-default'
            } focus:outline-none`}
          >
            <Star
              className={`${sizeClass} ${
                isFilled 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              } transition-colors duration-150`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
