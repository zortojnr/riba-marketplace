import type { Product, User } from '@/types';

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
