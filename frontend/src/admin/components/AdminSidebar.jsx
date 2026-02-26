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
  FaHeart,
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
    { name: 'Donations',  path: '/admin/donations',  icon: FaHeart },
    { name: 'Messages',   path: '/admin/messages',   icon: FaEnvelope },
    { name: 'Settings', path: '/admin/settings', icon: FaCog },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-gray-950 text-white min-h-screen fixed left-0 top-0 flex flex-col border-r border-white/5">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">NMN</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">NMN Admin</p>
            <p className="text-xs text-gray-500 leading-tight">Control Panel</p>
          </div>
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
  );
};

export default AdminSidebar;
