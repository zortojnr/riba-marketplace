import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Share2, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CustomerAccessFlow, useCustomerAccess } from '@/components/access/CustomerAccessFlow';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import { mapProductRowToProduct, type ProductRow } from '@/lib/mappers';
import { formatCurrency } from '@/utils';
import type { Product } from '@/types';

const ProductContent: React.FC<{ productId: string }> = ({ productId }) => {
  const access = useCustomerAccess();
  const store = access?.store;
  const cart = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (!store?.id) {
      setProduct(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('store_id', store.id)
        .eq('availability', true)
        .maybeSingle();
      if (cancelled) return;

      if (error || !data) {
        setProduct(null);
      } else {
        setProduct(mapProductRowToProduct(data as ProductRow));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [store?.id, productId]);

  const handleAddToCart = () => {
    if (!product) return;
    cart.addToCart(product, selectedQuantity);
    toast.success(`Added ${selectedQuantity} ${product.name} to cart`);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h3>
          <p className="text-gray-600 mb-4">This product doesn't exist or is no longer available.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
              {product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">📦</span>
              )}
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{store?.name}</h3>
              <p className="text-sm text-gray-600">Sold directly by this store on RIBA</p>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <span className="text-3xl font-bold text-emerald-600">
              {formatCurrency(product.price, product.currency)}
            </span>

            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className={`text-sm ${product.stock > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      disabled={selectedQuantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                      {selectedQuantity}
                    </span>
                    <button
                      onClick={() => setSelectedQuantity(Math.min(product.stock, selectedQuantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      disabled={selectedQuantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const SharedProductPage: React.FC = () => {
  const { businessSlug, productId } = useParams<{ businessSlug: string; productId: string }>();

  return (
    <CustomerAccessFlow businessSlug={businessSlug || ''}>
      <ProductContent productId={productId || ''} />
    </CustomerAccessFlow>
  );
};

export default SharedProductPage;
