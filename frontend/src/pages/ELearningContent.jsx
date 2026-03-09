/**
 * E-Learning Content Page
 * Display learning materials by category
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { elearningService } from '../services';
import { FaBook, FaVideo, FaFilePdf, FaEye, FaArrowLeft, FaClock } from 'react-icons/fa';

const ELearningContent = () => {
  const { categorySlug } = useParams();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, [categorySlug]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await elearningService.getContentsByCategory(categorySlug);
      setContents(response.data);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentIcon = (type) => {
    if (type === 'video') return <FaVideo className="text-red-500" size={14} />;
    if (type === 'pdf') return <FaFilePdf className="text-blue-500" size={14} />;
    return <FaBook className="text-emerald-500" size={14} />;
  };

  const typeStyles = {
    video: 'bg-red-50 text-red-700 border-red-200',
    pdf: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const difficultyStyles = {
    beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
    advanced: 'bg-red-50 text-red-700 border-red-200',
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
      <div className="container-custom py-10">
        <Link to="/elearning" className="text-primary-600 hover:text-primary-700 mb-8 inline-flex items-center gap-2 text-sm font-semibold group">
          <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" /> Back to Categories
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-10">Learning Materials</h1>

        {contents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaBook className="text-gray-400" size={20} />
            </div>
            <p className="text-lg text-gray-500 font-medium">Learning materials will be added soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {contents.map((content, index) => (
              <Link
                key={content.id}
                to={`/elearning/content/${content.slug}`}
                className="card card-hover group p-7 fade-in-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex items-center flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${typeStyles[content.content_type] || 'bg-primary-50 text-primary-700 border-primary-200'}`}>
                    {getContentIcon(content.content_type)}
                    {content.content_type}
                  </span>
                  {content.difficulty_level && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${difficultyStyles[content.difficulty_level] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {content.difficulty_level}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">{content.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{content.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                  {content.duration && (
                    <span className="flex items-center gap-1.5">
                      <FaClock size={10} /> {content.duration} min
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <FaEye size={10} /> {content.views} views
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default ELearningContent;
