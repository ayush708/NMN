/**
 * Admin News Page
 * Full CRUD for news articles
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import FileUpload from '../components/FileUpload';
import { newsService } from '../../services';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';

const AdminNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image_url: '',
    category: 'news',
    is_featured: false,
    is_published: true,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getAllAdmin();
      setNewsList(response.data);
    } catch (error) {
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await newsService.update(editingNews.id, formData);
        toast.success('News updated successfully');
      } else {
        await newsService.create(formData);
        toast.success('News created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchNews();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      summary: news.summary || '',
      content: news.content,
      image_url: news.image_url || '',
      category: news.category,
      is_featured: news.is_featured,
      is_published: news.is_published,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await newsService.delete(id);
        toast.success('News deleted successfully');
        fetchNews();
      } catch (error) {
        toast.error('Failed to delete news');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      image_url: '',
      category: 'news',
      is_featured: false,
      is_published: true,
    });
    setEditingNews(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Add Button */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage News</h1>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }} 
            className="btn btn-primary flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 w-full sm:w-auto min-h-10 text-sm sm:text-base"
          >
            <FaPlus size={16} /> Add Article
          </button>
        </div>

        {/* Table Wrapper with Responsive Scroll */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Views</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newsList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-3 sm:px-6 py-8 text-center text-gray-500 text-sm sm:text-base">
                      No news articles found. Create your first article!
                    </td>
                  </tr>
                ) : (
                  newsList.map((news) => (
                    <tr key={news.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <div className="font-medium text-gray-900 line-clamp-1">{news.title}</div>
                        <div className="text-gray-500 text-xs line-clamp-1">{news.summary?.substring(0, 50)}...</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                          {news.category}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <FaEye size={12} className="sm:size-4" /> {news.views}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell whitespace-nowrap">
                        {new Date(news.published_date).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm">
                        {news.is_published ? (
                          <span className="text-green-600 font-medium text-xs sm:text-sm">Published</span>
                        ) : (
                          <span className="text-gray-500 text-xs sm:text-sm">Draft</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(news)} 
                            className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(news.id)} 
                            className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal - Improved for mobile */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-t-lg sm:rounded-lg w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl sm:shadow-2xl">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editingNews ? 'Edit News Article' : 'Create News Article'}
                  </h2>
                  <button
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="text-gray-400 hover:text-gray-600 p-2"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input w-full" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Summary</label>
                    <textarea name="summary" value={formData.summary} onChange={handleChange} rows="2" className="input w-full" placeholder="Brief summary for listing pages" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Content *</label>
                    <textarea name="content" value={formData.content} onChange={handleChange} required rows="6" className="input w-full" placeholder="Full article content" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Upload Image</label>
                    <FileUpload
                      onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                      accept="image/*"
                      label="Upload Image"
                    />
                    {formData.image_url && (
                      <p className="text-sm text-green-600 mt-2 font-medium">✓ Image uploaded</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="input w-full">
                      <option value="news">News</option>
                      <option value="press-release">Press Release</option>
                      <option value="announcement">Announcement</option>
                      <option value="update">Update</option>
                    </select>
                  </div>

                  <div className="space-y-3 sm:flex sm:gap-6">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">Featured Article</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">Published</span>
                    </label>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6 pt-4 border-t">
                    <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 sm:px-6 py-2.5 min-h-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4 sm:px-6 py-2.5 min-h-10 font-medium text-sm">
                      {editingNews ? 'Update' : 'Create'} Article
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNews;
