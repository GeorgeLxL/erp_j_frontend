import api from './config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  role: string;
  active?: boolean;
}

export const getUsers = () =>
  api.get<User[]>('/users').then((r) => r.data);

export const createUser = (payload: CreateUserPayload) =>
  api.post<User>('/users', payload).then((r) => r.data);

export const updateUser = (id: string, payload: UpdateUserPayload) =>
  api.put<User>(`/users/${id}`, payload).then((r) => r.data);

export const updateUserPassword = (id: string, newPassword: string) =>
  api.put<{ message: string }>(`/users/${id}/password`, { newPassword }).then((r) => r.data);

export const deleteUser = (id: string) =>
  api.delete<{ message: string }>(`/users/${id}`).then((r) => r.data);
