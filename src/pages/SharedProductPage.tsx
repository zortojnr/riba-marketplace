import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ArrowLeft, AlertCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CustomerAccessFlow } from '@/components/access/CustomerAccessFlow';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface SharedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  inStock: boolean;
  stockQuantity: number;
  rating?: number;
  reviews?: number;
}

export const SharedProductPage: React.FC = () => {
  const { businessSlug, productId } = useParams<{ businessSlug: string; productId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const cart = useCart();
  
  const [product, setProduct] = useState<SharedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  // const [showShareModal, setShowShareModal] = useState(false); // Not used in this component

  const sharedLinkToken = searchParams.get('token');
  const isSharedLink = !!sharedLinkToken;

  useEffect(() => {
    if (businessSlug && productId) {
      loadProduct();
    }
  }, [businessSlug, productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      // Simulate API call to load product
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock product data - in real app, this would come from your API
      const mockProduct: SharedProduct = {
        id: productId!,
        name: 'Premium Organic Coffee Beans',
        description: 'High-quality organic coffee beans sourced from sustainable farms. Rich flavor with notes of chocolate and caramel.',
        price: 24.99,
        originalPrice: 29.99,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
        category: 'Coffee & Tea',
        businessId: `${businessSlug}-id`,
        businessName: businessSlug?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Business',
        businessSlug: businessSlug!,
        inStock: true,
        stockQuantity: 15,
        rating: 4.8,
        reviews: 124
      };
      
      setProduct(mockProduct);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      return;
    }

    cart.addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      currency: 'USD',
      images: [product.image],
      category: product.category,
      stock: product.stockQuantity,
      availability: product.inStock,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, selectedQuantity);
    
    toast.success(`Added ${selectedQuantity} ${product.name} to cart`);
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = () => {
    if (!product) return;
    // Sharing functionality is handled by the ShareProductLink component in store owner view
    toast.info('Product sharing is available for store owners');
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
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
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
    <CustomerAccessFlow
      businessSlug={businessSlug!}
      productId={productId!}
      sharedLinkToken={sharedLinkToken!}
    >
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
              
              <div className="flex items-center space-x-3">
                {isSharedLink && (
                  <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Shared Product
                  </div>
                )}
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Business Info */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.businessName}</h3>
                <p className="text-sm text-gray-600">
                  Shared via product link • Customer access required for purchases
                </p>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating!) ? 'fill-current' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-emerald-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className={`text-sm ${product.inStock ? 'text-emerald-700' : 'text-red-700'}`}>
                  {product.inStock ? `In stock (${product.stockQuantity} available)` : 'Out of stock'}
                </span>
              </div>

              {/* Quantity Selector */}
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
                    onClick={() => setSelectedQuantity(Math.min(product.stockQuantity, selectedQuantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={selectedQuantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleWishlist}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Access Info */}
              {isSharedLink && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Shared Product Access</h4>
                      <p className="text-sm text-blue-800">
                        This product was shared with you via a secure link. You can view and add it to your cart, 
                        but purchases require permission from the business owner.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </CustomerAccessFlow>
  );
};