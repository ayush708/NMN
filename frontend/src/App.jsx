/**
 * Main App Component
 * Application routing and structure
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SEO from './components/SEO';
import { settingsService } from './services';
import { getImageUrl } from './utils/imageHelper';
import { PUBLIC_ROUTE_SEO, ADMIN_ROUTE_SEO } from './utils/seoConfig';

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
        <Route path="/" element={<><SEO {...PUBLIC_ROUTE_SEO.home} /><Home /></>} />
        <Route path="/about" element={<><SEO {...PUBLIC_ROUTE_SEO.about} /><About /></>} />
        <Route path="/programs" element={<><SEO {...PUBLIC_ROUTE_SEO.programs} /><Programs /></>} />
        <Route path="/programs/:slug" element={<><SEO {...PUBLIC_ROUTE_SEO.programDetail} /><ProgramDetail /></>} />
        <Route path="/events" element={<><SEO {...PUBLIC_ROUTE_SEO.events} /><Events /></>} />
        <Route path="/events/:slug" element={<><SEO {...PUBLIC_ROUTE_SEO.eventDetail} /><EventDetail /></>} />
        <Route path="/news" element={<><SEO {...PUBLIC_ROUTE_SEO.news} /><News /></>} />
        <Route path="/news/:slug" element={<><SEO {...PUBLIC_ROUTE_SEO.newsDetail} /><NewsDetail /></>} />
        <Route path="/resources" element={<><SEO {...PUBLIC_ROUTE_SEO.resources} /><Resources /></>} />
        <Route path="/elearning" element={<><SEO {...PUBLIC_ROUTE_SEO.elearning} /><ELearning /></>} />
        <Route path="/elearning/:categorySlug" element={<><SEO {...PUBLIC_ROUTE_SEO.elearningCategory} /><ELearningContent /></>} />
        <Route path="/gallery" element={<><SEO {...PUBLIC_ROUTE_SEO.gallery} /><Gallery /></>} />
        <Route path="/gallery/:slug" element={<><SEO {...PUBLIC_ROUTE_SEO.galleryAlbum} /><GalleryAlbum /></>} />
        <Route path="/contact" element={<><SEO {...PUBLIC_ROUTE_SEO.contact} /><Contact /></>} />
        <Route path="/join" element={<><SEO {...PUBLIC_ROUTE_SEO.join} /><Join /></>} />
        <Route path="/donate" element={<><SEO {...PUBLIC_ROUTE_SEO.donate} /><Donate /></>} />
        <Route path="/donate/verify" element={<><SEO {...PUBLIC_ROUTE_SEO.donateVerify} /><DonateVerify /></>} />

        {/* Admin Login (Public) */}
        <Route path="/admin/login" element={<><SEO {...ADMIN_ROUTE_SEO} title="Admin Login" /><AdminLogin /></>} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin Dashboard" />
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/admin/programs"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin Programs" />
              <ProtectedRoute>
                <AdminPrograms />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/admin/events"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin Events" />
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/admin/news"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin News" />
              <ProtectedRoute>
                <AdminNews />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/admin/elearning"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin E-Learning" />
              <ProtectedRoute>
                <AdminELearning />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/admin/resources"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin Resources" />
              <ProtectedRoute>
                <AdminResources />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin Gallery" />
              <ProtectedRoute>
                <AdminGallery />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/admin/volunteers"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin Volunteers" />
              <ProtectedRoute>
                <AdminVolunteers />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/admin/donations"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin Donations" />
              <ProtectedRoute>
                <AdminDonations />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin Messages" />
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <>
              <SEO {...ADMIN_ROUTE_SEO} title="Admin Settings" />
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            </>
          }
        />

        {/* Redirect /admin to dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<><SEO title="Page Not Found" description="The requested page could not be found on National Migrant Network." robots="noindex,follow" /><div className="container-custom py-16 text-center"><h1 className="text-3xl font-bold">404 - Page Not Found</h1></div></>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
