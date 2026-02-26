/**
 * Header Component
 * Main navigation for public website
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { settingsService } from '../../services';
import { getImageUrl } from '../../utils/imageHelper';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchSettings();
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'E-Learning', path: '/elearning' },
    { name: 'News', path: '/news' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Resources', path: '/resources' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            {settings?.logo_url ? (
              <img src={getImageUrl(settings.logo_url)} alt="NMN Logo" className="h-10 w-auto" />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">NMN</span>
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {settings?.site_title || 'National Migrant Network'}
              </p>
              {settings?.site_tagline && (
                <p className="text-xs text-gray-500 leading-tight">{settings.site_tagline}</p>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/donate" className="btn btn-secondary text-sm py-2 px-4">
              Donate
            </Link>
            <Link to="/join" className="btn btn-primary text-sm py-2 px-5">
              Join Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 pb-4">
            <nav className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-3 px-1 flex flex-col gap-2">
              <Link
                to="/donate"
                onClick={() => setIsOpen(false)}
                className="btn btn-secondary w-full"
              >
                Donate
              </Link>
              <Link
                to="/join"
                onClick={() => setIsOpen(false)}
                className="btn btn-primary w-full"
              >
                Join Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
