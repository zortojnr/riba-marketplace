import React, { createContext, useContext, useState } from 'react';
import type { Store, Product, ExchangeRate } from '@/types';
import { apiClient } from '@/utils/api';
import { toast } from 'sonner';

interface StoreContextType {
  currentStore: Store | null;
  products: Product[];
  categories: string[];
  exchangeRate: ExchangeRate | null;
  isLoading: boolean;
  error: string | null;
  setCurrentStore: (store: Store) => void;
  loadStoreBySlug: (slug: string) => Promise<void>;
  loadProducts: (storeId: string, category?: string) => Promise<void>;
  loadCategories: (storeId: string) => Promise<void>;
  loadExchangeRate: () => Promise<void>;
  clearError: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStoreBySlug = async (slug: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getStoreBySlug(slug);
      setCurrentStore(response.data as Store);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load store';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async (storeId: string, category?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getProducts(storeId, { category });
      setProducts(response.data as Product[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async (storeId: string) => {
    try {
      // For now, we'll extract categories from products
      // In a real app, you'd have a separate endpoint for categories
      const response = await apiClient.getProducts(storeId);
      const uniqueCategories = [...new Set((response.data as Product[]).map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadExchangeRate = async () => {
    try {
      const response = await apiClient.getExchangeRate('NGN_USD');
      setExchangeRate(response.data as ExchangeRate);
    } catch (err) {
      console.error('Failed to load exchange rate:', err);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: StoreContextType = {
    currentStore,
    products,
    categories,
    exchangeRate,
    isLoading,
    error,
    setCurrentStore,
    loadStoreBySlug,
    loadProducts,
    loadCategories,
    loadExchangeRate,
    clearError,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};