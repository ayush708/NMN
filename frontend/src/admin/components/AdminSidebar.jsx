/**
 * Admin Sidebar
 * Navigation sidebar for admin dashboard
 */

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
  FaUserCircle,
} from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Programs', path: '/admin/programs', icon: FaProjectDiagram },
    { name: 'Events', path: '/admin/events', icon: FaCalendarAlt },
    { name: 'News', path: '/admin/news', icon: FaNewspaper },
    { name: 'E-Learning', path: '/admin/elearning', icon: FaBook },
    { name: 'Resources', path: '/admin/resources', icon: FaFileAlt },
    { name: 'Gallery', path: '/admin/gallery', icon: FaImages },
    { name: 'Volunteers', path: '/admin/volunteers', icon: FaUsers },
    { name: 'Messages', path: '/admin/messages', icon: FaEnvelope },
    { name: 'Profile', path: '/admin/profile', icon: FaUserCircle },
    { name: 'Settings', path: '/admin/settings', icon: FaCog },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold">NMN Admin</h2>
        <p className="text-sm text-gray-400">Dashboard</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 transition-colors ${
              isActive(item.path)
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <item.icon className="mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
