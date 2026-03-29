/**
 * Home Page
 * Landing page for NMN website
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { settingsService, programService, newsService } from '../services';
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
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-[3px] border-primary-200 border-t-primary-600 animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const hero = banners[0];

  return (
    <PublicLayout>

      {/* ─── Hero ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.07]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-[200px] h-[200px] bg-purple-400/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container-custom relative py-28 md:py-36 lg:py-40">
          <div className="max-w-3xl fade-in-up">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary-200 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              National Migrant Network
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
              {hero?.title || 'Empowering Migrant Workers'}
            </h1>
            <p className="text-xl md:text-2xl text-primary-100/90 mb-3 font-light">
              {hero?.subtitle || 'For Human Rights and Social Justice'}
            </p>
            <p className="text-base text-primary-200/60 mb-10 max-w-xl leading-relaxed">
              {hero?.description ||
                'National Migrant Network works towards protecting the rights and dignity of migrant workers across the nation.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={hero?.button_link || '/about'}
                className="btn bg-white text-primary-800 hover:bg-primary-50 shadow-elevated hover:shadow-xl px-8"
              >
                {hero?.button_text || 'Learn More'} <FaArrowRight size={13} />
              </Link>
              <Link to="/join" className="btn border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-md px-8">
                Join Us
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* ─── Statistics ────────────────────────────── */}
      {statistics.length > 0 && (
        <section className="relative -mt-16 z-10 pb-12">
          <div className="container-custom">
            <div className="bg-white rounded-3xl shadow-elevated border border-gray-100/80 p-8 md:p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {statistics.map((stat, index) => (
                  <div key={stat.id} className="text-center scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2 tabular-nums">
                      {stat.metric_value.toLocaleString()}+
                    </div>
                    <div className="text-sm text-gray-500 font-medium">{stat.metric_label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured Programs ──────────────────────── */}
      {programs.length > 0 && (
        <section className="py-24">
          <div className="container-custom">
            <div className="text-center mb-14 fade-in-up">
              <span className="section-tag">What We Do</span>
              <h2 className="section-title">Our Programs</h2>
              <p className="section-subtitle">Initiatives designed to protect, empower, and uplift migrant communities.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-7">
              {programs.map((program, index) => (
                <Link key={program.id} to={`/programs/${program.slug}`} className="card card-hover group overflow-hidden fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                  {program.image_url && (
                    <div className="overflow-hidden h-52 relative">
                      <img
                        src={getImageUrl(program.image_url)}
                        alt={program.title}
                        width="640"
                        height="416"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}
                  <div className="p-7">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">{program.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">{program.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all duration-300">
                      Learn More <FaChevronRight size={10} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12 fade-in">
              <Link to="/programs" className="btn btn-outline px-8">View All Programs</Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Latest News ───────────────────────────── */}
      {news.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container-custom">
            <div className="text-center mb-14 fade-in-up">
              <span className="section-tag">Stay Informed</span>
              <h2 className="section-title">Latest News</h2>
              <p className="section-subtitle">Updates, stories, and insights from our work on the ground.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-7">
              {news.map((item, index) => (
                <Link key={item.id} to={`/news/${item.slug}`} className="card card-hover group overflow-hidden fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                  {item.image_url && (
                    <div className="overflow-hidden h-52 relative">
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.title}
                        width="640"
                        height="416"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">
                      {new Date(item.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary-700 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12 fade-in">
              <Link to="/news" className="btn btn-outline px-8">View All News</Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ───────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-400/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[100px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="container-custom text-center relative fade-in-up">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary-200 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-6 border border-white/10">Get Involved</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">Join Our Mission</h2>
          <p className="text-lg text-primary-200/80 mb-10 max-w-xl mx-auto leading-relaxed">Be part of the change. Volunteer with us and help protect the rights of migrant workers.</p>
          <Link to="/join" className="btn bg-white text-primary-800 hover:bg-primary-50 shadow-elevated px-8 py-3.5 text-base">
            Become a Volunteer <FaArrowRight size={14} />
          </Link>
        </div>
      </section>

    </PublicLayout>
  );
};

export default Home;
