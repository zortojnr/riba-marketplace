import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Upload, Download, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { mapProductRowToProduct, type ProductRow } from '@/lib/mappers';
import type { Product, ProductFormData } from '@/types';
import { formatCurrency } from '@/utils';
import ProductModal from '@/components/products/ProductModal';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadStoreAndProducts(user.id);
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  // Always resolve the owner's store_id fresh from the stores table rather
  // than trusting any store_id supplied by the caller, so writes can never
  // be pointed at a store the signed-in user doesn't own.
  const loadStoreAndProducts = async (ownerId: string) => {
    try {
      setLoading(true);
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', ownerId)
        .maybeSingle();
      if (storeError) throw storeError;

      if (!store) {
        setStoreId(null);
        setProducts([]);
        return;
      }
      setStoreId(store.id);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });
      if (error) throw error;

      setProducts((data as ProductRow[]).map(mapProductRowToProduct));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (data: ProductFormData) => {
    if (!storeId) {
      toast.error('No store selected');
      return;
    }
    try {
      const { data: created, error } = await supabase
        .from('products')
        .insert({
          store_id: storeId,
          name: data.name,
          description: data.description,
          price: data.price,
          currency: data.currency,
          images: data.images,
          category: data.category,
          stock: data.stock,
          availability: data.availability,
        })
        .select()
        .single();
      if (error) throw error;

      setProducts([mapProductRowToProduct(created as ProductRow), ...products]);
      toast.success('Product created successfully');
      setIsModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      toast.error(message);
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct || !storeId) return;

    try {
      const { data: updated, error } = await supabase
        .from('products')
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          currency: data.currency,
          images: data.images,
          category: data.category,
          stock: data.stock,
          availability: data.availability,
        })
        .eq('id', editingProduct.id)
        .eq('store_id', storeId)
        .select()
        .single();
      if (error) throw error;

      setProducts(products.map(p => p.id === editingProduct.id ? mapProductRowToProduct(updated as ProductRow) : p));
      toast.success('Product updated successfully');
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      toast.error(message);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    if (!storeId) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('store_id', storeId);
      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      toast.error(message);
    }
  };

  // Optimistic toggle so flipping availability feels instant; rolled back
  // on failure since the write still has to round-trip to Supabase.
  const handleToggleAvailability = async (product: Product) => {
    if (!storeId) return;
    const nextAvailability = !product.availability;
    setProducts(products.map(p => p.id === product.id ? { ...p, availability: nextAvailability } : p));

    try {
      const { error } = await supabase
        .from('products')
        .update({ availability: nextAvailability })
        .eq('id', product.id)
        .eq('store_id', storeId);
      if (error) throw error;
    } catch (error) {
      setProducts(products.map(p => p.id === product.id ? { ...p, availability: !nextAvailability } : p));
      const message = error instanceof Error ? error.message : 'Failed to update availability';
      toast.error(message);
    }
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!storeId) throw new Error('No store selected');
      const text = await file.text();
      const lines = text.trim().split(/\r?\n/);
      const [header, ...rows] = lines;
      const headers = header.split(',').map(h => h.trim().toLowerCase());

      const payloads = rows.map(row => {
        const cols = row.split(',').map(c => c.trim());
        const record: any = {};
        headers.forEach((h, i) => { record[h] = cols[i]; });
        return {
          store_id: storeId,
          name: record.name || '',
          description: record.description || '',
          price: parseFloat(record.price) || 0,
          currency: (record.currency === 'USD' ? 'USD' : 'NGN'),
          images: record.images ? record.images.split('|').map((s: string) => s.trim()).filter(Boolean) : [],
          category: record.category || 'Uncategorized',
          stock: parseInt(record.stock || '0', 10),
          availability: record.availability === 'false' ? false : true,
        };
      });

      const { data: created, error } = await supabase
        .from('products')
        .insert(payloads)
        .select();
      if (error) throw error;

      setProducts([...(created as ProductRow[]).map(mapProductRowToProduct), ...products]);
      toast.success('Products imported successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import products';
      toast.error(message);
    }
  };

  const handleExportCSV = async () => {
    try {
      const header = ['id','name','description','price','currency','category','stock','availability','images'];
      const rows = products.map(p => [
        p.id,
        p.name,
        p.description.replace(/\n/g, ' '),
        p.price.toString(),
        p.currency,
        p.category,
        p.stock.toString(),
        p.availability ? 'true' : 'false',
        (p.images || []).join('|'),
      ].map(v => `${v}`));
      const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Products exported successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export products';
      toast.error(message);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!storeId) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No store selected</h3>
        <p className="text-gray-600 mb-6">Select or create a store to start managing products.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/onboarding" className="btn btn-primary">Create store</Link>
          <Link to="/" className="btn btn-outline">Go to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-muted-foreground">Manage your store products</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex items-center min-h-[44px] px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Import
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
          
          <Button
            variant="outline"
            onClick={handleExportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 relative">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                      <span className="text-sm">No Image</span>
                    </div>
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => openEditModal(product)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(product.price, product.currency)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.stock} in stock
                  </span>
                </div>
                
                {product.category && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      {product.category}
                    </span>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available for sale</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={product.availability}
                    aria-label={`${product.availability ? 'Mark unavailable' : 'Mark available'}: ${product.name}`}
                    onClick={() => handleToggleAvailability(product)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                      product.availability ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        product.availability ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Product
          </button>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        product={editingProduct}
      />
    </div>
  );
};

export { ProductsPage };