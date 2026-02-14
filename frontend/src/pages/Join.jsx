/**
 * Join Us / Volunteer Application Page
 * Volunteer registration form
 */

import { useState } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { volunteerService } from '../services';
import { toast } from 'react-toastify';

const Join = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    date_of_birth: '',
    occupation: '',
    organization: '',
    skills: '',
    experience: '',
    availability: '',
    motivation: '',
    how_heard: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await volunteerService.submit(formData);
      toast.success('Application submitted successfully! We will review it soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        date_of_birth: '',
        occupation: '',
        organization: '',
        skills: '',
        experience: '',
        availability: '',
        motivation: '',
        how_heard: '',
      });
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Join Us as a Volunteer</h1>
          <p className="text-xl mt-2">Make a difference in migrant workers' lives</p>
        </div>
      </section>

      {/* Form Section */}
      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Volunteer Application Form</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-600">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
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
                    <label className="label">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-600">Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="label">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">State/Province</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-600">Professional Background</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Volunteer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-600">Volunteer Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Skills & Expertise</label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      rows="3"
                      className="input"
                      placeholder="e.g., Legal knowledge, Teaching, Social work..."
                    />
                  </div>
                  <div>
                    <label className="label">Relevant Experience</label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      rows="3"
                      className="input"
                      placeholder="Describe any relevant volunteer or work experience"
                    />
                  </div>
                  <div>
                    <label className="label">Availability</label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Weekends, Evenings, Full-time..."
                    />
                  </div>
                  <div>
                    <label className="label">Why do you want to volunteer with us?</label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      rows="4"
                      className="input"
                      placeholder="Tell us about your motivation to join us"
                    />
                  </div>
                  <div>
                    <label className="label">How did you hear about us?</label>
                    <input
                      type="text"
                      name="how_heard"
                      value={formData.how_heard}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Social media, Friend, Website..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">What happens after you apply?</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>We'll review your application within 2-3 business days</li>
              <li>Our team will contact you via email or phone</li>
              <li>You'll be invited for an orientation session</li>
              <li>Start making a difference in the community!</li>
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Join;
