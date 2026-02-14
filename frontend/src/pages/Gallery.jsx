/**
 * Gallery Page
 * Display photo albums
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { galleryService } from '../services';
import { FaImages } from 'react-icons/fa';
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
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl">Loading...</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Photo Gallery</h1>
          <p className="text-xl mt-2">Our work in pictures</p>
        </div>
      </section>

      {/* Albums Grid */}
      <div className="container-custom py-16">
        {albums.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No photo albums available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Link
                key={album.id}
                to={`/gallery/${album.slug}`}
                className="card overflow-hidden hover:scale-105 transition"
              >
                {album.cover_image_url ? (
                  <img
                    src={getImageUrl(album.cover_image_url)}
                    alt={album.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <FaImages className="text-6xl text-gray-400" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{album.title}</h3>
                  <p className="text-gray-600 line-clamp-2 mb-3">{album.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{album.image_count || 0} photos</span>
                    <span className="text-primary-600 font-medium">View Album →</span>
                  </div>
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
