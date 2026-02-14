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
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage News</h1>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary flex items-center">
            <FaPlus className="mr-2" /> Add News Article
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newsList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No news articles found. Create your first article!
                  </td>
                </tr>
              ) : (
                newsList.map((news) => (
                  <tr key={news.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{news.title}</div>
                      <div className="text-sm text-gray-500">{news.summary?.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {news.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <FaEye className="inline mr-1" /> {news.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(news.published_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {news.is_published ? (
                        <span className="text-green-500 font-semibold">Published</span>
                      ) : (
                        <span className="text-gray-500">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEdit(news)} className="text-blue-600 hover:text-blue-900 mr-4">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(news.id)} className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingNews ? 'Edit News Article' : 'Create News Article'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input" />
                  </div>
                  <div>
                    <label className="label">Summary</label>
                    <textarea name="summary" value={formData.summary} onChange={handleChange} rows="2" className="input" placeholder="Brief summary for listing pages" />
                  </div>
                  <div>
                    <label className="label">Content *</label>
                    <textarea name="content" value={formData.content} onChange={handleChange} required rows="8" className="input" placeholder="Full article content" />
                  </div>
                  <div>
                    <label className="label">Upload Image</label>
                    <FileUpload
                      onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                      accept="image/*"
                      label="Upload Image"
                    />
                    {formData.image_url && (
                      <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="input">
                      <option value="news">News</option>
                      <option value="press-release">Press Release</option>
                      <option value="announcement">Announcement</option>
                      <option value="update">Update</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="mr-2" />
                      Featured Article
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="mr-2" />
                      Published
                    </label>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
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
