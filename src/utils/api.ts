import type { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData: { name: string; email: string; phone?: string; password: string }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async googleLogin(googleToken: string) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: googleToken }),
    });
  }

  // Store endpoints
  async getStoreBySlug(slug: string) {
    return this.request(`/stores/${slug}`);
  }

  async updateStore(storeId: string, storeData: Partial<any>) {
    return this.request(`/stores/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    });
  }

  // Product endpoints
  async getProducts(storeId: string, params?: { category?: string; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    
    return this.request(`/stores/${storeId}/products?${queryParams.toString()}`);
  }

  async createProduct(storeId: string, productData: any) {
    return this.request(`/stores/${storeId}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId: string, productData: Partial<any>) {
    return this.request(`/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId: string) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async createOrder(storeId: string, orderData: any) {
    return this.request(`/stores/${storeId}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(storeId: string, params?: { status?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return this.request(`/stores/${storeId}/orders?${queryParams.toString()}`);
  }

  // Payment endpoints
  async initializePaystackPayment(paymentData: any) {
    return this.request('/payments/paystack/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async initializeFlutterwavePayment(paymentData: any) {
    return this.request('/payments/flutterwave/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Analytics endpoints
  async trackEvent(event: string, properties: Record<string, any>) {
    return this.request('/analytics/event', {
      method: 'POST',
      body: JSON.stringify({ event, properties }),
    });
  }

  // Exchange rate
  async getExchangeRate(pair: string) {
    return this.request(`/exchange-rate?pair=${pair}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Helper function to handle file uploads
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: 'POST',
    body: formData,
    headers: (apiClient as any).token ? {
      Authorization: `Bearer ${(apiClient as any).token}`,
    } : {},
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.url;
};