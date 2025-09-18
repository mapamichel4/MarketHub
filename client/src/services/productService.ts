import apiClient from './api';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  categoryId: string;
  userId: string;
  category: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    location: string;
  };
  createdAt: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  images?: string[];
  quantity: number;
  categoryId: string;
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: number;
  images?: string[];
  quantity?: number;
  categoryId?: string;
}

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, updates: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, updates);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });
};

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};