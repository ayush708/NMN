import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { contactService } from '../../services';
import { toast } from 'react-toastify';
import { FaEnvelope, FaEnvelopeOpen, FaTrash } from 'react-icons/fa';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = filter === 'all' ? {} : { is_read: filter === 'read' };
      const response = await contactService.getAllMessages(params);
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (message) => {
    setSelectedMessage(message);
    setShowModal(true);

    // Mark as read if unread
    if (!message.is_read) {
      handleMarkAsRead(message.id);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactService.markAsRead(id);
      fetchMessages();
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactService.deleteMessage(id);
        toast.success('Message deleted successfully');
        fetchMessages();
        if (showModal) setShowModal(false);
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
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
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg ${filter === 'unread' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg ${filter === 'read' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
            >
              Read
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr
                    key={message.id}
                    className={`${!message.is_read ? 'bg-blue-50' : ''} hover:bg-gray-50 cursor-pointer`}
                    onClick={() => handleView(message)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {message.is_read ? (
                        <FaEnvelopeOpen className="text-gray-400" />
                      ) : (
                        <FaEnvelope className="text-blue-600" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${!message.is_read ? 'font-bold' : 'font-medium'} text-gray-900`}>
                        {message.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {message.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{message.subject || 'No subject'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(message.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
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

        {/* View Modal */}
        {showModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">Message Details</h2>
                  {selectedMessage.is_read ? (
                    <span className="text-xs text-gray-500">Read</span>
                  ) : (
                    <span className="text-xs text-blue-600 font-semibold">Unread</span>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Name:</p>
                      <p className="text-gray-900">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Email:</p>
                      <p className="text-gray-900">
                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                          {selectedMessage.email}
                        </a>
                      </p>
                    </div>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Phone:</p>
                      <p className="text-gray-900">{selectedMessage.phone}</p>
                    </div>
                  )}
                  {selectedMessage.subject && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Subject:</p>
                      <p className="text-gray-900">{selectedMessage.subject}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Message:</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      <p className="font-semibold">Received:</p>
                      <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
                    </div>
                    {selectedMessage.ip_address && (
                      <div>
                        <p className="font-semibold">IP Address:</p>
                        <p>{selectedMessage.ip_address}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Message
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
