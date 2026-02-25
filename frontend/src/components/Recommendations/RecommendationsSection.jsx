import React from 'react';
import { useAppContext } from '../../context/AppContext';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RecommendationsSection = () => {
  const { recommendations } = useAppContext();

  return (
    <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Recommended for You</h3>
          <p className="text-gray-500 text-sm">
            Based on your recent search for "Noise Cancelling Headphones"
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;