/**
 * Main App Component
 * Application routing and structure
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { settingsService } from './services';
import { getImageUrl } from './utils/imageHelper';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Programs from './pages/Programs';
import Events from './pages/Events';
import News from './pages/News';
import ProgramDetail from './pages/ProgramDetail';
import EventDetail from './pages/EventDetail';
import NewsDetail from './pages/NewsDetail';
import Resources from './pages/Resources';
import ELearning from './pages/ELearning';
import ELearningContent from './pages/ELearningContent';
import Gallery from './pages/Gallery';
import GalleryAlbum from './pages/GalleryAlbum';
import Join from './pages/Join';
import Donate from './pages/Donate';
import DonateVerify from './pages/DonateVerify';

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminPrograms from './admin/pages/AdminPrograms';
import AdminEvents from './admin/pages/AdminEvents';
import AdminNews from './admin/pages/AdminNews';
import AdminVolunteers from './admin/pages/AdminVolunteers';
import AdminDonations from './admin/pages/AdminDonations';
import AdminMessages from './admin/pages/AdminMessages';
import AdminSettings from './admin/pages/AdminSettings';
import AdminELearning from './admin/pages/AdminELearning';
import AdminResources from './admin/pages/AdminResources';
import AdminGallery from './admin/pages/AdminGallery';

function App() {
  useEffect(() => {
    const applySiteSettings = async () => {
      try {
        const response = await settingsService.get();
        const settings = response?.data;

        if (settings?.site_title) {
          document.title = settings.site_title;
        }

        if (settings?.favicon_url) {
          const faviconHref = getImageUrl(settings.favicon_url);
          let faviconEl = document.querySelector('link[rel="icon"]');

          if (!faviconEl) {
            faviconEl = document.createElement('link');
            faviconEl.setAttribute('rel', 'icon');
            document.head.appendChild(faviconEl);
          }

          faviconEl.setAttribute('type', 'image/x-icon');
          faviconEl.setAttribute('href', faviconHref);
        }
      } catch (error) {
        console.error('Error applying site settings:', error);
      }
    };

    applySiteSettings();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:slug" element={<ProgramDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/elearning" element={<ELearning />} />
        <Route path="/elearning/:categorySlug" element={<ELearningContent />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:slug" element={<GalleryAlbum />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/join" element={<Join />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donate/verify" element={<DonateVerify />} />

        {/* Admin Login (Public) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/programs"
          element={
            <ProtectedRoute>
              <AdminPrograms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <AdminNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/elearning"
          element={
            <ProtectedRoute>
              <AdminELearning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/resources"
          element={
            <ProtectedRoute>
              <AdminResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute>
              <AdminGallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/volunteers"
          element={
            <ProtectedRoute>
              <AdminVolunteers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donations"
          element={
            <ProtectedRoute>
              <AdminDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <AdminMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* Redirect /admin to dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<div className="container-custom py-16 text-center"><h1 className="text-3xl font-bold">404 - Page Not Found</h1></div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
