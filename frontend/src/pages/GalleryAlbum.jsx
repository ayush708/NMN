/**
 * Gallery Album Page
 * Display images in an album
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { galleryService } from '../services';
import { getImageUrl } from '../utils/imageHelper';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';

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
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-[3px] border-primary-200 border-t-primary-600 animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!album) {
    return (
      <PublicLayout>
        <div className="container-custom py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Album Not Found</h1>
          <Link to="/gallery" className="text-primary-600 hover:underline inline-flex items-center gap-2">
            <FaArrowLeft size={12} /> Back to Gallery
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-custom py-10">
        <Link to="/gallery" className="text-primary-600 hover:text-primary-700 mb-8 inline-flex items-center gap-2 text-sm font-semibold group">
          <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" /> Back to Gallery
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{album.title}</h1>
        {album.description && <p className="text-gray-500 mb-10 text-lg max-w-2xl">{album.description}</p>}

        {!album.images || album.images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-500 font-medium">No images in this album yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {album.images.map((image, index) => (
              <div
                key={image.id}
                className="cursor-pointer overflow-hidden rounded-2xl group relative fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={getImageUrl(image.image_url)}
                  alt={image.title || album.title}
                  width="480"
                  height="320"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
                  {image.title && (
                    <div className="p-3 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs font-semibold text-white drop-shadow-lg line-clamp-1">{image.title}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl w-full relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors p-2"
              >
                <FaTimes size={20} />
              </button>
              <img
                src={getImageUrl(selectedImage.image_url)}
                alt={selectedImage.title || album.title}
                width="1280"
                height="853"
                decoding="async"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              {selectedImage.title && (
                <p className="text-white text-center mt-5 text-lg font-semibold">{selectedImage.title}</p>
              )}
              {selectedImage.description && (
                <p className="text-gray-400 text-center mt-2 text-sm">{selectedImage.description}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default GalleryAlbum;
