/**
 * Admin E-Learning Page
 * Full CRUD for e-learning content
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import FileUpload from '../components/FileUpload';
import { elearningService } from '../../services';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaBook, FaVideo, FaFilePdf } from 'react-icons/fa';

const AdminELearning = () => {
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    full_content: '',
    category_id: '',
    content_type: 'article',
    difficulty_level: 'beginner',
    estimated_duration: '',
    thumbnail_url: '',
    file_url: '',
    video_url: '',
    is_featured: false,
    is_published: true,
  });

  useEffect(() => {
    fetchContents();
    fetchCategories();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await elearningService.getAllAdmin();
      setContents(response.data);
    } catch (error) {
      toast.error('Failed to fetch e-learning contents');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await elearningService.getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContent) {
        await elearningService.update(editingContent.id, formData);
        toast.success('Content updated successfully');
      } else {
        await elearningService.create(formData);
        toast.success('Content created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchContents();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      description: content.description || '',
      full_content: content.full_content || '',
      category_id: content.category_id,
      content_type: content.content_type,
      difficulty_level: content.difficulty_level,
      estimated_duration: content.estimated_duration || '',
      thumbnail_url: content.thumbnail_url || '',
      file_url: content.file_url || '',
      video_url: content.video_url || '',
      is_featured: content.is_featured,
      is_published: content.is_published,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await elearningService.delete(id);
        toast.success('Content deleted successfully');
        fetchContents();
      } catch (error) {
        toast.error('Failed to delete content');
      }
    }
  };

  const resetForm = () => {
    setEditingContent(null);
    setFormData({
      title: '',
      description: '',
      full_content: '',
      category_id: '',
      content_type: 'article',
      difficulty_level: 'beginner',
      estimated_duration: '',
      thumbnail_url: '',
      file_url: '',
      video_url: '',
      is_featured: false,
      is_published: true,
    });
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaVideo className="text-red-600 text-xl" />;
      case 'pdf':
        return <FaFilePdf className="text-red-600 text-xl" />;
      default:
        return <FaBook className="text-blue-600 text-xl" />;
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">E-Learning Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FaPlus /> Add Content
          </button>
        </div>

        {/* Contents Table */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No e-learning content found. Add your first content!
                    </td>
                  </tr>
                ) : (
                  contents.map((content) => (
                    <tr key={content.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getContentTypeIcon(content.content_type)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{content.title}</div>
                        <div className="text-sm text-gray-500">{content.description?.substring(0, 50)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getCategoryName(content.category_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            content.difficulty_level === 'beginner'
                              ? 'bg-green-100 text-green-800'
                              : content.difficulty_level === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {content.difficulty_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {content.estimated_duration || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {content.view_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            content.is_published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {content.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(content)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(content.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingContent ? 'Edit Content' : 'Add New Content'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                    <textarea
                      name="full_content"
                      value={formData.full_content}
                      onChange={handleChange}
                      rows="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content Type *</label>
                      <select
                        name="content_type"
                        value={formData.content_type}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="pdf">PDF</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level *</label>
                      <select
                        name="difficulty_level"
                        value={formData.difficulty_level}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                      <input
                        type="text"
                        name="estimated_duration"
                        value={formData.estimated_duration}
                        onChange={handleChange}
                        placeholder="e.g., 30 minutes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Thumbnail Image</label>
                    <FileUpload
                      onUploadComplete={(url) => setFormData({ ...formData, thumbnail_url: url })}
                      accept="image/*"
                      label="Upload Thumbnail"
                    />
                    {formData.thumbnail_url && (
                      <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Video</label>
                    <FileUpload
                      onUploadComplete={(url) => setFormData({ ...formData, video_url: url })}
                      accept="video/*"
                      label="Upload Video"
                    />
                    {formData.video_url && (
                      <p className="text-sm text-green-600 mt-2">✓ Video uploaded</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document (PDF/DOC)</label>
                    <FileUpload
                      onUploadComplete={(url) => setFormData({ ...formData, file_url: url })}
                      accept=".pdf,.doc,.docx"
                      label="Upload Document"
                    />
                    {formData.file_url && (
                      <p className="text-sm text-green-600 mt-2">✓ Document uploaded</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_published"
                        checked={formData.is_published}
                        onChange={handleChange}
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
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingContent ? 'Update' : 'Create'}
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

export default AdminELearning;
