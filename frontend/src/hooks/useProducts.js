import { useState, useEffect, useCallback } from 'react';
import { initialProducts } from '../data/productsData';
import { useAppContext } from '../context/AppContext';

const useProducts = () => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, watchlist } = useAppContext();
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);

  // Sync products wishlisted status with watchlist whenever watchlist changes
  useEffect(() => {
    console.log('🔄 Syncing products with watchlist...');
    setProducts(prev => 
      prev.map(product => {
        const inWatchlist = isInWatchlist(product.id);
        // Only update if status changed to avoid unnecessary re-renders
        if (product.wishlisted !== inWatchlist) {
          console.log(`📝 Syncing product ${product.id} (${product.name}): wishlisted ${product.wishlisted} → ${inWatchlist}`);
          return { ...product, wishlisted: inWatchlist };
        }
        return product;
      })
    );
  }, [watchlist, isInWatchlist]); // Re-run when watchlist changes

  // Log initial products
  useEffect(() => {
    console.log('📦 Initial products loaded:', products.length);
  }, []);

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const toggleWishlist = useCallback((id) => {
    // Find the product
    const product = products.find(p => p.id === id);
    
    if (!product) {
      console.log('❌ Product not found:', id);
      return;
    }

    console.log('🔄 Toggling wishlist for:', product.name, 'Current status:', product.wishlisted);

    // Optimistically update UI
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, wishlisted: !p.wishlisted } : p
      )
    );

    // Update watchlist in context
    if (product.wishlisted) {
      // Currently wishlisted, so remove from watchlist
      console.log('➖ Removing from watchlist:', product.name);
      removeFromWatchlist(id);
    } else {
      // Not wishlisted, so add to watchlist
      console.log('➕ Adding to watchlist:', product.name);
      
      // Ensure product has all required fields before adding
      const productToAdd = {
        ...product,
        // Ensure these fields exist
        store: product.store || 'Unknown',
        currentPrice: product.currentPrice || product.price || 0,
        originalPrice: product.originalPrice || null,
        status: product.status || 'In Stock',
        icon: product.icon || 'monitor',
        storeInitial: product.storeInitial || (product.store ? product.store.charAt(0).toUpperCase() : '?'),
        storeColor: product.storeColor || getDefaultStoreColor(product.store)
      };
      
      addToWatchlist(productToAdd);
    }
  }, [products, addToWatchlist, removeFromWatchlist]);

  // Helper function for default store colors
  const getDefaultStoreColor = (store) => {
    const storeColors = {
      'Best Buy': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Amazon': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'B&H Photo': { bg: 'bg-red-100', text: 'text-red-700' },
      'Walmart': { bg: 'bg-blue-600', text: 'text-white' }
    };
    return storeColors[store] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  const addProduct = (newProduct) => {
    const productWithDefaults = {
      ...newProduct,
      id: Date.now(),
      wishlisted: false,
      storeInitial: newProduct.store.charAt(0).toUpperCase(),
      storeColor: getDefaultStoreColor(newProduct.store),
      status: newProduct.status || 'In Stock',
      icon: newProduct.icon || 'monitor',
    };
    
    setProducts((prev) => [...prev, productWithDefaults]);
    setShowModal(false);
    console.log('✅ New product added:', productWithDefaults);
  };

  const removeProduct = (id) => {
    const product = products.find(p => p.id === id);
    console.log('🗑️ Removing product:', product?.name);
    
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from watchlist if present
    if (product?.wishlisted) {
      removeFromWatchlist(id);
    }
  };

  // Debug function to check sync status
  const checkSyncStatus = useCallback(() => {
    console.log('🔍 Checking sync status...');
    products.forEach(product => {
      const inWatchlist = isInWatchlist(product.id);
      if (product.wishlisted !== inWatchlist) {
        console.warn(`⚠️ Sync mismatch for ${product.name}: product.wishlisted=${product.wishlisted}, isInWatchlist=${inWatchlist}`);
      }
    });
    console.log('✅ Sync check complete');
  }, [products, isInWatchlist]);

  // Expose debug function in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.__checkProductsSync = checkSyncStatus;
    }
    return () => {
      if (process.env.NODE_ENV === 'development') {
        delete window.__checkProductsSync;
      }
    };
  }, [checkSyncStatus]);

  return {
    products,
    filteredProducts,
    activeCategory,
    setActiveCategory,
    showModal,
    setShowModal,
    toggleWishlist,
    addProduct,
    removeProduct,
    checkSyncStatus, // Expose for debugging
  };
};

export default useProducts;