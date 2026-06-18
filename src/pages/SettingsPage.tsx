import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { mapStoreRowToStore, type StoreRow } from '@/lib/mappers';
import type { Store } from '@/types';

const settingsSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  themeColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please select a valid color'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<Store | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();
      if (cancelled) return;

      if (error) {
        toast.error('Failed to load store settings');
        setLoading(false);
        return;
      }
      if (!data) {
        setStore(null);
        setLoading(false);
        return;
      }

      const mapped = mapStoreRowToStore(data as StoreRow);
      setStore(mapped);
      reset({
        name: mapped.name,
        businessName: mapped.businessName || '',
        description: mapped.description || '',
        phone: mapped.phone || '',
        address: mapped.address || '',
        city: mapped.city || '',
        state: mapped.state || '',
        website: mapped.website || '',
        themeColor: mapped.themeColor,
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    if (!store) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('stores')
        .update({
          name: data.name,
          business_name: data.businessName,
          description: data.description,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          website: data.website || null,
          theme_color: data.themeColor,
        })
        .eq('id', store.id);

      if (error) throw error;
      toast.success('Store settings saved');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save settings';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!store) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-muted-foreground">Configure your store preferences</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-gray-200 rounded-card p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input {...register('name')} className="input" placeholder="Enter store name" />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input {...register('businessName')} className="input" placeholder="Enter business name" />
            {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="input resize-none" placeholder="Tell customers about your business..." />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input {...register('phone')} type="tel" className="input" placeholder="Enter phone number" />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
            <input {...register('website')} type="url" className="input" placeholder="https://yoursite.com" />
            {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea {...register('address')} rows={2} className="input resize-none" placeholder="Enter business address" />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input {...register('city')} className="input" placeholder="Enter city" />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input {...register('state')} className="input" placeholder="Enter state" />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
            <div className="flex items-center gap-4">
              <input {...register('themeColor')} type="color" className="w-12 h-12 p-0 border border-gray-300 rounded-lg cursor-pointer" />
              <input {...register('themeColor')} type="text" className="input flex-1" placeholder="#0B6E4F" />
            </div>
            {errors.themeColor && <p className="mt-1 text-sm text-red-600">{errors.themeColor.message}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={isSaving} className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.form>
    </div>
  );
};
