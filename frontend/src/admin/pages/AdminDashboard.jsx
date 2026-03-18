/**
 * Admin Dashboard
 * Main dashboard with statistics
 */

import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { settingsService } from '../../services';
import {
  FaProjectDiagram,
  FaCalendarAlt,
  FaNewspaper,
  FaUsers,
  FaEnvelope,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await settingsService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Programs',
      value: stats?.programs || 0,
      icon: FaProjectDiagram,
      color: 'bg-blue-500',
    },
    {
      title: 'Events',
      value: stats?.events || 0,
      icon: FaCalendarAlt,
      color: 'bg-green-500',
    },
    {
      title: 'News Articles',
      value: stats?.news || 0,
      icon: FaNewspaper,
      color: 'bg-yellow-500',
    },
    {
      title: 'Volunteers',
      value: stats?.volunteers || 0,
      icon: FaUsers,
      color: 'bg-purple-500',
    },
    {
      title: 'Unread Messages',
      value: stats?.unreadMessages || 0,
      icon: FaEnvelope,
      color: 'bg-red-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`${card.color} p-2.5 sm:p-3 rounded-lg text-white`}>
                  <card.icon className="text-lg sm:text-2xl" />
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-600">{card.title}</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions & Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Quick Actions</h2>
            <div className="space-y-2 sm:space-y-3">
              <a href="/admin/programs" className="block p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base text-blue-900 border border-blue-200">
                Create New Program
              </a>
              <a href="/admin/events" className="block p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base text-green-900 border border-green-200">
                Add New Event
              </a>
              <a href="/admin/news" className="block p-3 sm:p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base text-yellow-900 border border-yellow-200">
                Publish News Article
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Recent Activity</h2>
            <p className="text-sm sm:text-base text-gray-600">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
