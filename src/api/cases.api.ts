import { z } from 'zod';
import api from './config';

export const CaseItemSchema = z.object({
  id: z.string(),
  partNumberRaw: z.string(),
  quantity: z.number(),
  productId: z.string().nullable().optional(),
  product: z.object({
    name: z.string(),
    partNumber: z.string(),
    price: z.number().nullable(),
  }).nullable().optional(),
});

export const CaseSchema = z.object({
  id: z.string(),
  vehicleType: z.string(),
  workDate: z.string(),
  notes: z.string().nullable(),
  internalNotes: z.string().nullable(),
  status: z.string(),
  faxSent: z.boolean(),
  printed: z.boolean(),
  invoiceNumber: z.string().nullable(),
  customer: z.object({
    id: z.string(),
    name: z.string(),
    faxNumber: z.string().nullable(),
    address: z.string().nullable(),
  }),
  worker: z.object({
    id: z.string(),
    name: z.string(),
  }),
  items: z.array(CaseItemSchema),
});

export const CreateCasePayloadSchema = z.object({
  vehicleType: z.string().min(1),
  customerId: z.string().min(1),
  workDate: z.string(),
  notes: z.string(),
  internalNotes: z.string(),
  items: z.array(z.object({
    partNumberRaw: z.string().min(1),
    quantity: z.number().min(1),
  })),
});

export const UpdateCasePayloadSchema = z.object({
  vehicleType: z.string().optional(),
  customerId: z.string().optional(),
  workDate: z.string().optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  status: z.string().optional(),
  faxSent: z.boolean().optional(),
  printed: z.boolean().optional(),
  items: z.array(z.object({
    partNumberRaw: z.string(),
    quantity: z.number(),
    productId: z.string().nullable().optional(),
  })).optional(),
});

export type CaseItem = z.infer<typeof CaseItemSchema>;
export type Case = z.infer<typeof CaseSchema>;
export type CreateCasePayload = z.infer<typeof CreateCasePayloadSchema>;
export type UpdateCasePayload = z.infer<typeof UpdateCasePayloadSchema>;

export const getCases = () =>
  api.get('/cases').then((r) => z.array(CaseSchema).parse(r.data));

export const getCase = (id: string) =>
  api.get(`/cases/${id}`).then((r) => CaseSchema.parse(r.data));

export const createCase = (payload: CreateCasePayload) =>
  api.post('/cases', payload).then((r) => CaseSchema.parse(r.data));

export const updateCase = (id: string, payload: UpdateCasePayload) =>
  api.put(`/cases/${id}`, payload).then((r) => CaseSchema.parse(r.data));

export const deleteCase = (id: string) =>
  api.delete(`/cases/${id}`).then((r) => r.data);
