/**
 * Admin Header
 * Top navigation bar for admin dashboard
 */

import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/programs': 'Programs',
  '/admin/events': 'Events',
  '/admin/news': 'News',
  '/admin/elearning': 'E-Learning',
  '/admin/resources': 'Resources',
  '/admin/gallery': 'Gallery',
  '/admin/volunteers': 'Volunteers',
  '/admin/donations':  'Donations',
  '/admin/messages': 'Messages',
  '/admin/settings': 'Settings',
};

const AdminHeader = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || 'Admin';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const initials = admin?.name
    ? admin.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex justify-between items-center sticky top-0 z-40">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-700">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">{admin?.name}</p>
            <p className="text-xs text-gray-400 leading-tight">{admin?.email}</p>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Logout"
        >
          <FaSignOutAlt size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
