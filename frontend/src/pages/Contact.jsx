/**
 * Contact Page
 * Contact form and information
 */

import { useState, useEffect } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { contactService, settingsService } from '../services';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactService.submit(formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-xl mt-2">Get in touch with us</p>
        </div>
      </section>

      {/* Contact Form */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="input"
                  ></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-full">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                {settings?.contact_address && (
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-gray-600">{settings.contact_address}</p>
                  </div>
                )}
                {settings?.contact_email && (
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-gray-600">
                      <a href={`mailto:${settings.contact_email}`} className="text-primary-600 hover:underline">
                        {settings.contact_email}
                      </a>
                    </p>
                  </div>
                )}
                {settings?.contact_phone && (
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-gray-600">
                      <a href={`tel:${settings.contact_phone}`} className="text-primary-600 hover:underline">
                        {settings.contact_phone}
                      </a>
                    </p>
                  </div>
                )}

                {/* Social Media Links */}
                {(settings?.facebook_url || settings?.twitter_url || settings?.instagram_url || settings?.linkedin_url) && (
                  <div>
                    <h3 className="font-semibold mb-2">Follow Us</h3>
                    <div className="flex space-x-4">
                      {settings.facebook_url && (
                        <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          Facebook
                        </a>
                      )}
                      {settings.twitter_url && (
                        <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                          Twitter
                        </a>
                      )}
                      {settings.instagram_url && (
                        <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                          Instagram
                        </a>
                      )}
                      {settings.linkedin_url && (
                        <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;
