export interface User {
  id: string;
  email: string;
  name: string;
  location: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  location: string;
}