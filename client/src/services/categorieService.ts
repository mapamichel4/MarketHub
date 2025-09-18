import apiClient from './api';

export interface Category {
  id: string;
  name: string;
}

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  createCategory: async (name: string): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', { name });
    return response.data;
  },
};

import { useQuery } from '@tanstack/react-query';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });
};