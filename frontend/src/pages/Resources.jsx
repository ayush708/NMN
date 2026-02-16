/**
 * Public Resources Page
 * Display downloadable resources
 */

import { useState, useEffect } from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { resourceService } from '../services';
import { getImageUrl } from '../utils/imageHelper';
import { FaDownload, FaFilePdf, FaFileWord, FaFileImage, FaFileVideo } from 'react-icons/fa';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchResources();
  }, [filter]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = filter === 'all' ? {} : { category: filter };
      const response = await resourceService.getAll(params);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'pdf') return <FaFilePdf className="text-red-600 text-4xl" />;
    if (fileType === 'doc') return <FaFileWord className="text-blue-600 text-4xl" />;
    if (fileType === 'image') return <FaFileImage className="text-green-600 text-4xl" />;
    if (fileType === 'video') return <FaFileVideo className="text-purple-600 text-4xl" />;
    return <FaDownload className="text-gray-600 text-4xl" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    return `${mb} MB`;
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
          <h1 className="text-4xl font-bold">Resources</h1>
          <p className="text-xl mt-2">Download reports, publications, and policy documents</p>
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="bg-gray-50 border-b">
        <div className="container-custom py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setFilter('report')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'report' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setFilter('publication')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'publication' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Publications
            </button>
            <button
              onClick={() => setFilter('policy')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'policy' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Policy Documents
            </button>
            <button
              onClick={() => setFilter('guide')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'guide' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Guides
            </button>
            <button
              onClick={() => setFilter('other')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'other' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Other
            </button>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div className="container-custom py-16">
        {resources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No {filter !== 'all' ? filter + 's' : 'resources'} available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="card p-6 hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(resource.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                        {resource.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{resource.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{formatFileSize(resource.file_size)}</span>
                      <span>{resource.download_count} downloads</span>
                    </div>
                    <a
                      href={getImageUrl(resource.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full text-sm flex items-center justify-center"
                    >
                      <FaDownload className="mr-2" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Resources;
