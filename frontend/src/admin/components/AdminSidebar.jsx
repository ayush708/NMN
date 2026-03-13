/**
 * Admin Sidebar
 * Navigation sidebar for admin dashboard
 */

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaNewspaper,
  FaCalendarAlt,
  FaProjectDiagram,
  FaBook,
  FaImages,
  FaFileAlt,
  FaUsers,
  FaEnvelope,
  FaCog,
  FaHeart,
  FaTimes,
} from 'react-icons/fa';

const AdminSidebar = ({ isOpen = false, onClose = () => {} }) => {
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Programs', path: '/admin/programs', icon: FaProjectDiagram },
    { name: 'Events', path: '/admin/events', icon: FaCalendarAlt },
    { name: 'News', path: '/admin/news', icon: FaNewspaper },
    { name: 'E-Learning', path: '/admin/elearning', icon: FaBook },
    { name: 'Resources', path: '/admin/resources', icon: FaFileAlt },
    { name: 'Gallery', path: '/admin/gallery', icon: FaImages },
    { name: 'Volunteers', path: '/admin/volunteers', icon: FaUsers },
    { name: 'Donations',  path: '/admin/donations',  icon: FaHeart },
    { name: 'Messages',   path: '/admin/messages',   icon: FaEnvelope },
    { name: 'Settings', path: '/admin/settings', icon: FaCog },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-64 bg-gray-950 text-white fixed inset-y-0 left-0 z-50 md:z-30 flex flex-col border-r border-white/5 transform transition-transform duration-200 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">NMN</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">NMN Admin</p>
                <p className="text-xs text-gray-500 leading-tight">Control Panel</p>
              </div>
            </div>

            <button
              type="button"
              className="md:hidden text-gray-400 hover:text-white"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={15} className={active ? 'text-white' : 'text-gray-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5">
          <p className="text-xs text-gray-600">National Migrant Network</p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
