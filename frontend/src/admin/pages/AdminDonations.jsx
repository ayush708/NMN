/**
 * Admin Donations Page
 * View and manage all donations
 */

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaEye, FaRupeeSign, FaFilter } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_STYLES = {
  completed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  failed:    'bg-red-100 text-red-700',
};

const GATEWAY_STYLES = {
  khalti: 'bg-purple-100 text-purple-700',
  esewa:  'bg-emerald-100 text-emerald-700',
};

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filterStatus,  setFilterStatus]  = useState('');
  const [filterGateway, setFilterGateway] = useState('');

  const [selected, setSelected]     = useState(null);
  const [showModal, setShowModal]   = useState(false);

  const getToken = () => localStorage.getItem('token');

  const fetchDonations = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: p, limit: 15 });
      if (filterStatus)  params.append('status',  filterStatus);
      if (filterGateway) params.append('gateway', filterGateway);

      const res = await axios.get(`${API_BASE}/donate/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setDonations(res.data.data);
      setTotal(res.data.pagination?.total || 0);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setPage(p);
    } catch {
      toast.error('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterGateway]);

  useEffect(() => { fetchDonations(1); }, [fetchDonations]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donation record?')) return;
    try {
      await axios.delete(`${API_BASE}/donate/admin/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success('Donation deleted');
      fetchDonations(page);
    } catch {
      toast.error('Failed to delete donation');
    }
  };

  const totalCompleted = donations
    .filter((d) => d.status === 'completed')
    .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Donations</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} total records</p>
          </div>
          {/* Stats strip */}
          <div className="flex gap-3">
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm text-center min-w-[110px]">
              <p className="text-xs text-gray-400 mb-0.5">Total Received</p>
              <p className="text-base font-bold text-primary-600">
                Rs. {totalCompleted.toLocaleString()}
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm text-center min-w-[90px]">
              <p className="text-xs text-gray-400 mb-0.5">This Page</p>
              <p className="text-base font-bold text-gray-700">{donations.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <FaFilter size={12} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={filterGateway}
            onChange={(e) => setFilterGateway(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <option value="">All Gateways</option>
            <option value="khalti">Khalti</option>
            <option value="esewa">eSewa</option>
          </select>
          {(filterStatus || filterGateway) && (
            <button
              onClick={() => { setFilterStatus(''); setFilterGateway(''); }}
              className="text-xs text-red-500 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Loading donations…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    {['Donor', 'Amount', 'Gateway', 'Status', 'Transaction ID', 'Date', ''].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {donations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                        No donation records found.
                      </td>
                    </tr>
                  ) : (
                    donations.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-medium text-gray-900">{d.name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-400">{d.email || '—'}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-semibold text-gray-800">
                            Rs. {parseFloat(d.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${GATEWAY_STYLES[d.gateway] || 'bg-gray-100 text-gray-600'}`}>
                            {d.gateway}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[d.status] || 'bg-gray-100 text-gray-600'}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400 font-mono max-w-[140px] truncate">
                          {d.transaction_id || d.pidx || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(d.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setSelected(d); setShowModal(true); }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                              title="View details"
                            >
                              <FaEye size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <FaTrash size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchDonations(p)}
                className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Donation Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Donor Name',      value: selected.name || 'Anonymous' },
                { label: 'Email',           value: selected.email || '—' },
                { label: 'Phone',           value: selected.phone || '—' },
                { label: 'Amount',          value: `Rs. ${parseFloat(selected.amount).toLocaleString()}` },
                { label: 'Gateway',         value: selected.gateway },
                { label: 'Status',          value: selected.status },
                { label: 'Transaction ID',  value: selected.transaction_id || selected.pidx || '—' },
                { label: 'Date',            value: new Date(selected.created_at).toLocaleString() },
                { label: 'Message',         value: selected.message || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-400 shrink-0">{label}</span>
                  <span className="text-gray-800 font-medium text-right break-all">{value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => handleDelete(selected.id) || setShowModal(false)}
                className="px-4 py-2 text-sm rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDonations;
