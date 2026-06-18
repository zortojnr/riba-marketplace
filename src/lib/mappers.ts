import type { Product, Store, User } from '@/types';

export interface ProfileRow {
  id: string;
  email: string;
  phone: string | null;
  name: string;
  avatar: string | null;
  role: 'customer' | 'owner';
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
