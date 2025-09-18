import apiClient from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  location: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    location: string;
    createdAt: string;
  };
  token: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    const response = await apiClient.get<AuthResponse['user']>('/auth/me');
    return response.data;
  },
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

export const useAuthMutations = () => {
  const queryClient = useQueryClient();
  const { login, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      login(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      throw new Error(error.response?.data?.message || "Erreur d'inscription");
    },
  });

  return {
    loginMutation,
    registerMutation,
  };
};