/**
 * E-Learning Categories Page
 * Display learning categories
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { elearningService } from '../services';
import { FaBook, FaGraduationCap, FaHeart, FaBriefcase, FaDollarSign } from 'react-icons/fa';

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
    return <Icon className="text-4xl text-primary-600" />;
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
          <h1 className="text-4xl font-bold">E-Learning Center</h1>
          <p className="text-xl mt-2">Learn and grow with our educational resources</p>
        </div>
      </section>

      {/* Categories Grid */}
      <div className="container-custom py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Learning categories will be available soon. Check back later!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/elearning/${category.slug}`}
                className="card p-8 text-center hover:scale-105 transition"
              >
                <div className="flex justify-center mb-4">
                  {getIcon(category.icon)}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <span className="text-primary-600 font-medium">
                  Explore →
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
