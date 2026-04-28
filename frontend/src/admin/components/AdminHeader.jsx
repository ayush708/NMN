/**
 * Admin Header
 * Top navigation bar for admin dashboard
 */

import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
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
  '/admin/messages': 'Messages',
  '/admin/settings': 'Settings',
};

const AdminHeader = ({ onMenuClick }) => {
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
    <header className="bg-white border-b border-gray-100 px-3 sm:px-5 md:px-6 py-4 flex justify-between items-center sticky top-0 z-20 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <FaBars size={15} />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary-700">{initials}</span>
          </div>
          <div className="hidden md:block min-w-0">
            <p className="text-sm font-medium text-gray-800 leading-tight truncate">{admin?.name}</p>
            <p className="text-xs text-gray-400 leading-tight truncate">{admin?.email}</p>
          </div>
        </div>

        <div className="hidden sm:block h-6 w-px bg-gray-200" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 min-h-10 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          title="Logout"
          aria-label="Logout"
        >
          <FaSignOutAlt size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
