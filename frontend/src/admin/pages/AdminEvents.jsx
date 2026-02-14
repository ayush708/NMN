/**
 * Admin Events Page
 * Full CRUD for events
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import FileUpload from '../components/FileUpload';
import { eventService } from '../../services';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    full_description: '',
    image_url: '',
    event_date: '',
    end_date: '',
    location: '',
    venue: '',
    registration_link: '',
    max_participants: '',
    is_featured: false,
    is_published: true,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllAdmin();
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events');
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
      const submitData = {
        ...formData,
        event_date: formData.event_date ? new Date(formData.event_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };

      if (editingEvent) {
        await eventService.update(editingEvent.id, submitData);
        toast.success('Event updated successfully');
      } else {
        await eventService.create(submitData);
        toast.success('Event created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      full_description: event.full_description || '',
      image_url: event.image_url || '',
      event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
      end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
      location: event.location || '',
      venue: event.venue || '',
      registration_link: event.registration_link || '',
      max_participants: event.max_participants || '',
      is_featured: event.is_featured,
      is_published: event.is_published,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(id);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      full_description: '',
      image_url: '',
      event_date: '',
      end_date: '',
      location: '',
      venue: '',
      registration_link: '',
      max_participants: '',
      is_featured: false,
      is_published: true,
    });
    setEditingEvent(null);
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
          <h1 className="text-3xl font-bold">Manage Events</h1>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary flex items-center">
            <FaPlus className="mr-2" /> Add New Event
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No events found. Create your first event!
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.description?.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.event_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.location || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        new Date(event.event_date) > new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {new Date(event.event_date) > new Date() ? 'Upcoming' : 'Past'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEdit(event)} className="text-blue-600 hover:text-blue-900 mr-4">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900">
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
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input" />
                  </div>
                  <div>
                    <label className="label">Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="input" />
                  </div>
                  <div>
                    <label className="label">Full Description</label>
                    <textarea name="full_description" value={formData.full_description} onChange={handleChange} rows="5" className="input" />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Event Date & Time *</label>
                      <input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required className="input" />
                    </div>
                    <div>
                      <label className="label">End Date & Time</label>
                      <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleChange} className="input" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className="input" />
                    </div>
                    <div>
                      <label className="label">Venue</label>
                      <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="input" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Registration Link</label>
                    <input type="url" name="registration_link" value={formData.registration_link} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">Max Participants</label>
                    <input type="number" name="max_participants" value={formData.max_participants} onChange={handleChange} className="input" />
                  </div>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="mr-2" />
                      Featured Event
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
                      {editingEvent ? 'Update' : 'Create'} Event
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

export default AdminEvents;
