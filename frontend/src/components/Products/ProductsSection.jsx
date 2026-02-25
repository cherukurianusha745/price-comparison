import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductFilterTabs from './ProductFilterTabs';
import AddProductModal from './AddProductModal';
import useProducts from '../../hooks/useProducts';
import { useAppContext } from '../../context/AppContext';

const ProductsSection = ({ limit = 4 }) => {
  const {
    activeCategory,
    setActiveCategory,
    showModal,
    setShowModal,
    toggleWishlist,
    addProduct,
    removeProduct,
  } = useProducts();

  const { filteredProducts, searchQuery } = useAppContext();

  // Apply category filter on top of search filter
  const getFilteredProducts = () => {
    let products = filteredProducts;
    
    // Apply category filter
    if (activeCategory !== 'All') {
      products = products.filter((p) => p.category === activeCategory);
    }
    
    return products;
  };

  const displayedProducts = limit 
    ? getFilteredProducts().slice(0, limit) 
    : getFilteredProducts();

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products List</h2>
          <p className="text-gray-500 text-sm">Browse and track all available products</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <ProductFilterTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Product Grid */}
      {displayedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No products found</h3>
          <p className="text-gray-500 text-sm">Try a different category or add a new product</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleWishlist={toggleWishlist}
              onRemove={removeProduct}
            />
          ))}
        </div>
      )}

      {/* View All Link */}
      {getFilteredProducts().length > limit && (
        <div className="mt-8 flex justify-center">
          <a
            href="/products"
            className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:text-indigo-700 transition-colors"
          >
            View all products
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <AddProductModal
          onAdd={addProduct}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
};

export default ProductsSection;