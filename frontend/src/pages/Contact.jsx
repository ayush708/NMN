/**
 * Contact Page
 * Contact form and information
 */

import { useState, useEffect } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { contactService, settingsService } from '../services';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane } from 'react-icons/fa';

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
  const [errors, setErrors] = useState({});

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
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    setLoading(true);
    try {
      await contactService.submit(formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary-400/15 rounded-full blur-[120px]" />
        </div>
        <div className="container-custom relative fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Contact Us</h1>
          <p className="text-lg text-primary-200 max-w-xl">Get in touch with us</p>
        </div>
      </section>

      {/* Contact Content */}
      <div className="container-custom py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10">
            {/* Contact Form */}
            <div className="md:col-span-3">
              <div className="card p-8">
                <h2 className="text-2xl font-extrabold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required
                        className={`input ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : ''}`} />
                      {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required
                        className={`input ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : ''}`} />
                      {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input" />
                    </div>
                    <div>
                      <label className="label">Subject <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="input" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="5"
                      className={`input resize-none ${errors.message ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : ''}`}></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.message}</p>}
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5">
                    {loading ? 'Sending...' : <><FaPaperPlane size={13} /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-2 space-y-5">
              <div className="card p-7">
                <h3 className="text-lg font-extrabold mb-5">Contact Information</h3>
                <div className="space-y-5">
                  {settings?.contact_address && (
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                        <FaMapMarkerAlt className="text-primary-600" size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Address</p>
                        <p className="text-sm text-gray-700">{settings.contact_address}</p>
                      </div>
                    </div>
                  )}
                  {settings?.contact_email && (
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                        <FaEnvelope className="text-primary-600" size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                        <a href={`mailto:${settings.contact_email}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">{settings.contact_email}</a>
                      </div>
                    </div>
                  )}
                  {settings?.contact_phone && (
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                        <FaPhone className="text-primary-600" size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Phone</p>
                        <a href={`tel:${settings.contact_phone}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">{settings.contact_phone}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social */}
              {(settings?.facebook_url || settings?.twitter_url || settings?.instagram_url || settings?.linkedin_url) && (
                <div className="card p-7">
                  <h3 className="text-lg font-extrabold mb-4">Follow Us</h3>
                  <div className="flex gap-2.5">
                    {settings.facebook_url && (
                      <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                        <FaFacebook size={16} />
                      </a>
                    )}
                    {settings.twitter_url && (
                      <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 hover:bg-sky-100 transition-colors">
                        <FaTwitter size={16} />
                      </a>
                    )}
                    {settings.instagram_url && (
                      <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors">
                        <FaInstagram size={16} />
                      </a>
                    )}
                    {settings.linkedin_url && (
                      <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors">
                        <FaLinkedin size={16} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;
