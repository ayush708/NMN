/**
 * About Page
 * Organization information
 */

import { useEffect, useState } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { settingsService } from '../services';
import { getImageUrl } from '../utils/imageHelper';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-2xl">Loading...</div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="text-xl mt-2">Learn about our mission and values</p>
        </div>
      </section>

      {/* Content */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Mission */}
          {settings?.mission && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed">{settings.mission}</p>
                </div>
                {settings.mission_image && (
                  <div>
                    <img
                      src={getImageUrl(settings.mission_image)}
                      alt="Our Mission"
                      className="rounded-lg shadow-lg w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Vision */}
          {settings?.vision && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {settings.vision_image && (
                  <div className="order-2 md:order-1">
                    <img
                      src={getImageUrl(settings.vision_image)}
                      alt="Our Vision"
                      className="rounded-lg shadow-lg w-full h-auto"
                    />
                  </div>
                )}
                <div className="order-1 md:order-2">
                  <p className="text-gray-700 text-lg leading-relaxed">{settings.vision}</p>
                </div>
              </div>
            </section>
          )}

          {/* Values */}
          {settings?.values && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{settings.values}</p>
                </div>
                {settings.values_image && (
                  <div>
                    <img
                      src={getImageUrl(settings.values_image)}
                      alt="Our Values"
                      className="rounded-lg shadow-lg w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* About Text */}
          {settings?.about_text && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {settings.about_image && (
                  <div className="order-2 md:order-1">
                    <img
                      src={getImageUrl(settings.about_image)}
                      alt="Who We Are"
                      className="rounded-lg shadow-lg w-full h-auto"
                    />
                  </div>
                )}
                <div className="order-1 md:order-2">
                  <p className="text-gray-700 text-lg leading-relaxed">{settings.about_text}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default About;
