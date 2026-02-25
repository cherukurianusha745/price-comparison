
import React from 'react';
import { CATEGORIES } from '../../data/productsData';

const ProductFilterTabs = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === cat
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default ProductFilterTabs;