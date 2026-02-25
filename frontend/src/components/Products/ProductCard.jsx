import React, { useState } from 'react';
import { Monitor, Smartphone, Music, Camera, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  monitor: Monitor,
  smartphone: Smartphone,
  audio: Music,
  camera: Camera,
};

const statusStyles = {
  'In Stock':   { bg: 'bg-green-100',  text: 'text-green-700'  },
  'Low Stock':  { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'Out of Stock': { bg: 'bg-red-100',  text: 'text-red-700'    },
};

const ProductCard = ({ product, onToggleWishlist, onRemove }) => {
  const [imageError, setImageError] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const navigate = useNavigate();
  const { 
    addToWatchlist, 
    removeFromWatchlist, 
    isInWatchlist,
    addToCart,
    buyNow, // Add buyNow here
    isInCart,
    getCartQuantity
  } = useAppContext();
  
  const Icon = iconMap[product.icon] || Monitor;
  const stockStyle = statusStyles[product.status] || statusStyles['In Stock'];
  const inWatchlist = isInWatchlist(product.id);
  const inCart = isInCart(product.id);
  const cartQuantity = getCartQuantity(product.id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (inWatchlist) {
      removeFromWatchlist(product.id);
    } else {
      addToWatchlist(product);
    }
    
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    addToCart(product, 1);
    
    // Show added message
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Use buyNow function to create order immediately
    const order = buyNow(product);
    if (order) {
      navigate('/orders');
    }
  };

  const handleViewCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate('/cart');
  };

  const isOutOfStock = product.status === 'Out of Stock';

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer relative">
      
      {/* Added to Cart Message */}
      {showAddedMessage && (
        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-medium rounded-t-2xl z-10 animate-slideDown">
          ✓ Added to cart
        </div>
      )}

      {/* Image Area */}
      <div className="relative bg-gray-100 rounded-xl h-48 flex items-center justify-center mb-4 overflow-hidden">
        {product.image && !imageError ? (
          <img 
            src={product.image} 
            alt={product.imageAlt || product.name}
            className="w-full h-full object-contain p-2"
            onError={() => setImageError(true)}
          />
        ) : (
          <Icon className="w-16 h-16 text-gray-300" strokeWidth={1} />
        )}

        {/* Stock Badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${stockStyle.bg} ${stockStyle.text}`}>
          {product.status}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors shadow-sm ${
            inWatchlist
              ? 'bg-white text-red-500'
              : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500'
          }`}
          title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill={inWatchlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Remove Button (for admin/owner) */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(product.id);
              removeFromWatchlist(product.id);
            }}
            className="absolute bottom-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Product Info */}
      <span className="text-indigo-600 text-xs font-semibold uppercase tracking-wider">
        {product.category}
      </span>

      <h3 className="text-gray-900 font-bold mt-1 group-hover:text-indigo-600 transition-colors truncate">
        {product.name}
      </h3>

      <div className="flex items-center justify-between mt-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {product.discount && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                -{product.discount}%
              </span>
            )}
            {!product.discount && product.originalPrice && (
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Stable
              </span>
            )}
          </div>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div
          className={`w-7 h-7 rounded-full ${product.storeColor.bg} ${product.storeColor.text} flex items-center justify-center text-[10px] font-bold`}
          title={product.store}
        >
          {product.storeInitial}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        {isOutOfStock ? (
          <button
            disabled
            className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : (
          <>
            {inCart ? (
              <button
                onClick={handleViewCart}
                className="flex-1 flex items-center justify-center gap-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartQuantity} in Cart
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            )}
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Buy Now
            </button>
          </>
        )}
      </div>

      {/* Cart indicator dot (if in cart) */}
      {inCart && !isOutOfStock && (
        <div className="absolute bottom-24 right-5 w-2 h-2 bg-indigo-600 rounded-full"></div>
      )}
    </div>
  );
};

export default ProductCard;