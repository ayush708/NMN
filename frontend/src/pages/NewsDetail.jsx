/**
 * News Detail Page
 * Display single news article
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { newsService } from '../services';
import { getImageUrl } from '../utils/imageHelper';

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [slug]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getBySlug(slug);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
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

  if (!news) {
    return (
      <PublicLayout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">News Not Found</h1>
          <Link to="/news" className="text-primary-600 hover:underline">
            ← Back to News
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-custom py-16">
        <Link to="/news" className="text-primary-600 hover:underline mb-6 inline-block">
          ← Back to News
        </Link>

        <article className="max-w-4xl mx-auto">
          {news.image_url && (
            <img
              src={getImageUrl(news.image_url)}
              alt={news.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}

          <div className="mb-4">
            <span className="text-xs px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
              {news.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{news.title}</h1>

          <div className="flex items-center text-gray-600 mb-6">
            <span>{new Date(news.published_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span className="mx-2">•</span>
            <span>{news.views} views</span>
          </div>

          {news.summary && (
            <p className="text-xl text-gray-600 mb-6 pb-6 border-b">
              {news.summary}
            </p>
          )}

          <div className="prose max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {news.content}
            </div>
          </div>
        </article>
      </div>
    </PublicLayout>
  );
};

export default NewsDetail;
