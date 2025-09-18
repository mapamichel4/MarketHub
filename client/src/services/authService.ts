import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

interface LoginResponse {
  user: any;
  token: string;
}

export const useAuthMutations = () => {
  const queryClient = useQueryClient();
  const { login, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: (data: LoginResponse) => {
      login(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      name: string;
      location: string;
    }) => {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: (data: LoginResponse) => {
      login(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      logout();
    },
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
  };
};