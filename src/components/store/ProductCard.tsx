import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onAddToCart,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-card shadow-sm border border-gray-200 overflow-hidden cursor-pointer group"
    >
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 && !imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-gray-400 text-center">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-sm">No image</p>
            </div>
          </div>
        )}
        
        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors"
              disabled={!product.availability || product.stock === 0}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stock indicator */}
        {!product.availability && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4" onClick={onClick}>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(product.price, product.currency)}
          </span>
          {product.stock > 0 && product.stock < 10 && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};