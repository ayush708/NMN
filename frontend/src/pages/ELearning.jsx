/**
 * E-Learning Categories Page
 * Display learning categories
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { elearningService } from '../services';
import { FaBook, FaGraduationCap, FaHeart, FaBriefcase, FaDollarSign, FaChevronRight } from 'react-icons/fa';

const ELearning = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await elearningService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      book: FaBook,
      heart: FaHeart,
      briefcase: FaBriefcase,
      dollar: FaDollarSign,
      scale: FaGraduationCap,
    };
    const Icon = icons[iconName] || FaBook;
    return <Icon className="text-3xl text-primary-600" />;
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
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary-400/15 rounded-full blur-[120px]" />
        </div>
        <div className="container-custom relative fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">E-Learning Center</h1>
          <p className="text-lg text-primary-200 max-w-xl">Learn and grow with our educational resources</p>
        </div>
      </section>

      {/* Categories Grid */}
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <span className="section-tag">Explore</span>
          <h2 className="section-title">Browse by Category</h2>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaBook className="text-gray-400" size={20} />
            </div>
            <p className="text-lg text-gray-500 font-medium">Learning categories will be available soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/elearning/${category.slug}`}
                className="card card-hover group p-8 text-center fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-16 w-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(category.icon)}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary-700 transition-colors">{category.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{category.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all duration-300">
                  Explore <FaChevronRight size={10} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default ELearning;
