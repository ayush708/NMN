/**
 * Gallery Album Page
 * Display images in an album
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { galleryService } from '../services';
import { getImageUrl } from '../utils/imageHelper';

const GalleryAlbum = () => {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchAlbum();
  }, [slug]);

  const fetchAlbum = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getAlbumBySlug(slug);
      setAlbum(response.data);
    } catch (error) {
      console.error('Error fetching album:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl">Loading...</div>
        </div>
      </PublicLayout>
    );
  }

  if (!album) {
    return (
      <PublicLayout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Album Not Found</h1>
          <Link to="/gallery" className="text-primary-600 hover:underline">
            ← Back to Gallery
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-custom py-16">
        <Link to="/gallery" className="text-primary-600 hover:underline mb-6 inline-block">
          ← Back to Gallery
        </Link>

        <h1 className="text-4xl font-bold mb-4">{album.title}</h1>
        {album.description && <p className="text-gray-600 mb-8">{album.description}</p>}

        {!album.images || album.images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No images in this album yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {album.images.map((image) => (
              <div
                key={image.id}
                className="cursor-pointer overflow-hidden rounded-lg hover:shadow-lg transition"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={getImageUrl(image.image_url)}
                  alt={image.title || album.title}
                  className="w-full h-48 object-cover hover:scale-110 transition"
                />
                {image.title && (
                  <div className="p-2 bg-white">
                    <p className="text-sm font-medium line-clamp-1">{image.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white text-4xl"
              >
                ×
              </button>
              <img
                src={getImageUrl(selectedImage.image_url)}
                alt={selectedImage.title || album.title}
                className="w-full h-auto rounded-lg"
              />
              {selectedImage.title && (
                <p className="text-white text-center mt-4 text-lg">{selectedImage.title}</p>
              )}
              {selectedImage.description && (
                <p className="text-gray-300 text-center mt-2">{selectedImage.description}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default GalleryAlbum;
