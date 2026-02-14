/**
 * Admin Volunteers Page
 * View and manage volunteer applications
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { volunteerService } from '../../services';
import { toast } from 'react-toastify';
import { FaCheck, FaTrash, FaEye } from 'react-icons/fa';

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await volunteerService.getAll();
      setVolunteers(response.data);
    } catch (error) {
      toast.error('Failed to fetch volunteers');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await volunteerService.getById(id);
      setSelectedVolunteer(response.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to fetch volunteer details');
    }
  };

  const handleApprove = async (id) => {
    try {
      await volunteerService.approve(id);
      toast.success('Volunteer approved successfully');
      fetchVolunteers();
    } catch (error) {
      toast.error('Failed to approve volunteer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer application?')) {
      try {
        await volunteerService.delete(id);
        toast.success('Volunteer deleted successfully');
        fetchVolunteers();
      } catch (error) {
        toast.error('Failed to delete volunteer');
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
          <h1 className="text-3xl font-bold">Volunteer Applications</h1>
          <div className="text-sm text-gray-600">
            Total Applications: {volunteers.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No volunteer applications yet.
                  </td>
                </tr>
              ) : (
                volunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {volunteer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {volunteer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {volunteer.city || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {volunteer.is_approved ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(volunteer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleView(volunteer.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {!volunteer.is_approved && (
                        <button
                          onClick={() => handleApprove(volunteer.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(volunteer.id)}
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
        {showModal && selectedVolunteer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Volunteer Application Details</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Name:</p>
                      <p className="text-gray-900">{selectedVolunteer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Email:</p>
                      <p className="text-gray-900">{selectedVolunteer.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Phone:</p>
                      <p className="text-gray-900">{selectedVolunteer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Date of Birth:</p>
                      <p className="text-gray-900">{selectedVolunteer.date_of_birth ? new Date(selectedVolunteer.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Address:</p>
                    <p className="text-gray-900">{selectedVolunteer.address || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">City:</p>
                      <p className="text-gray-900">{selectedVolunteer.city || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">State:</p>
                      <p className="text-gray-900">{selectedVolunteer.state || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Country:</p>
                      <p className="text-gray-900">{selectedVolunteer.country || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Occupation:</p>
                      <p className="text-gray-900">{selectedVolunteer.occupation || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Organization:</p>
                      <p className="text-gray-900">{selectedVolunteer.organization || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Skills:</p>
                    <p className="text-gray-900">{selectedVolunteer.skills || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Experience:</p>
                    <p className="text-gray-900">{selectedVolunteer.experience || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Availability:</p>
                    <p className="text-gray-900">{selectedVolunteer.availability || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Motivation:</p>
                    <p className="text-gray-900">{selectedVolunteer.motivation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">How did they hear about us:</p>
                    <p className="text-gray-900">{selectedVolunteer.how_heard || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Applied on:</p>
                    <p className="text-gray-900">{new Date(selectedVolunteer.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  {!selectedVolunteer.is_approved && (
                    <button
                      onClick={() => {
                        handleApprove(selectedVolunteer.id);
                        setShowModal(false);
                      }}
                      className="btn bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
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

export default AdminVolunteers;
