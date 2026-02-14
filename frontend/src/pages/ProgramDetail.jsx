/**
 * Program Detail Page
 * Display single program details
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { programService } from '../services';
import { getImageUrl } from '../utils/imageHelper';

const ProgramDetail = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgram();
  }, [slug]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await programService.getBySlug(slug);
      setProgram(response.data);
    } catch (error) {
      console.error('Error fetching program:', error);
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

  if (!program) {
    return (
      <PublicLayout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Program Not Found</h1>
          <Link to="/programs" className="text-primary-600 hover:underline">
            ← Back to Programs
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-custom py-16">
        <Link to="/programs" className="text-primary-600 hover:underline mb-6 inline-block">
          ← Back to Programs
        </Link>

        <div className="max-w-4xl mx-auto">
          {program.image_url && (
            <img
              src={getImageUrl(program.image_url)}
              alt={program.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}

          <div className="mb-4">
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                program.status === 'ongoing'
                  ? 'bg-green-100 text-green-800'
                  : program.status === 'completed'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {program.status}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{program.title}</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {program.location && (
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{program.location}</p>
              </div>
            )}
            {program.start_date && (
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold">
                  {new Date(program.start_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {program.end_date && (
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-semibold">
                  {new Date(program.end_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {program.beneficiaries && (
              <div>
                <p className="text-sm text-gray-600">Beneficiaries</p>
                <p className="font-semibold">{program.beneficiaries}</p>
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">About This Program</h2>
            <p className="text-gray-700 mb-6 text-lg">{program.description}</p>

            {program.full_description && (
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {program.full_description}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProgramDetail;
