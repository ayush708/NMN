/**
 * Home Page
 * Landing page for NMN website
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { settingsService, programService, newsService, eventService } from '../services';
import { FaArrowRight } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageHelper';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [bannersRes, statsRes, programsRes, newsRes, eventsRes] = await Promise.all([
        settingsService.getBanners(),
        settingsService.getStatistics(),
        programService.getAll({ featured: true, limit: 3 }),
        newsService.getAll({ limit: 3 }),
        eventService.getAll({ upcoming: true, limit: 3 }),
      ]);

      setBanners(bannersRes.data);
      setStatistics(statsRes.data);
      setPrograms(programsRes.data);
      setNews(newsRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          {banners.length > 0 ? (
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-4">{banners[0].title}</h1>
              <p className="text-xl mb-6">{banners[0].subtitle}</p>
              <p className="text-lg mb-8">{banners[0].description}</p>
              {banners[0].button_text && (
                <Link to={banners[0].button_link || '/'} className="btn bg-white text-primary-600 hover:bg-gray-100">
                  {banners[0].button_text} <FaArrowRight className="ml-2" />
                </Link>
              )}
            </div>
          ) : (
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-4">Empowering Migrant Workers</h1>
              <p className="text-xl mb-6">For Human Rights and Social Justice</p>
              <p className="text-lg mb-8">
                National Migrant Network works towards protecting the rights and dignity of migrant workers across the nation.
              </p>
              <Link to="/about" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Learn More <FaArrowRight className="ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      {statistics.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {stat.metric_value.toLocaleString()}+
                  </div>
                  <div className="text-gray-600">{stat.metric_label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Programs */}
      {programs.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Programs</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {programs.map((program) => (
                <Link key={program.id} to={`/programs/${program.slug}`} className="card p-6 hover:scale-105 transition">
                  {program.image_url && (
                    <img src={getImageUrl(program.image_url)} alt={program.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <span className="text-primary-600 font-medium">Learn More →</span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/programs" className="btn btn-outline">View All Programs</Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {news.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-center">Latest News</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {news.map((item) => (
                <Link key={item.id} to={`/news/${item.slug}`} className="card overflow-hidden hover:scale-105 transition">
                  {item.image_url && (
                    <img src={getImageUrl(item.image_url)} alt={item.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">{new Date(item.published_date).toLocaleDateString()}</p>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/news" className="btn btn-outline">View All News</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-8">Be part of the change. Volunteer with us today.</p>
          <Link to="/join" className="btn bg-white text-primary-600 hover:bg-gray-100">
            Become a Volunteer
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
