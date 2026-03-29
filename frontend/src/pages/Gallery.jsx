/**
 * Gallery Page
 * Display photo albums
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { galleryService } from '../services';
import { FaImages, FaChevronRight } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageHelper';

const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getAllAlbums();
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching albums:', error);
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

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary-400/15 rounded-full blur-[120px]" />
        </div>
        <div className="container-custom relative fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Photo Gallery</h1>
          <p className="text-lg text-primary-200 max-w-xl">Our work in pictures</p>
        </div>
      </section>

      {/* Albums Grid */}
      <div className="container-custom py-16">
        {albums.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaImages className="text-gray-400" size={20} />
            </div>
            <p className="text-lg text-gray-500 font-medium">No photo albums available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {albums.map((album, index) => (
              <Link
                key={album.id}
                to={`/gallery/${album.slug}`}
                className="card card-hover group overflow-hidden fade-in-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {album.cover_image_url ? (
                  <div className="overflow-hidden h-56 relative">
                    <img
                      src={getImageUrl(album.cover_image_url)}
                      alt={album.title}
                      width="720"
                      height="448"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xs font-bold text-white bg-black/30 backdrop-blur-md px-3 py-1 rounded-full">
                        {album.image_count || 0} photos
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <FaImages className="text-5xl text-gray-300" />
                  </div>
                )}
                <div className="p-7">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary-700 transition-colors">{album.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{album.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all duration-300">
                    View Album <FaChevronRight size={10} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Gallery;
