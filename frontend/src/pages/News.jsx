/**
 * Public News Page
 * Display all published news articles
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { newsService } from '../services';
import { getImageUrl } from '../utils/imageHelper';

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
          <h1 className="text-4xl font-bold">News & Updates</h1>
          <p className="text-xl mt-2">Stay informed about our latest activities</p>
        </div>
      </section>

      {/* News Grid */}
      <div className="container-custom py-16">
        {newsList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No news articles available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsList.map((news) => (
                <Link
                  key={news.id}
                  to={`/news/${news.slug}`}
                  className="card overflow-hidden hover:scale-105 transition"
                >
                  {news.image_url && (
                    <img
                      src={getImageUrl(news.image_url)}
                      alt={news.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                        {news.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(news.published_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">{news.summary}</p>
                    <div className="mt-4 text-primary-600 font-medium">
                      Read More →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-4 py-2 rounded ${
                    pagination.hasPrevPage
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-4 py-2 rounded ${
                    pagination.hasNextPage
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
