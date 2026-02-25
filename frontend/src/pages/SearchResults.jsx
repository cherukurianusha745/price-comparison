import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/Products/ProductCard';
import useProducts from '../hooks/useProducts';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const { filteredProducts, searchQuery, setSearchQuery } = useAppContext();
  const { toggleWishlist, removeProduct } = useProducts();
  const navigate = useNavigate();

  const handleClearSearch = () => {
    setSearchQuery('');
    navigate('/dashboard'); // Navigate back to dashboard after clearing
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found for "{searchQuery}"
          </p>
        </div>
        <button
          onClick={handleClearSearch}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Clear Search
        </button>
      </div>

      {/* Search Bar (optional - to refine search) */}
      <div className="relative max-w-xl">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Refine your search..."
          autoFocus
        />
      </div>

      {/* Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">
            We couldn't find any products matching "{searchQuery}"
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleClearSearch}
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Clear Search
            </button>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse All Products
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filter/Sort Options */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border-0 focus:ring-0 text-gray-700">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Discount</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">View:</span>
              <button className="p-2 bg-gray-100 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleWishlist={toggleWishlist}
                onRemove={removeProduct}
              />
            ))}
          </div>

          {/* Results Summary */}
          <div className="text-center text-sm text-gray-500 pt-4">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;