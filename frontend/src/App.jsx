/**
 * Main App Component
 * Application routing and structure
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SEO from './components/SEO';
import { settingsService } from './services';
import { getImageUrl } from './utils/imageHelper';
import { PUBLIC_ROUTE_SEO, ADMIN_ROUTE_SEO } from './utils/seoConfig';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Programs = lazy(() => import('./pages/Programs'));
const Events = lazy(() => import('./pages/Events'));
const News = lazy(() => import('./pages/News'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Resources = lazy(() => import('./pages/Resources'));
const ELearning = lazy(() => import('./pages/ELearning'));
const ELearningContent = lazy(() => import('./pages/ELearningContent'));
const Gallery = lazy(() => import('./pages/Gallery'));
const GalleryAlbum = lazy(() => import('./pages/GalleryAlbum'));
const Join = lazy(() => import('./pages/Join'));
// Donate pages removed

const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminPrograms = lazy(() => import('./admin/pages/AdminPrograms'));
const AdminEvents = lazy(() => import('./admin/pages/AdminEvents'));
const AdminNews = lazy(() => import('./admin/pages/AdminNews'));
const AdminVolunteers = lazy(() => import('./admin/pages/AdminVolunteers'));
// AdminDonations removed
const AdminMessages = lazy(() => import('./admin/pages/AdminMessages'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));
const AdminELearning = lazy(() => import('./admin/pages/AdminELearning'));
const AdminResources = lazy(() => import('./admin/pages/AdminResources'));
const AdminGallery = lazy(() => import('./admin/pages/AdminGallery'));

const RouteLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 rounded-full border-[3px] border-primary-200 border-t-primary-600 animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
);

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
      <Suspense fallback={<RouteLoader />}>
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
        {/* Donate routes removed */}

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
        {/* Admin Donations removed */}
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
      </Suspense>
    </AuthProvider>
  );
}

export default App;
