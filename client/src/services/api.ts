import { useAuthStore } from '../store/authStore';

export const apiClient = async (url: string, options: RequestInit = {}) => {
  const { token } = useAuthStore.getState();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`http://localhost:5000/api${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  }

  return response;
};