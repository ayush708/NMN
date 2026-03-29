/**
 * News Detail Page
 * Display single news article
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { newsService } from '../services';
import { getImageUrl } from '../utils/imageHelper';
import { FaArrowLeft, FaEye } from 'react-icons/fa';

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
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-[3px] border-primary-200 border-t-primary-600 animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!news) {
    return (
      <PublicLayout>
        <div className="container-custom py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">News Not Found</h1>
          <Link to="/news" className="text-primary-600 hover:underline inline-flex items-center gap-2">
            <FaArrowLeft size={12} /> Back to News
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container-custom py-10">
        <Link to="/news" className="text-primary-600 hover:text-primary-700 mb-8 inline-flex items-center gap-2 text-sm font-semibold group">
          <FaArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" /> Back to News
        </Link>

        <article className="max-w-4xl mx-auto">
          {news.image_url && (
            <div className="rounded-3xl overflow-hidden mb-8 shadow-card">
              <img
                src={getImageUrl(news.image_url)}
                alt={news.title}
                width="1280"
                height="720"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-80 md:h-96 object-cover"
              />
            </div>
          )}

          <div className="mb-4">
            <span className="text-xs font-bold px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full border border-primary-100">
              {news.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-5">{news.title}</h1>

          <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
            <span className="font-medium">{new Date(news.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {news.views_count > 0 && (
              <span className="flex items-center gap-1"><FaEye size={13} /> {news.views_count} views</span>
            )}
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </article>
      </div>
    </PublicLayout>
  );
};

export default NewsDetail;
