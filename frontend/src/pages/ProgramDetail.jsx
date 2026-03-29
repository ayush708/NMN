/**
 * Program Detail Page
 * Display single program details
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { programService } from '../services';
import { getImageUrl } from '../utils/imageHelper';
import { FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';

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

  const statusStyles = {
    ongoing: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    completed: 'bg-gray-100 text-gray-600 border border-gray-200',
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

  if (!program) {
    return (
      <PublicLayout>
        <div className="container-custom py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Program Not Found</h1>
          <Link to="/programs" className="text-primary-600 hover:underline inline-flex items-center gap-2">
            <FaArrowLeft size={12} /> Back to Programs
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-custom py-10">
        <Link to="/programs" className="text-primary-600 hover:text-primary-700 mb-8 inline-flex items-center gap-2 text-sm font-semibold group">
          <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" /> Back to Programs
        </Link>

        <div className="max-w-4xl mx-auto">
          {program.image_url && (
            <div className="rounded-3xl overflow-hidden mb-8 shadow-card">
              <img
                src={getImageUrl(program.image_url)}
                alt={program.title}
                width="1280"
                height="720"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-80 md:h-96 object-cover"
              />
            </div>
          )}

          <div className="mb-5">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${statusStyles[program.status] || 'bg-gray-100 text-gray-600'}`}>
              {program.status}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-6">{program.title}</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {program.location && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <FaMapMarkerAlt size={12} />
                  <p className="text-xs font-semibold uppercase tracking-wide">Location</p>
                </div>
                <p className="font-bold text-gray-900 text-sm">{program.location}</p>
              </div>
            )}
            {program.start_date && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <FaCalendarAlt size={12} />
                  <p className="text-xs font-semibold uppercase tracking-wide">Start</p>
                </div>
                <p className="font-bold text-gray-900 text-sm">
                  {new Date(program.start_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {program.end_date && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <FaCalendarAlt size={12} />
                  <p className="text-xs font-semibold uppercase tracking-wide">End</p>
                </div>
                <p className="font-bold text-gray-900 text-sm">
                  {new Date(program.end_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {program.beneficiaries && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <FaUsers size={12} />
                  <p className="text-xs font-semibold uppercase tracking-wide">Beneficiaries</p>
                </div>
                <p className="font-bold text-gray-900 text-sm">{program.beneficiaries}</p>
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-extrabold mb-4">About This Program</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">{program.description}</p>

            {program.full_description && (
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
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
