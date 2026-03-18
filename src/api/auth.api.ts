import { z } from 'zod';
import api from './config';

export const AuthUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'STAFF', 'WORKER']),
});

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: AuthUserSchema,
});

export const MessageResponseSchema = z.object({
  message: z.string(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const signIn = (email: string, password: string) =>
  api.post('/auth/signin', { email, password }).then((r) => AuthResponseSchema.parse(r.data));

export const signUp = (name: string, email: string, password: string) =>
  api.post('/auth/signup', { name, email, password }).then((r) => MessageResponseSchema.parse(r.data));

export const verifyEmail = (token: string) =>
  api.get(`/auth/verify-email/${token}`).then((r) => MessageResponseSchema.parse(r.data));

export const resendVerification = (email: string) =>
  api.post('/auth/resend-verification', { email }).then((r) => MessageResponseSchema.parse(r.data));

export const forgotPassword = (email: string) =>
  api.post('/auth/forgot-password', { email }).then((r) => MessageResponseSchema.parse(r.data));

export const resetPassword = (token: string, newPassword: string) =>
  api.post(`/auth/reset-password/${token}`, { newPassword }).then((r) => MessageResponseSchema.parse(r.data));

export const changePassword = (currentPassword: string, newPassword: string) =>
  api.post('/auth/change-password', { currentPassword, newPassword }).then((r) => MessageResponseSchema.parse(r.data));

export const getMe = () =>
  api.get('/auth/me').then((r) => AuthUserSchema.parse(r.data));
