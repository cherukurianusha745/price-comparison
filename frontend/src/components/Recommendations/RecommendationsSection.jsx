import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard'; // Make sure this import is correct

const RecommendationsSection = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Theme-based classes
  const sectionClasses = theme === 'dark'
    ? 'lg:col-span-7 bg-black border-gray-900'
    : 'lg:col-span-7 bg-white border-gray-200';

  const textPrimaryClasses = theme === 'dark'
    ? 'text-white'
    : 'text-gray-900';

  const textSecondaryClasses = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-500';

  const linkClasses = theme === 'dark'
    ? 'text-indigo-400 hover:text-indigo-300'
    : 'text-indigo-600 hover:text-indigo-700';

  // Mock recommendations data from your context
  const recommendations = [
    {
      id: 1,
      name: 'Bose QC45',
      price: 279.00,
      originalPrice: 329.00,
      rating: 4.8,
      reviews: '2k',
      match: 98,
      icon: 'headphones'
    },
    {
      id: 2,
      name: 'Sennheiser M4',
      price: 299.95,
      rating: 4.6,
      reviews: 856,
      match: 92,
      badge: 'Best price',
      icon: 'smartphone'
    },
    {
      id: 3,
      name: 'AirPods Max',
      price: 479.00,
      rating: 4.7,
      reviews: '5k',
      badge: 'Price drop',
      tag: 'New',
      icon: 'video'
    }
  ];

  const handleViewAll = () => {
    navigate('/recommendations');
  };

  return (
    <div className={`rounded-xl p-6 border shadow-xl transition-colors ${sectionClasses}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`font-semibold flex items-center gap-2 ${textPrimaryClasses}`}>
            Recommended for You
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </h3>
          <p className={`text-sm ${textSecondaryClasses}`}>
            Based on your recent search for "Noise Cancelling Headphones"
          </p>
        </div>
        <button 
          onClick={handleViewAll}
          className={`flex items-center gap-1 text-sm font-medium ${linkClasses}`}
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;