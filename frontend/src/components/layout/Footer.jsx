/**
 * Footer Component
 * Footer for public website
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { settingsService } from '../../services';

const Footer = () => {
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

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Events', path: '/events' },
  ];

  const resources = [
    { name: 'E-Learning', path: '/elearning' },
    { name: 'Resources', path: '/resources' },
    { name: 'News', path: '/news' },
    { name: 'Gallery', path: '/gallery' },
  ];

  const socialLinks = [
    { key: 'facebook_url', icon: FaFacebook, label: 'Facebook' },
    { key: 'twitter_url', icon: FaTwitter, label: 'Twitter' },
    { key: 'instagram_url', icon: FaInstagram, label: 'Instagram' },
    { key: 'linkedin_url', icon: FaLinkedin, label: 'LinkedIn' },
    { key: 'youtube_url', icon: FaYoutube, label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-950 text-white mt-24">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="container-custom pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">NMN</span>
              </div>
              <p className="font-bold text-white text-sm leading-tight">
                {settings?.site_title || 'National Migrant Network'}
              </p>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {settings?.about_text ||
                'Empowering migrant workers for human rights and social justice.'}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ key, icon: Icon, label }) =>
                settings?.[key] ? (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Quick Links
            </p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Resources
            </p>
            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Contact Us
            </p>
            <ul className="space-y-2.5">
              {settings?.contact_email && (
                <li>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings?.contact_phone && (
                <li>
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings?.contact_address && (
                <li className="text-sm text-gray-400 leading-relaxed">
                  {settings.contact_address}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">
            {settings?.footer_text ||
              `© ${new Date().getFullYear()} National Migrant Network. All rights reserved.`}
          </p>
          <Link
            to="/join"
            className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
          >
            Become a Volunteer →
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
