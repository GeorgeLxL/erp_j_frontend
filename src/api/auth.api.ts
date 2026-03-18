import api from './config';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'WORKER';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const signIn = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/signin', { email, password }).then((r) => r.data);

export const signUp = (name: string, email: string, password: string) =>
  api.post<{ message: string }>('/auth/signup', { name, email, password }).then((r) => r.data);

export const verifyEmail = (token: string) =>
  api.get<{ message: string }>(`/auth/verify-email/${token}`).then((r) => r.data);

export const resendVerification = (email: string) =>
  api.post<{ message: string }>('/auth/resend-verification', { email }).then((r) => r.data);

export const forgotPassword = (email: string) =>
  api.post<{ message: string }>('/auth/forgot-password', { email }).then((r) => r.data);

export const resetPassword = (token: string, newPassword: string) =>
  api.post<{ message: string }>(`/auth/reset-password/${token}`, { newPassword }).then((r) => r.data);

export const changePassword = (currentPassword: string, newPassword: string) =>
  api.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data);

export const getMe = () =>
  api.get<AuthUser>('/auth/me').then((r) => r.data);
