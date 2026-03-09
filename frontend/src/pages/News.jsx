/**
 * Public News Page
 * Display all published news articles
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { newsService } from '../services';
import { getImageUrl } from '../utils/imageHelper';
import { FaChevronRight } from 'react-icons/fa';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getAll({ page, limit: 9 });
      setNewsList(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 1) {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">News & Updates</h1>
          <p className="text-lg text-primary-200 max-w-xl">Stay informed about our latest activities</p>
        </div>
      </section>

      {/* News Grid */}
      <div className="container-custom py-16">
        {newsList.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">0</span>
            </div>
            <p className="text-lg text-gray-500 font-medium">No news articles available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {newsList.map((news, index) => (
                <Link
                  key={news.id}
                  to={`/news/${news.slug}`}
                  className="card card-hover group overflow-hidden fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {news.image_url && (
                    <div className="overflow-hidden h-52 relative">
                      <img
                        src={getImageUrl(news.image_url)}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-3 py-1 bg-primary-50 text-primary-700 rounded-full border border-primary-100">
                        {news.category}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(news.published_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{news.summary}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all duration-300">
                      Read More <FaChevronRight size={10} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-14 items-center gap-3">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    pagination.hasPrevPage
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-500 font-medium">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    pagination.hasNextPage
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default News;
