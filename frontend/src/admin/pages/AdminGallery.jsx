/**
 * Admin Gallery Page
 * Full CRUD for gallery albums and images
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import FileUpload from '../components/FileUpload';
import { galleryService } from '../../services';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaImages, FaImage } from 'react-icons/fa';

const AdminGallery = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [albumFormData, setAlbumFormData] = useState({
    title: '',
    description: '',
    cover_image: '',
    is_published: true,
  });
  const [imageFormData, setImageFormData] = useState({
    album_id: '',
    image_url: '',
    caption: '',
    display_order: 0,
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getAllAlbumsAdmin();
      setAlbums(response.data);
    } catch (error) {
      toast.error('Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAlbumFormData({ ...albumFormData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    setImageFormData({ ...imageFormData, [e.target.name]: e.target.value });
  };

  const handleAlbumSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAlbum) {
        await galleryService.updateAlbum(editingAlbum.id, albumFormData);
        toast.success('Album updated successfully');
      } else {
        await galleryService.createAlbum(albumFormData);
        toast.success('Album created successfully');
      }
      setShowAlbumModal(false);
      resetAlbumForm();
      fetchAlbums();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    try {
      await galleryService.addImage(imageFormData);
      toast.success('Image added successfully');
      setShowImageModal(false);
      resetImageForm();
      fetchAlbums();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEditAlbum = (album) => {
    setEditingAlbum(album);
    setAlbumFormData({
      title: album.title,
      description: album.description || '',
      cover_image: album.cover_image || '',
      is_published: album.is_published,
    });
    setShowAlbumModal(true);
  };

  const handleDeleteAlbum = async (id) => {
    if (window.confirm('Are you sure you want to delete this album? All images in this album will also be deleted.')) {
      try {
        await galleryService.deleteAlbum(id);
        toast.success('Album deleted successfully');
        fetchAlbums();
      } catch (error) {
        toast.error('Failed to delete album');
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await galleryService.deleteImage(imageId);
        toast.success('Image deleted successfully');
        fetchAlbums();
      } catch (error) {
        toast.error('Failed to delete image');
      }
    }
  };

  const resetAlbumForm = () => {
    setEditingAlbum(null);
    setAlbumFormData({
      title: '',
      description: '',
      cover_image: '',
      is_published: true,
    });
  };

  const resetImageForm = () => {
    setImageFormData({
      album_id: '',
      image_url: '',
      caption: '',
      display_order: 0,
    });
  };

  const openAddImageModal = (albumId) => {
    setImageFormData({ ...imageFormData, album_id: albumId });
    setShowImageModal(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
          <button
            onClick={() => {
              resetAlbumForm();
              setShowAlbumModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FaPlus /> Add Album
          </button>
        </div>

        {/* Albums Grid */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No albums found. Create your first album!
              </div>
            ) : (
              albums.map((album) => (
                <div key={album.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Album Cover */}
                  <div className="h-48 bg-gray-200 relative">
                    {album.cover_image ? (
                      <img
                        src={album.cover_image}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FaImages className="text-gray-400 text-6xl" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleEditAlbum(album)}
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                      >
                        <FaEdit className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlbum(album.id)}
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                      >
                        <FaTrash className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{album.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {album.description || 'No description'}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FaImage /> {album.image_count || 0} images
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          album.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {album.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <button
                      onClick={() => openAddImageModal(album.id)}
                      className="w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 flex items-center justify-center gap-2"
                    >
                      <FaPlus /> Add Images
                    </button>

                    {/* Show images in album */}
                    {album.images && album.images.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {album.images.slice(0, 4).map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.image_url}
                              alt={image.caption}
                              className="w-full h-16 object-cover rounded"
                            />
                            <button
                              onClick={() => handleDeleteImage(image.id)}
                              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTrash className="text-white text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Album Modal */}
        {showAlbumModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingAlbum ? 'Edit Album' : 'Add New Album'}
              </h2>
              <form onSubmit={handleAlbumSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Album Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={albumFormData.title}
                      onChange={handleAlbumChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={albumFormData.description}
                      onChange={handleAlbumChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Cover Image</label>
                    <FileUpload
                      onUploadComplete={(url) => setAlbumFormData({ ...albumFormData, cover_image: url })}
                      accept="image/*"
                      label="Upload Cover Image"
                    />
                    {albumFormData.cover_image && (
                      <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_published"
                        checked={albumFormData.is_published}
                        onChange={handleAlbumChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Published</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAlbumModal(false);
                      resetAlbumForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingAlbum ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Add Image to Album</h2>
              <form onSubmit={handleImageSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image *</label>
                    <FileUpload
                      onUploadComplete={(url) => setImageFormData({ ...imageFormData, image_url: url })}
                      accept="image/*"
                      label="Upload Image"
                    />
                    {imageFormData.image_url && (
                      <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                    <input
                      type="text"
                      name="caption"
                      value={imageFormData.caption}
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      name="display_order"
                      value={imageFormData.display_order}
                      onChange={handleImageChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImageModal(false);
                      resetImageForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Image
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
