import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, MapPin, User, Phone, Mail, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { CheckoutFormData } from '@/types';
import { formatCurrency } from '@/utils';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(5, 'Address is required').optional(),
  deliveryMethod: z.enum(['pickup', 'delivery']),
  paymentMethod: z.enum(['paystack', 'flutterwave', 'pay_on_pickup']),
});

export const CheckoutPage: React.FC = () => {
  const { items, total, currency, clearCart } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  // Checkout requires a session (orders.customer_id is set from auth.uid()),
  // so bounce unauthenticated visitors to /auth and bring them straight
  // back here afterwards instead of letting them fill out a dead form.
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { state: { from: location }, replace: true });
    }
  }, [authLoading, user, navigate, location]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      deliveryMethod: 'pickup',
      paymentMethod: 'paystack',
    },
  });

  const deliveryMethod = watch('deliveryMethod');

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!user) {
      navigate('/auth', { state: { from: location } });
      return;
    }

    const storeId = items[0].product.storeId;
    if (!storeId || items.some((item) => item.product.storeId !== storeId)) {
      toast.error('Your cart has products from more than one store. Please check out one store at a time.');
      return;
    }

    setIsProcessing(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          store_id: storeId,
          customer_id: user.id,
          customer_name: data.name,
          customer_email: data.email || null,
          customer_phone: data.phone,
          customer_address: data.deliveryMethod === 'delivery' ? data.address : null,
          delivery_method: data.deliveryMethod,
          subtotal: total,
          total,
          currency,
          payment_method: data.paymentMethod,
        })
        .select('id')
        .single();
      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order. Please try again.';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-4">
            <BackButton to="/" variant="ghost" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products before checking out</p>
            <a href="/" className="btn btn-primary">
              Continue Shopping
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton to="/cart" variant="ghost" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="bg-white rounded-card shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-400" />
                    Customer Information
                  </h3>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        {...register('name')}
                        type="text"
                        id="name"
                        className="input pl-10"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        className="input pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className="input pl-10"
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    Delivery Method
                  </h3>

                  <div className="space-y-2">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        {...register('deliveryMethod')}
                        type="radio"
                        value="pickup"
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">Pickup</p>
                        <p className="text-sm text-gray-600">Collect your order from our location</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        {...register('deliveryMethod')}
                        type="radio"
                        value="delivery"
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">Delivery</p>
                        <p className="text-sm text-gray-600">Get your order delivered to your address</p>
                      </div>
                    </label>
                  </div>

                  {deliveryMethod === 'delivery' && (
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Address *
                      </label>
                      <textarea
                        {...register('address')}
                        id="address"
                        rows={3}
                        className="input"
                        placeholder="Enter your delivery address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                    Payment Method
                  </h3>

                  <div className="space-y-2">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="paystack"
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">Pay with Paystack</p>
                        <p className="text-sm text-gray-600">Secure online payment</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="flutterwave"
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">Pay with Flutterwave</p>
                        <p className="text-sm text-gray-600">Alternative payment method</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        {...register('paymentMethod')}
                        type="radio"
                        value="pay_on_pickup"
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">Pay on Pickup</p>
                        <p className="text-sm text-gray-600">Pay when you collect your order</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-card shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xl">📦</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.product.price * item.quantity, item.product.currency)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(total, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary-600">{formatCurrency(total, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};