import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, MapPin, Phone, Mail, Shield, CheckCircle } from 'lucide-react';
import { CustomerAccessFlow, useCustomerAccess } from '@/components/access/CustomerAccessFlow';
import { ProductCard } from '@/components/store/ProductCard';
import { ProductModal } from '@/components/store/ProductModal';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  reviewCount: number;
  location: string;
  phone: string;
  email: string;
  website: string;
  verified: boolean;
  categories: string[];
}



const mockStore: Store = {
  id: 'demo-store-id',
  name: 'Demo Fashion Hub',
  slug: 'demo-store',
  description: 'Premium African fashion and accessories for the modern customer. Quality guaranteed with fast delivery across Nigeria.',
  logo: '/assets/images/store-placeholder.png',
  banner: '/assets/images/1.jpg',
  rating: 4.8,
  reviewCount: 127,
  location: 'Yola, Adamawa State',
  phone: '+234 808 825 6055',
  email: 'hello@demofashion.com',
  website: 'www.demofashion.com',
  verified: true,
  categories: ['Fashion', 'Accessories', 'Traditional Wear']
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Ankara Dress',
    description: 'Beautiful Ankara dress with modern African print design',
    price: 12000,
    currency: 'NGN',
    images: ['/assets/images/1.jpg'],
    category: 'Fashion',
    stock: 10,
    availability: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Traditional Beaded Necklace',
    description: 'Authentic African beaded necklace with traditional patterns',
    price: 3500,
    currency: 'NGN',
    images: ['/assets/images/2.jpg'],
    category: 'Accessories',
    stock: 25,
    availability: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Handwoven Basket Bag',
    description: 'Stylish handwoven basket bag made from sustainable materials',
    price: 8000,
    currency: 'NGN',
    images: ['/assets/images/3.jpg'],
    category: 'Accessories',
    stock: 15,
    availability: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const ProtectedStorePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = React.useState(false);
  const { addToCart } = useCart();

  const StoreContent: React.FC = () => {
    const access = useCustomerAccess();
    const accessType = access?.accessType;
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

    const storeFromSlug = (s?: string): Store => ({
    ...mockStore,
    slug: s || mockStore.slug,
    name: (s || mockStore.slug).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: mockStore.description,
    });

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Store Header */}
        <div className="relative bg-white shadow-sm">
          {/* Banner */}
          <div className="relative h-64 bg-gradient-to-r from-emerald-500 to-emerald-600 overflow-hidden">
            <img 
              src={mockStore.banner} 
              alt={`${(storeFromSlug(slug)).name} banner`}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Store Info */}
          <div className="relative bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 pb-6">
                {/* Store Logo */}
                <div className="relative mb-4 md:mb-0">
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden">
                    <img 
                      src={mockStore.logo} 
                      alt={`${(storeFromSlug(slug)).name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {mockStore.verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Store Details */}
                <div className="md:ml-6 flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{storeFromSlug(slug).name}</h1>
                    {mockStore.verified && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1">
                        <Shield className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 max-w-2xl">{storeFromSlug(slug).description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{mockStore.rating} ({mockStore.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{mockStore.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{mockStore.phone}</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {mockStore.categories.map((category) => (
                      <span 
                        key={category}
                        className="bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="mt-6 md:mt-0 md:ml-6 flex space-x-3">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
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

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product, index) => (
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
          {mockProducts.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600">This store doesn't have any products yet.</p>
            </div>
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