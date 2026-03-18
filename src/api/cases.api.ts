import api from './config';

export interface CaseItem {
  id: string;
  partNumberRaw: string;
  quantity: number;
  productId?: string | null;
  product?: { name: string; partNumber: string; price: number | null } | null;
}

export interface Case {
  id: string;
  vehicleType: string;
  workDate: string;
  notes: string | null;
  internalNotes: string | null;
  status: string;
  faxSent: boolean;
  printed: boolean;
  invoiceNumber: string | null;
  customer: { id: string; name: string; faxNumber: string | null; address: string | null };
  worker: { id: string; name: string };
  items: CaseItem[];
}

export interface CreateCasePayload {
  vehicleType: string;
  customerId: string;
  workDate: string;
  notes: string;
  internalNotes: string;
  items: { partNumberRaw: string; quantity: number }[];
}

export interface UpdateCasePayload {
  vehicleType?: string;
  customerId?: string;
  workDate?: string;
  notes?: string;
  internalNotes?: string;
  status?: string;
  faxSent?: boolean;
  printed?: boolean;
  items?: { partNumberRaw: string; quantity: number; productId?: string | null }[];
}

export const getCases = () =>
  api.get<Case[]>('/cases').then((r) => r.data);

export const getCase = (id: string) =>
  api.get<Case>(`/cases/${id}`).then((r) => r.data);

export const createCase = (payload: CreateCasePayload) =>
  api.post<Case>('/cases', payload).then((r) => r.data);

export const updateCase = (id: string, payload: UpdateCasePayload) =>
  api.put<Case>(`/cases/${id}`, payload).then((r) => r.data);

export const deleteCase = (id: string) =>
  api.delete<{ message: string }>(`/cases/${id}`).then((r) => r.data);
