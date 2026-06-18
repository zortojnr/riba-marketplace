import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product, ProductFormData } from '@/types';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.enum(['NGN', 'USD']),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  availability: z.boolean(),
  images: z.array(z.string()),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void> | void;
  product?: Product | null;
}

const ProductFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, product }) => {
  const [imageInput, setImageInput] = useState('');
  const [images, setImages] = useState<string[]>(product?.images || []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      category: product.category,
      stock: product.stock,
      availability: product.availability,
      images: product.images,
    } : {
      name: '',
      description: '',
      price: 0,
      currency: 'NGN',
      category: '',
      stock: 0,
      availability: true,
      images: [],
    },
  });

  const stock = watch('stock');

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        category: product.category,
        stock: product.stock,
        availability: product.availability,
        images: product.images,
      });
      setImages(product.images);
    } else {
      reset();
      setImages([]);
    }
  }, [product, reset, isOpen]);

  const addImage = () => {
    if (!imageInput.trim()) return;
    if (images.length >= 5) {
      toast.error('Maximum 5 images');
      return;
    }
    const next = [...images, imageInput.trim()];
    setImages(next);
    setValue('images', next);
    setImageInput('');
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    setImages(next);
    setValue('images', next);
  };

  const changeStock = (dir: 'inc' | 'dec') => {
    const next = dir === 'inc' ? stock + 1 : Math.max(0, stock - 1);
    setValue('stock', next);
  };

  const submit = async (data: ProductFormData) => {
    try {
      await onSubmit({ ...data, images });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to save product';
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-card w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add Product'}</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(submit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input {...register('name')} className="input" placeholder="Product name" />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea {...register('description')} className="input min-h-[96px]" placeholder="Describe the product" />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="input" placeholder="0.00" />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select {...register('currency')} className="input">
                      <option value="NGN">NGN (₦)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                    {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input {...register('category')} className="input" placeholder="e.g., Electronics" />
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => changeStock('dec')} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Minus className="h-4 w-4" /></button>
                      <input readOnly {...register('stock', { valueAsNumber: true })} className="input text-center" />
                      <button type="button" onClick={() => changeStock('inc')} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Plus className="h-4 w-4" /></button>
                    </div>
                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" {...register('availability')} className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-gray-700">Available for sale</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images (max 5)</label>
                  <div className="flex gap-2 mb-2">
                    <input value={imageInput} onChange={(e) => setImageInput(e.target.value)} className="input" placeholder="Paste image URL" />
                    <button type="button" onClick={addImage} className="btn btn-outline inline-flex items-center gap-2" disabled={!imageInput.trim()}>
                      <Upload className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {images.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt={`Image ${i + 1}`} className="w-full h-16 object-cover rounded" />
                          <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="btn btn-outline flex-1">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
                    {isSubmitting ? 'Saving...' : product ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormModal;