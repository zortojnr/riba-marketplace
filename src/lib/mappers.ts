import type { Order, Product, Store, User } from '@/types';

export interface ProfileRow {
  id: string;
  email: string;
  phone: string | null;
  name: string;
  avatar: string | null;
  role: 'customer' | 'owner' | 'admin';
  created_at: string;
  updated_at: string;
}

export const mapProfileToUser = (profile: ProfileRow): User => ({
  id: profile.id,
  email: profile.email,
  phone: profile.phone ?? undefined,
  name: profile.name,
  avatar: profile.avatar ?? undefined,
  role: profile.role,
  createdAt: profile.created_at,
  updatedAt: profile.updated_at,
});

export interface ProductRow {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  currency: 'NGN' | 'USD';
  images: string[];
  category: string;
  stock: number;
  availability: boolean;
  created_at: string;
  updated_at: string;
}

export const mapProductRowToProduct = (row: ProductRow): Product => ({
  id: row.id,
  storeId: row.store_id,
  name: row.name,
  description: row.description,
  price: Number(row.price),
  currency: row.currency,
  images: row.images ?? [],
  category: row.category,
  stock: row.stock,
  availability: row.availability,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export interface StoreRow {
  id: string;
  owner_id: string;
  name: string;
  business_name: string;
  business_type: 'food' | 'products' | 'services';
  description: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  website: string | null;
  slug: string;
  theme_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const mapStoreRowToStore = (row: StoreRow): Store => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  themeColor: row.theme_color,
  ownerId: row.owner_id,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  businessName: row.business_name,
  businessType: row.business_type,
  phone: row.phone,
  address: row.address,
  city: row.city,
  state: row.state,
  website: row.website ?? undefined,
});

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderRow {
  id: string;
  store_id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_address: string | null;
  delivery_method: 'pickup' | 'delivery';
  subtotal: number;
  total: number;
  currency: 'NGN' | 'USD';
  status: Order['status'];
  payment_method: Order['paymentMethod'];
  payment_status: Order['paymentStatus'];
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItemRow[];
}

export const mapOrderRowToOrder = (row: OrderRow): Order => ({
  id: row.id,
  storeId: row.store_id,
  customerInfo: {
    name: row.customer_name,
    email: row.customer_email ?? undefined,
    phone: row.customer_phone,
    address: row.customer_address ?? undefined,
    deliveryMethod: row.delivery_method,
  },
  items: (row.order_items ?? []).map((item) => ({
    productId: item.product_id ?? '',
    name: item.name,
    price: Number(item.price),
    quantity: item.quantity,
    total: Number(item.total),
  })),
  subtotal: Number(row.subtotal),
  total: Number(row.total),
  currency: row.currency,
  status: row.status,
  paymentMethod: row.payment_method,
  paymentStatus: row.payment_status,
  paymentReference: row.payment_reference ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
