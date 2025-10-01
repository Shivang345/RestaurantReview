import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper: determine if URL is already absolute (http/https/data/blob)
function isAbsoluteUrl(url) {
  return /^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:');
}

// Helper: resolve backend-relative URLs to absolute URLs
function resolveSrc(url) {
  if (!url) return url;
  return isAbsoluteUrl(url) ? url : `http://localhost:8080${url}`;
}

const PhotoGallery = ({ photos = [], altText = "Photo" }) => {
  // currentIndex is null when the lightbox is closed
  const [currentIndex, setCurrentIndex] = useState(null);

  // Early return when there are no photos
  if (!photos || photos.length === 0) return null;

  const photoCount = photos.length;
  const hasMultiple = photoCount > 1;
  const isLightboxOpen = currentIndex !== null;

  // Lightbox controls
  const openLightbox = (index) => setCurrentIndex(index);
  const closeLightbox = () => setCurrentIndex(null);
  const showNext = () => setCurrentIndex((prev) => (prev + 1) % photoCount);
  const showPrev = () => setCurrentIndex((prev) => (prev - 1 + photoCount) % photoCount);

  // Render variants
  const renderSinglePhoto = () => (
    <img
      src={resolveSrc(photos[0])}
      alt={altText}
      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
      onClick={() => openLightbox(0)}
    />
  );

  const renderTwoPhotos = () => (
    <div className="grid grid-cols-2 gap-2">
      {photos.map((photo, index) => (
        <img
          key={index}
          src={resolveSrc(photo)}
          alt={`${altText} ${index + 1}`}
          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openLightbox(index)}
        />
      ))}
    </div>
  );

  const renderGridPhotos = () => (
    <div className="grid grid-cols-4 gap-2 h-48">
      <div className="col-span-2 row-span-2">
        <img
          src={resolveSrc(photos[0])}
          alt={`${altText} 1`}
          className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openLightbox(0)}
        />
      </div>
      <div className="col-span-2 grid grid-cols-2 gap-2">
        {photos.slice(1, 5).map((photo, index) => (
          <div key={index + 1} className="relative">
            <img
              src={resolveSrc(photo)}
              alt={`${altText} ${index + 2}`}
              className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openLightbox(index + 1)}
            />
            {index === 3 && photos.length > 5 && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer"
                onClick={() => openLightbox(4)}
              >
                <span className="text-white font-semibold">
                  +{photos.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Choose which variant to render
  const renderPhotoGrid = () => {
    if (photoCount === 1) return renderSinglePhoto();
    if (photoCount === 2) return renderTwoPhotos();
    return renderGridPhotos();
  };

  return (
    <>
      <div className="mb-4">
        {renderPhotoGrid()}
      </div>

      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {hasMultiple && (
              <>
                <button
                  onClick={showPrev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={showNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <img
              src={resolveSrc(photos[currentIndex])}
              alt={`${altText} ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {hasMultiple && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {currentIndex + 1} of {photoCount}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
