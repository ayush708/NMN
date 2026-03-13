/**
 * Admin Settings Page
 * Manage site configuration
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import FileUpload from '../components/FileUpload';
import { settingsService, authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formData, setFormData] = useState({
    site_title: '',
    site_tagline: '',
    logo_url: '',
    favicon_url: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    linkedin_url: '',
    youtube_url: '',
    map_embed_url: '',
    footer_text: '',
    about_text: '',
    about_image: '',
    mission: '',
    mission_image: '',
    vision: '',
    vision_image: '',
    values: '',
    values_image: '',
  });

  useEffect(() => {
    fetchSettings();
    fetchStatistics();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      setProfileForm({
        name: response?.data?.name || '',
        email: response?.data?.email || '',
      });
    } catch (error) {
      toast.error('Failed to load admin profile');
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.get();
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await settingsService.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatisticChange = (id, field, value) => {
    setStatistics(statistics.map(stat =>
      stat.id === id ? { ...stat, [field]: value } : stat
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save general settings
      await settingsService.update(formData);

      // Save all statistics
      await Promise.all(
        statistics.map(stat =>
          settingsService.updateStatistic(stat.id, {
            metric_value: parseInt(stat.metric_value),
            metric_label: stat.metric_label
          })
        )
      );

      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileInputChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordInputChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);

    try {
      await authService.updateProfile(profileForm);
      await refreshProfile();
      toast.success('Admin profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update admin profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 12) {
      toast.error('New password must be at least 12 characters long');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirm password must match');
      return;
    }

    setPasswordSaving(true);

    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Site Settings</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Account</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="label">Admin Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileInputChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Admin Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileInputChange}
                  className="input"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={profileSaving}
                className="btn btn-primary"
              >
                {profileSaving ? 'Updating...' : 'Update Account'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Security</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  className="input"
                  minLength={12}
                  required
                />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="input"
                  minLength={12}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={passwordSaving}
                className="btn btn-primary"
              >
                {passwordSaving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Site Title</label>
                <input
                  type="text"
                  name="site_title"
                  value={formData.site_title}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Site Tagline</label>
                <input
                  type="text"
                  name="site_tagline"
                  value={formData.site_tagline || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Upload Logo</label>
                <FileUpload
                  onUploadComplete={(url) => setFormData({ ...formData, logo_url: url })}
                  accept="image/*"
                  label="Upload Logo"
                />
                {formData.logo_url && (
                  <p className="text-sm text-green-600 mt-2">✓ Logo uploaded</p>
                )}
              </div>
              <div>
                <label className="label">Upload Favicon</label>
                <FileUpload
                  onUploadComplete={(url) => setFormData({ ...formData, favicon_url: url })}
                  accept="image/*,.ico"
                  label="Upload Favicon"
                />
                {formData.favicon_url && (
                  <p className="text-sm text-green-600 mt-2">✓ Favicon uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Contact Email</label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Contact Phone</label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Contact Address</label>
                <textarea
                  name="contact_address"
                  value={formData.contact_address || ''}
                  onChange={handleChange}
                  rows="2"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Facebook URL</label>
                <input
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Twitter URL</label>
                <input
                  type="url"
                  name="twitter_url"
                  value={formData.twitter_url || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Instagram URL</label>
                <input
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">YouTube URL</label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* About Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">About Information</h2>
            <div className="space-y-4">
              <div>
                <label className="label">About Text</label>
                <textarea
                  name="about_text"
                  value={formData.about_text || ''}
                  onChange={handleChange}
                  rows="3"
                  className="input"
                />
              </div>
              <div>
                <label className="label">About Section Image</label>
                <FileUpload
                  onUploadComplete={(url) => setFormData({ ...formData, about_image: url })}
                  accept="image/*"
                  label="Upload About Image"
                />
                {formData.about_image && (
                  <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
                )}
              </div>
              <div>
                <label className="label">Mission Statement</label>
                <textarea
                  name="mission"
                  value={formData.mission || ''}
                  onChange={handleChange}
                  rows="3"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Mission Image</label>
                <FileUpload
                  onUploadComplete={(url) => setFormData({ ...formData, mission_image: url })}
                  accept="image/*"
                  label="Upload Mission Image"
                />
                {formData.mission_image && (
                  <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
                )}
              </div>
              <div>
                <label className="label">Vision Statement</label>
                <textarea
                  name="vision"
                  value={formData.vision || ''}
                  onChange={handleChange}
                  rows="3"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Vision Image</label>
                <FileUpload
                  onUploadComplete={(url) => setFormData({ ...formData, vision_image: url })}
                  accept="image/*"
                  label="Upload Vision Image"
                />
                {formData.vision_image && (
                  <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
                )}
              </div>
              <div>
                <label className="label">Values</label>
                <textarea
                  name="values"
                  value={formData.values || ''}
                  onChange={handleChange}
                  rows="4"
                  className="input"
                  placeholder="List your organizational values"
                />
              </div>
              <div>
                <label className="label">Values Image</label>
                <FileUpload
                  onUploadComplete={(url) => setFormData({ ...formData, values_image: url })}
                  accept="image/*"
                  label="Upload Values Image"
                />
                {formData.values_image && (
                  <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Footer</h2>
            <div>
              <label className="label">Footer Text</label>
              <textarea
                name="footer_text"
                value={formData.footer_text || ''}
                onChange={handleChange}
                rows="2"
                className="input"
                placeholder="© 2024 National Migrant Network. All rights reserved."
              />
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Statistics (Homepage)</h2>
            <p className="text-sm text-gray-600 mb-4">
                These numbers appear on the homepage. Update them to reflect your organization&apos;s actual statistics.
            </p>
            <div className="space-y-4">
              {statistics.map((stat) => (
                <div key={stat.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label text-sm">Label</label>
                      <input
                        type="text"
                        value={stat.metric_label || ''}
                        onChange={(e) => handleStatisticChange(stat.id, 'metric_label', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label text-sm">Value</label>
                      <input
                        type="number"
                        value={stat.metric_value || 0}
                        onChange={(e) => handleStatisticChange(stat.id, 'metric_value', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary px-8"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
