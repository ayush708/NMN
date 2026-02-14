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
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg text-white`}>
                  <card.icon className="text-2xl" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href="/admin/programs" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                Create New Program
              </a>
              <a href="/admin/events" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition">
                Add New Event
              </a>
              <a href="/admin/news" className="block p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
                Publish News Article
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <p className="text-gray-600">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
