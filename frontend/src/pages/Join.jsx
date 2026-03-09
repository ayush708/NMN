/**
 * Join Us / Volunteer Application Page
 * Volunteer registration form
 */

import { useState } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { volunteerService } from '../services';
import { toast } from 'react-toastify';
import { FaUser, FaMapMarkerAlt, FaBriefcase, FaHandsHelping, FaCheckCircle } from 'react-icons/fa';

const Join = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', country: '',
    date_of_birth: '', occupation: '', organization: '', skills: '', experience: '',
    availability: '', motivation: '', how_heard: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.date_of_birth.trim()) newErrors.date_of_birth = 'Date of birth is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { toast.error('Please fill in all required fields correctly'); return; }
    setLoading(true);
    try {
      await volunteerService.submit(formData);
      toast.success('Application submitted successfully! We will review it soon.');
      setFormData({ name: '', email: '', phone: '', address: '', city: '', state: '', country: '',
        date_of_birth: '', occupation: '', organization: '', skills: '', experience: '',
        availability: '', motivation: '', how_heard: '' });
      setErrors({});
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit application. Please try again.';
      toast.error(errorMessage);
    } finally { setLoading(false); }
  };

  const inputClass = (field) => `input ${errors[field] ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10' : ''}`;

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary-400/15 rounded-full blur-[120px]" />
        </div>
        <div className="container-custom relative fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Join Us as a Volunteer</h1>
          <p className="text-lg text-primary-200 max-w-xl">Make a difference in migrant workers&apos; lives</p>
        </div>
      </section>

      {/* Form Section */}
      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 md:p-10">
            <h2 className="text-2xl font-extrabold mb-8">Volunteer Application Form</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-9 w-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <FaUser className="text-primary-600" size={13} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass('name')} />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass('email')} />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="label">Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputClass('phone')} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="label">Date of Birth *</label>
                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required className={inputClass('date_of_birth')} />
                    {errors.date_of_birth && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.date_of_birth}</p>}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-9 w-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-primary-600" size={13} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Address</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="label">Street Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="input" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-5">
                    <div>
                      <label className="label">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className="input" />
                    </div>
                    <div>
                      <label className="label">State/Province</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} className="input" />
                    </div>
                    <div>
                      <label className="label">Country</label>
                      <input type="text" name="country" value={formData.country} onChange={handleChange} className="input" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-9 w-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <FaBriefcase className="text-primary-600" size={13} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Professional Background</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Occupation</label>
                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">Organization</label>
                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="input" />
                  </div>
                </div>
              </div>

              {/* Volunteer */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-9 w-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <FaHandsHelping className="text-primary-600" size={13} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Volunteer Information</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="label">Skills & Expertise</label>
                    <textarea name="skills" value={formData.skills} onChange={handleChange} rows="3" className="input resize-none" placeholder="e.g., Legal knowledge, Teaching, Social work..." />
                  </div>
                  <div>
                    <label className="label">Relevant Experience</label>
                    <textarea name="experience" value={formData.experience} onChange={handleChange} rows="3" className="input resize-none" placeholder="Describe any relevant volunteer or work experience" />
                  </div>
                  <div>
                    <label className="label">Availability</label>
                    <input type="text" name="availability" value={formData.availability} onChange={handleChange} className="input" placeholder="e.g., Weekends, Evenings, Full-time..." />
                  </div>
                  <div>
                    <label className="label">Why do you want to volunteer with us?</label>
                    <textarea name="motivation" value={formData.motivation} onChange={handleChange} rows="4" className="input resize-none" placeholder="Tell us about your motivation to join us" />
                  </div>
                  <div>
                    <label className="label">How did you hear about us?</label>
                    <input type="text" name="how_heard" value={formData.how_heard} onChange={handleChange} className="input" placeholder="e.g., Social media, Friend, Website..." />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 text-base">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 card p-7 bg-gradient-to-br from-primary-50 to-emerald-50/50 border-primary-100/50">
            <h3 className="font-bold mb-3 text-gray-900">What happens after you apply?</h3>
            <ul className="space-y-2.5">
              {[
                'We\'ll review your application within 2-3 business days',
                'Our team will contact you via email or phone',
                'You\'ll be invited for an orientation session',
                'Start making a difference in the community!',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <FaCheckCircle className="text-primary-500 mt-0.5 shrink-0" size={13} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Join;
