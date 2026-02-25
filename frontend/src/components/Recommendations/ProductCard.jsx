import React from 'react';
import { Star, Music, Smartphone, Video } from 'lucide-react';

const iconMap = {
  headphones: Music,
  smartphone: Smartphone,
  video: Video,
};

const ProductCard = ({ product }) => {
  const Icon = iconMap[product.icon] || Music;

  return (
    <div className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="h-32 bg-gray-50 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
        <Icon className="w-12 h-12 text-gray-300" strokeWidth={1} />
        {product.match && (
          <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.match}% Match
          </span>
          )}
        {product.tag && (
          <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.tag}
          </span>
        )}
      </div>
      <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
        {product.name}
      </h4>
      <div className="flex items-center gap-1 mb-2">
        <Star className="w-3 h-3 text-yellow-400 fill-current" />
        <span className="text-xs text-gray-500 font-medium">
          {product.rating} ({product.reviews > 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})
        </span>
      </div>
        <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
        {product.name}
      </h4>
      <div className="flex items-center gap-1 mb-2">
        <Star className="w-3 h-3 text-yellow-400 fill-current" />
        <span className="text-xs text-gray-500 font-medium">
          {product.rating} ({product.reviews > 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
        {product.originalPrice ? (
          <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
        ) : (
          product.badge && (
            <span className="text-xs text-gray-400">{product.badge}</span>
          )
        )}
      </div>
    </div>
  );
  };

export default ProductCard;