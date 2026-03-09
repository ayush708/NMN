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
    const icons = {
      pdf: <FaFilePdf className="text-red-500" size={22} />,
      doc: <FaFileWord className="text-blue-500" size={22} />,
      image: <FaFileImage className="text-emerald-500" size={22} />,
      video: <FaFileVideo className="text-purple-500" size={22} />,
    };
    return icons[fileType] || <FaDownload className="text-gray-400" size={22} />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    return `${mb} MB`;
  };

  const filters = [
    { key: 'all', label: 'All Resources' },
    { key: 'report', label: 'Reports' },
    { key: 'publication', label: 'Publications' },
    { key: 'policy', label: 'Policy Documents' },
    { key: 'guide', label: 'Guides' },
    { key: 'other', label: 'Other' },
  ];

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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Resources</h1>
          <p className="text-lg text-primary-200 max-w-xl">Download reports, publications, and policy documents</p>
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

      {/* Resources List */}
      <div className="container-custom py-16">
        {resources.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaDownload className="text-gray-400" size={20} />
            </div>
            <p className="text-lg text-gray-500 font-medium">No {filter !== 'all' ? filter + 's' : 'resources'} available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {resources.map((resource, index) => (
              <div
                key={resource.id}
                className="card card-hover p-7 fade-in-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex items-start gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    {getFileIcon(resource.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <span className="text-xs font-bold px-3 py-1 bg-primary-50 text-primary-700 rounded-full border border-primary-100 capitalize">
                        {resource.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{resource.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-5">
                      <span>{formatFileSize(resource.file_size)}</span>
                      <span>{resource.download_count} downloads</span>
                    </div>
                    <a
                      href={getImageUrl(resource.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full text-sm"
                    >
                      <FaDownload size={12} />
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
