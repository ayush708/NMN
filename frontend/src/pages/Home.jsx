/**
 * Home Page
 * Landing page for NMN website
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { settingsService, programService, newsService, eventService } from '../services';
import { FaArrowRight, FaChevronRight } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageHelper';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [bannersRes, statsRes, programsRes, newsRes] = await Promise.all([
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
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500">Loading…</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const hero = banners[0];

  return (
    <PublicLayout>

      {/* ─── Hero ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/15 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />

        <div className="container-custom relative py-24 md:py-32">
          <div className="max-w-3xl fade-in-up">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary-200 bg-white/10 px-4 py-1.5 rounded-full mb-6">
              National Migrant Network
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-5">
              {hero?.title || 'Empowering Migrant Workers'}
            </h1>
            <p className="text-xl text-primary-100 mb-3">
              {hero?.subtitle || 'For Human Rights and Social Justice'}
            </p>
            <p className="text-base text-primary-200/80 mb-10 max-w-xl leading-relaxed">
              {hero?.description ||
                'National Migrant Network works towards protecting the rights and dignity of migrant workers across the nation.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={hero?.button_link || '/about'}
                className="btn btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-lg"
              >
                {hero?.button_text || 'Learn More'} <FaArrowRight size={14} />
              </Link>
              <Link to="/join" className="btn border border-white/30 text-white hover:bg-white/10">
                Join Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Statistics ────────────────────────────── */}
      {statistics.length > 0 && (
        <section className="py-14 bg-white border-b border-gray-100">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div
                  key={stat.id}
                  className="text-center scale-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="text-4xl font-bold text-primary-600 mb-1 tabular-nums">
                    {stat.metric_value.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{stat.metric_label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured Programs ──────────────────────── */}
      {programs.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container-custom">
            <div className="text-center mb-12 fade-in-up">
              <span className="section-tag">What We Do</span>
              <h2 className="section-title">Our Programs</h2>
              <p className="section-subtitle">
                Initiatives designed to protect, empower, and uplift migrant communities.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <Link
                  key={program.id}
                  to={`/programs/${program.slug}`}
                  className="card group overflow-hidden fade-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {program.image_url && (
                    <div className="overflow-hidden h-48">
                      <img
                        src={getImageUrl(program.image_url)}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{program.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                      Learn More <FaChevronRight size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10 fade-in">
              <Link to="/programs" className="btn btn-outline">
                View All Programs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Latest News ───────────────────────────── */}
      {news.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12 fade-in-up">
              <span className="section-tag">Stay Informed</span>
              <h2 className="section-title">Latest News</h2>
              <p className="section-subtitle">
                Updates, stories, and insights from our work on the ground.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="card group overflow-hidden fade-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {item.image_url && (
                    <div className="overflow-hidden h-48">
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-gray-400 mb-2 font-medium">
                      {new Date(item.published_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10 fade-in">
              <Link to="/news" className="btn btn-outline">
                View All News
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ───────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-primary-700 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="container-custom text-center relative fade-in-up">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary-200 bg-white/10 px-4 py-1.5 rounded-full mb-5">
            Get Involved
          </span>
          <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg text-primary-200 mb-9 max-w-xl mx-auto">
            Be part of the change. Volunteer with us and help protect the rights of migrant workers.
          </p>
          <Link to="/join" className="btn bg-white text-primary-700 hover:bg-primary-50 shadow-lg">
            Become a Volunteer <FaArrowRight size={14} />
          </Link>
        </div>
      </section>

    </PublicLayout>
  );
};

export default Home;
