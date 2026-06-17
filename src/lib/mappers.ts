import type { User } from '@/types';

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
