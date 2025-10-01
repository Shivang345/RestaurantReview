import React, { useState, useRef } from 'react';
import { Camera, X, Upload, AlertCircle } from 'lucide-react';

const PhotoUpload = ({ 
  onPhotosChange, 
  maxPhotos = 5, 
  initialPhotos = [],
  uploadEndpoint = '/api/uploads/restaurant-photos' 
}) => {
  const [photos, setPhotos] = useState(initialPhotos);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length + photos.length > maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} is too large (max 5MB)`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} is not an image`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
    setError('');
  };

  const uploadPhotos = async () => {
    const newFiles = previews.filter(p => p.isNew).map(p => p.file);
    
    if (newFiles.length === 0) {
      onPhotosChange([...photos]);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      newFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`http://localhost:8080${uploadEndpoint}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        const allPhotoUrls = [...photos, ...result.uploadedFiles];
        setPhotos(allPhotoUrls);
        onPhotosChange(allPhotoUrls);
        
        // Clean up previews
        setPreviews(prev => prev.filter(p => !p.isNew));
        
        if (result.errors && result.errors.length > 0) {
          setError(`Some files failed to upload: ${result.errors.join(', ')}`);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setError('Failed to upload photos. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index, isPreview = false) => {
    if (isPreview) {
      setPreviews(prev => {
        const newPreviews = [...prev];
        URL.revokeObjectURL(newPreviews[index].preview);
        newPreviews.splice(index, 1);
        return newPreviews;
      });
    } else {
      const newPhotos = [...photos];
      newPhotos.splice(index, 1);
      setPhotos(newPhotos);
      onPhotosChange(newPhotos);
    }
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Photos ({photos.length + previews.length}/{maxPhotos})
        </label>
        {previews.length > 0 && (
          <button
            type="button"
            onClick={uploadPhotos}
            disabled={uploading}
            className="btn-primary text-sm px-3 py-1"
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {previews.length} photo{previews.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Existing Photos */}
        {photos.map((photoUrl, index) => (
          <div key={index} className="relative group">
            <img
              src={photoUrl}
              alt={`Photo ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => removePhoto(index, false)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Preview Photos */}
        {previews.map((preview, index) => (
          <div key={`preview-${index}`} className="relative group">
            <img
              src={preview.preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border-2 border-blue-300 opacity-75"
            />
            <button
              type="button"
              onClick={() => removePhoto(index, true)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-blue-600 bg-white px-2 py-1 rounded">
                Pending Upload
              </span>
            </div>
          </div>
        ))}

        {/* Add Photo Button */}
        {photos.length + previews.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
          >
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs">Add Photo</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Upload up to {maxPhotos} photos. Max 5MB each. Supported: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
};

export default PhotoUpload;
