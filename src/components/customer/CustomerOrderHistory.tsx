import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, ShoppingBag, Calendar, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  businessName: string;
  businessSlug: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress: string;
  phoneNumber: string;
  paymentMethod: string;
  notes?: string;
}

export const CustomerOrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered' | 'cancelled'>('all');

  useEffect(() => {
    loadOrderHistory();
  }, []);

  const loadOrderHistory = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock order data - in real app, this would come from your API
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          businessName: 'Demo Store',
          businessSlug: 'demo-store',
          items: [
            {
              id: '1',
              name: 'Premium Organic Coffee Beans',
              quantity: 2,
              price: 24.99,
              image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&h=100&fit=crop'
            },
            {
              id: '2',
              name: 'Artisan Chocolate Bar',
              quantity: 1,
              price: 12.50,
              image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=100&h=100&fit=crop'
            }
          ],
          total: 62.48,
          status: 'delivered',
          orderDate: '2024-01-15T10:30:00Z',
          deliveryDate: '2024-01-17T14:20:00Z',
          deliveryAddress: '123 Main Street, Lagos, Nigeria',
          phoneNumber: '+234 801 234 5678',
          paymentMethod: 'Cash on Delivery'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          businessName: 'Test Business',
          businessSlug: 'test-business',
          items: [
            {
              id: '3',
              name: 'Fresh Vegetables Bundle',
              quantity: 1,
              price: 35.00,
              image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop'
            }
          ],
          total: 35.00,
          status: 'preparing',
          orderDate: '2024-01-18T09:15:00Z',
          deliveryAddress: '456 Oak Avenue, Lagos, Nigeria',
          phoneNumber: '+234 802 345 6789',
          paymentMethod: 'Bank Transfer',
          notes: 'Please deliver after 2 PM'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          businessName: 'Demo Store',
          businessSlug: 'demo-store',
          items: [
            {
              id: '4',
              name: 'Local Honey Jar',
              quantity: 3,
              price: 18.99,
              image: 'https://images.unsplash.com/photo-1587049352846-4a222e784ba4?w=100&h=100&fit=crop'
            }
          ],
          total: 56.97,
          status: 'pending',
          orderDate: '2024-01-20T16:45:00Z',
          deliveryAddress: '789 Pine Street, Lagos, Nigeria',
          phoneNumber: '+234 803 456 7890',
          paymentMethod: 'Cash on Delivery'
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading order history:', error);
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-emerald-700 bg-emerald-100';
      case 'preparing':
        return 'text-blue-700 bg-blue-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'cancelled':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <ShoppingBag className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading order history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your order history here!</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-600">Track your past orders and purchases</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {(['all', 'pending', 'preparing', 'delivered', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              filter === status
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
                {orders.filter(order => order.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{order.businessName}</h3>
                  <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Ordered: {formatDate(order.orderDate)}</span>
                </div>
                {order.deliveryDate && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Delivered: {formatDate(order.deliveryDate)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{order.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                  <p>Payment: {order.paymentMethod}</p>
                  {order.notes && (
                    <p className="mt-2 italic">Notes: {order.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => window.location.href = `/store/${order.businessSlug}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Reorder
                </button>
                <button
                  onClick={() => toast.info('Receipt download feature coming soon!')}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Download Receipt
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};