/**
 * Admin Header
 * Top navigation bar for admin dashboard
 */

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminHeader = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FaUserCircle className="text-2xl text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-800">{admin?.name}</p>
            <p className="text-xs text-gray-500">{admin?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
