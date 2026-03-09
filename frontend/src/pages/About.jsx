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
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-[3px] border-primary-200 border-t-primary-600 animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const sections = [
    { title: 'Our Mission', text: settings?.mission, image: settings?.mission_image, reverse: false },
    { title: 'Our Vision', text: settings?.vision, image: settings?.vision_image, reverse: true },
    { title: 'Our Values', text: settings?.values, image: settings?.values_image, reverse: false, whitespace: true },
    { title: 'Who We Are', text: settings?.about_text, image: settings?.about_image, reverse: true },
  ].filter(s => s.text);

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary-400/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[100px]" />
        </div>
        <div className="container-custom relative fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">About Us</h1>
          <p className="text-lg text-primary-200 max-w-xl">Learn about our mission, vision, and values</p>
        </div>
      </section>

      {/* Content */}
      <div className="container-custom py-20">
        <div className="max-w-5xl mx-auto space-y-24">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className="fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`grid md:grid-cols-2 gap-12 items-center ${section.reverse ? 'md:grid-flow-dense' : ''}`}>
                <div className={section.reverse ? 'md:col-start-2' : ''}>
                  <span className="section-tag">{section.title}</span>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-5">{section.title}</h2>
                  <p className={`text-gray-600 text-lg leading-relaxed ${section.whitespace ? 'whitespace-pre-line' : ''}`}>
                    {section.text}
                  </p>
                </div>
                {section.image && (
                  <div className={`${section.reverse ? 'md:col-start-1 md:row-start-1' : ''}`}>
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-br from-primary-100 to-primary-50 rounded-[2rem] -z-10 group-hover:scale-[1.02] transition-transform duration-500" />
                      <img
                        src={getImageUrl(section.image)}
                        alt={section.title}
                        className="rounded-3xl shadow-card w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default About;
