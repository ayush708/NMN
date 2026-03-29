/**
 * Header Component
 * Main navigation for public website
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHeart } from 'react-icons/fa';
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

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.04)] border-b border-gray-200/50'
          : 'bg-white/60 backdrop-blur-xl border-b border-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-20 lg:h-[88px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            {settings?.logo_url ? (
              <img
                src={getImageUrl(settings.logo_url)}
                alt="NMN Logo"
                width="40"
                height="40"
                loading="eager"
                decoding="async"
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <span className="text-white font-bold text-sm">NMN</span>
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {settings?.site_title || 'National Migrant Network'}
              </p>
              {settings?.site_tagline && (
                <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{settings.site_tagline}</p>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-2 rounded-xl text-[15px] font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-primary-700 bg-primary-50/80'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              to="/donate"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <FaHeart size={11} /> Donate
            </Link>
            <Link
              to="/join"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Join Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl text-gray-500 hover:bg-gray-100/80 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-100/80 py-4 pb-5">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-primary-700 bg-primary-50/80'
                      : 'text-gray-600 hover:bg-gray-50/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 px-1 flex flex-col gap-2.5">
              <Link to="/donate" onClick={() => setIsOpen(false)} className="btn btn-secondary w-full justify-center">
                <FaHeart size={12} /> Donate
              </Link>
              <Link to="/join" onClick={() => setIsOpen(false)} className="btn btn-primary w-full justify-center">
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
