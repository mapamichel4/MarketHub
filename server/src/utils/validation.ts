import { z } from 'zod';

// Schema for user registration
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
}).strict(); // .strict() ensures no extra fields are passed

// Schema for user login
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
}).strict();

// Type inference for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;