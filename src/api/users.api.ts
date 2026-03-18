import { z } from 'zod';
import api from './config';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'STAFF', 'WORKER']),
  active: z.boolean(),
});

export const CreateUserPayloadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'STAFF', 'WORKER']),
});

export const UpdateUserPayloadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'STAFF', 'WORKER']),
  active: z.boolean().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>;
export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;

export const getUsers = () =>
  api.get('/users').then((r) => z.array(UserSchema).parse(r.data));

export const createUser = (payload: CreateUserPayload) =>
  api.post('/users', payload).then((r) => UserSchema.parse(r.data));

export const updateUser = (id: string, payload: UpdateUserPayload) =>
  api.put(`/users/${id}`, payload).then((r) => UserSchema.parse(r.data));

export const updateUserPassword = (id: string, newPassword: string) =>
  api.put(`/users/${id}/password`, { newPassword }).then((r) => r.data);

export const deleteUser = (id: string) =>
  api.delete(`/users/${id}`).then((r) => r.data);
