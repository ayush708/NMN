/**
 * Public Programs Page
 * Display all published programs
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { programService } from '../services';
import { getImageUrl } from '../utils/imageHelper';
import { FaMapMarkerAlt, FaUsers, FaChevronRight } from 'react-icons/fa';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPrograms();
  }, [filter]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const params = filter === 'all' ? {} : { status: filter };
      const response = await programService.getAll(params);
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { key: 'all', label: 'All Programs' },
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'completed', label: 'Completed' },
    { key: 'upcoming', label: 'Upcoming' },
  ];

  const statusStyles = {
    ongoing: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    completed: 'bg-gray-50 text-gray-600 border border-gray-200',
    upcoming: 'bg-blue-50 text-blue-700 border border-blue-200',
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

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary-400/15 rounded-full blur-[120px]" />
        </div>
        <div className="container-custom relative fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Our Programs</h1>
          <p className="text-lg text-primary-200 max-w-xl">Making a difference in migrant workers lives</p>
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-20 lg:top-[88px] z-30">
        <div className="container-custom py-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  filter === f.key
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="container-custom py-16">
        {programs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">0</span>
            </div>
            <p className="text-lg text-gray-500 font-medium">
              No {filter !== 'all' ? filter : ''} programs available yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {programs.map((program, index) => (
              <Link
                key={program.id}
                to={`/programs/${program.slug}`}
                className="card card-hover group overflow-hidden fade-in-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}
                <div className="p-7">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusStyles[program.status] || 'bg-gray-50 text-gray-600'}`}>
                      {program.status}
                    </span>
                    {program.is_featured && (
                      <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">Featured</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary-700 transition-colors">{program.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{program.description}</p>
                  <div className="space-y-1.5">
                    {program.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <FaMapMarkerAlt size={10} /> {program.location}
                      </p>
                    )}
                    {program.beneficiaries && (
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <FaUsers size={10} /> {program.beneficiaries} beneficiaries
                      </p>
                    )}
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-50">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all duration-300">
                      Explore Program Details <FaChevronRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Programs;
