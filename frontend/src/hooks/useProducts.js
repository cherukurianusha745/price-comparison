// import { useState, useEffect, useCallback } from 'react';
// import { initialProducts } from '../data/productsData';
// import { useAppContext } from '../context/AppContext';
// import { productService } from '../services/productService';

// const useProducts = () => {
//   const { addToWatchlist, removeFromWatchlist, isInWatchlist, watchlist } = useAppContext();
//   const [products, setProducts] = useState(initialProducts);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [showModal, setShowModal] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);

//   // Sync products with watchlist
//   useEffect(() => {
//     setProducts(prev => 
//       prev.map(product => {
//         const inWatchlist = isInWatchlist(product.id);
//         if (product.wishlisted !== inWatchlist) {
//           return { ...product, wishlisted: inWatchlist };
//         }
//         return product;
//       })
//     );
//   }, [watchlist, isInWatchlist]);

//   // Search products by name
//   const searchProducts = useCallback(async (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return [];
//     }

//     setIsSearching(true);
//     try {
//       // First search in local products
//       const localResults = products.filter(product =>
//         product.name.toLowerCase().includes(query.toLowerCase()) ||
//         product.category?.toLowerCase().includes(query.toLowerCase()) ||
//         product.store?.toLowerCase().includes(query.toLowerCase())
//       );

//       // Then try API search
//       try {
//         const apiResults = await productService.searchProducts(query);
//         // Merge and deduplicate results
//         const mergedResults = [...localResults, ...apiResults];
//         const uniqueResults = Array.from(new Map(mergedResults.map(p => [p.id, p])).values());
//         setSearchResults(uniqueResults);
//         return uniqueResults;
//       } catch (error) {
//         // If API fails, return local results only
//         setSearchResults(localResults);
//         return localResults;
//       }
//     } finally {
//       setIsSearching(false);
//     }
//   }, [products]);

//   // Search by image
//   const searchByImage = useCallback(async (imageFile) => {
//     setIsSearching(true);
//     try {
//       const results = await productService.searchByImage(imageFile);
//       setSearchResults(results);
//       return results;
//     } catch (error) {
//       console.error('Image search failed:', error);
//       throw error;
//     } finally {
//       setIsSearching(false);
//     }
//   }, []);

//   // Search by URL
//   const searchByUrl = useCallback(async (url) => {
//     setIsSearching(true);
//     try {
//       // First try to parse locally
//       const parsed = productService.parseProductUrl(url);
      
//       if (parsed) {
//         // Try to find in local products
//         const localProduct = products.find(p => 
//           p.url?.includes(parsed.productId) || 
//           p.store?.toLowerCase() === parsed.store
//         );
        
//         if (localProduct) {
//           setSearchResults([localProduct]);
//           return [localProduct];
//         }
//       }

//       // If not found locally, try API
//       const apiResults = await productService.searchByUrl(url);
//       setSearchResults(apiResults);
//       return apiResults;
//     } catch (error) {
//       console.error('URL search failed:', error);
//       throw error;
//     } finally {
//       setIsSearching(false);
//     }
//   }, [products]);

//   const toggleWishlist = useCallback((id) => {
//     const product = products.find(p => p.id === id);
    
//     if (!product) return;

//     setProducts((prev) =>
//       prev.map((p) =>
//         p.id === id ? { ...p, wishlisted: !p.wishlisted } : p
//       )
//     );

//     if (product.wishlisted) {
//       removeFromWatchlist(id);
//     } else {
//       const productToAdd = {
//         ...product,
//         store: product.store || 'Unknown',
//         currentPrice: product.currentPrice || product.price || 0,
//         originalPrice: product.originalPrice || null,
//         status: product.status || 'In Stock',
//         icon: product.icon || 'monitor',
//         storeInitial: product.storeInitial || (product.store ? product.store.charAt(0).toUpperCase() : '?'),
//         storeColor: product.storeColor || getDefaultStoreColor(product.store)
//       };
      
//       addToWatchlist(productToAdd);
//     }
//   }, [products, addToWatchlist, removeFromWatchlist]);

//   const getDefaultStoreColor = (store) => {
//     const storeColors = {
//       'Best Buy': { bg: 'bg-blue-100', text: 'text-blue-700' },
//       'Amazon': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
//       'B&H Photo': { bg: 'bg-red-100', text: 'text-red-700' },
//       'Walmart': { bg: 'bg-blue-600', text: 'text-white' }
//     };
//     return storeColors[store] || { bg: 'bg-gray-100', text: 'text-gray-700' };
//   };

//   const addProduct = (newProduct) => {
//     const productWithDefaults = {
//       ...newProduct,
//       id: Date.now(),
//       wishlisted: false,
//       storeInitial: newProduct.store.charAt(0).toUpperCase(),
//       storeColor: getDefaultStoreColor(newProduct.store),
//       status: newProduct.status || 'In Stock',
//       icon: newProduct.icon || 'monitor',
//     };
    
//     setProducts((prev) => [...prev, productWithDefaults]);
//     setShowModal(false);
//   };

//   const removeProduct = (id) => {
//     const product = products.find(p => p.id === id);
//     setProducts((prev) => prev.filter((p) => p.id !== id));
//     if (product?.wishlisted) {
//       removeFromWatchlist(id);
//     }
//   };

//   const filteredProducts =
//     activeCategory === 'All'
//       ? products
//       : products.filter((p) => p.category === activeCategory);

//   return {
//     products,
//     filteredProducts,
//     searchResults,
//     isSearching,
//     activeCategory,
//     setActiveCategory,
//     showModal,
//     setShowModal,
//     toggleWishlist,
//     addProduct,
//     removeProduct,
//     searchProducts,
//     searchByImage,
//     searchByUrl,
//   };
// };

// export default useProducts;