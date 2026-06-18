import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, Phone, Mail } from 'lucide-react';
import { CustomerAccessFlow, useCustomerAccess } from '@/components/access/CustomerAccessFlow';
import { ProductCard } from '@/components/store/ProductCard';
import { ProductModal } from '@/components/store/ProductModal';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';
import { mapProductRowToProduct, type ProductRow } from '@/lib/mappers';
import { toast } from 'sonner';
import type { Product } from '@/types';

export const ProtectedStorePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = React.useState(false);
  const { addToCart } = useCart();

  const StoreContent: React.FC = () => {
    const access = useCustomerAccess();
    const accessType = access?.accessType;
    const store = access?.store;
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = React.useState(true);

    React.useEffect(() => {
      if (!store?.id) {
        setProducts([]);
        setLoadingProducts(false);
        return;
      }
      let cancelled = false;
      (async () => {
        setLoadingProducts(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', store.id)
          .order('created_at', { ascending: false });
        if (cancelled) return;
        if (error) {
          toast.error('Failed to load products');
          setProducts([]);
        } else {
          setProducts((data as ProductRow[]).map(mapProductRowToProduct));
        }
        setLoadingProducts(false);
      })();
      return () => {
        cancelled = true;
      };
    }, [store?.id]);

    const handleAddToCart = (product: Product) => {
      if (accessType !== 'full') {
        toast.error("You don’t have access to this store!", { duration: 1000 });
        return;
      }
      addToCart(product, 1);
      toast.success(`${product.name} added to cart`);
    };

    const handleProductClick = (product: Product) => {
      setSelectedProduct(product);
      setShowProductModal(true);
    };

    if (!store) {
      return null;
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Store Header */}
        <div className="relative bg-white shadow-sm">
          {/* Banner */}
          <div className="relative h-64 bg-gradient-to-r from-emerald-500 to-emerald-600 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Store Info */}
          <div className="relative bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 pb-6">
                {/* Store Logo */}
                <div className="relative mb-4 md:mb-0">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-emerald-600" />
                  </div>
                </div>

                {/* Store Details */}
                <div className="md:ml-6 flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
                  </div>

                  <p className="text-gray-600 mb-4 max-w-2xl">{store.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    {(store.city || store.state) && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{[store.city, store.state].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                    {store.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{store.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  {store.businessType && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full capitalize">
                        {store.businessType}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contact Actions */}
                <div className="mt-6 md:mt-0 md:ml-6 flex space-x-3">
                  <a
                    href={store.phone ? `tel:${store.phone}` : undefined}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 min-h-[44px] rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                  <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 min-h-[44px] rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Products</h2>
            <p className="text-gray-600">Discover our amazing collection of products</p>
          </motion.div>

          {loadingProducts ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                      onClick={() => handleProductClick(product)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
                  <p className="text-gray-600">This store doesn't have any products yet.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Product Modal */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            isOpen={showProductModal}
            onClose={() => setShowProductModal(false)}
            onAddToCart={(product) => handleAddToCart(product)}
          />
        )}
      </div>
    );
  };

  return (
    <CustomerAccessFlow businessSlug={slug || ''}>
      <StoreContent />
    </CustomerAccessFlow>
  );
};

export default ProtectedStorePage;