/**
 * E-Learning Content Page
 * Display learning materials by category
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { elearningService } from '../services';
import { FaBook, FaVideo, FaFilePdf, FaEye } from 'react-icons/fa';

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
    if (type === 'video') return <FaVideo className="text-red-600" />;
    if (type === 'pdf') return <FaFilePdf className="text-blue-600" />;
    return <FaBook className="text-green-600" />;
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
      <div className="container-custom py-16">
        <Link to="/elearning" className="text-primary-600 hover:underline mb-6 inline-block">
          ← Back to Categories
        </Link>

        <h1 className="text-4xl font-bold mb-8">Learning Materials</h1>

        {contents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Learning materials will be added soon. Check back later!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <Link
                key={content.id}
                to={`/elearning/content/${content.slug}`}
                className="card p-6 hover:shadow-xl transition"
              >
                <div className="flex items-center space-x-2 mb-3">
                  {getContentIcon(content.content_type)}
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                    {content.content_type}
                  </span>
                  {content.difficulty_level && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                      {content.difficulty_level}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{content.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{content.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  {content.duration && <span>{content.duration} min</span>}
                  <span className="flex items-center">
                    <FaEye className="mr-1" /> {content.views} views
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
