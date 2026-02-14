/**
 * Public Programs Page
 * Display all published programs
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { programService } from '../services';
import { getImageUrl } from '../utils/imageHelper';

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
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold">Our Programs</h1>
          <p className="text-xl mt-2">Making a difference in migrant workers' lives</p>
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="bg-gray-50 border-b">
        <div className="container-custom py-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Programs
            </button>
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'ongoing'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'upcoming'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="container-custom py-16">
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No {filter !== 'all' ? filter : ''} programs available yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Link
                key={program.id}
                to={`/programs/${program.slug}`}
                className="card overflow-hidden hover:scale-105 transition"
              >
                {program.image_url && (
                  <img
                    src={getImageUrl(program.image_url)}
                    alt={program.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        program.status === 'ongoing'
                          ? 'bg-green-100 text-green-800'
                          : program.status === 'completed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {program.status}
                    </span>
                    {program.is_featured && (
                      <span className="text-yellow-500">★ Featured</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{program.description}</p>
                  {program.location && (
                    <p className="text-sm text-gray-500 mt-2">📍 {program.location}</p>
                  )}
                  {program.beneficiaries && (
                    <p className="text-sm text-gray-500">
                      👥 {program.beneficiaries} beneficiaries
                    </p>
                  )}
                  <div className="mt-4 text-primary-600 font-medium">
                    Learn More →
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
