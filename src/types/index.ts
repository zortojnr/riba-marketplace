// Product Types
export interface Product {
  id: string;
  storeId?: string;
  name: string;
  description: string;
  price: number;
  currency: 'NGN' | 'USD';
  images: string[];
  category: string;
  stock: number;
  availability: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  products?: Product[];
}

// Store Types
export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  themeColor: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  businessName?: string;
  businessType?: 'food' | 'products' | 'services';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  website?: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  currency: 'NGN' | 'USD';
}

// Order Types
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  storeId: string;
  customerInfo: {
    name: string;
    email?: string;
    phone: string;
    address?: string;
    deliveryMethod: 'pickup' | 'delivery';
  };
  items: OrderItem[];
  subtotal: number;
  total: number;
  currency: 'NGN' | 'USD';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'paystack' | 'flutterwave' | 'pay_on_pickup';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'owner';
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'paystack' | 'flutterwave' | 'pay_on_pickup';
  isActive: boolean;
}

export interface PaymentInitialization {
  reference: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  metadata: {
    orderId: string;
    storeId: string;
  };
}

// Notification Types
export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Settings Types
export interface StoreSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  paymentMethods: PaymentMethod[];
  currency: 'NGN' | 'USD';
  taxRate: number;
  deliveryFee: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role?: 'customer' | 'owner';
}

export interface StoreSetupFormData {
  name: string;
  slug: string;
  description?: string;
  themeColor: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  currency: 'NGN' | 'USD';
  images: string[];
  category: string;
  stock: number;
  availability: boolean;
}

export interface CheckoutFormData {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  deliveryMethod: 'pickup' | 'delivery';
  paymentMethod: 'paystack' | 'flutterwave' | 'pay_on_pickup';
}

// Exchange Rate Type
export interface ExchangeRate {
  pair: string;
  rate: number;
  timestamp: string;
}

// Plan Types
export interface Plan {
  id: string;
  name: 'Free' | 'Starter' | 'Premium';
  price: number;
  currency: 'NGN' | 'USD';
  features: string[];
  productLimit: number;
  orderLimit: number;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: string;
}

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
  salesByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}