import api from './config';

// Products
export interface Product {
  smaregiId: string;
  name: string;
  partNumber: string;
  supplierName: string;
  price: number;
}

export const searchProducts = (q: string) =>
  api.get<Product[]>(`/products?q=${encodeURIComponent(q)}`).then((r) => r.data);

export const getProducts = () =>
  api.get<Product[]>('/products').then((r) => r.data);

// Customers
export interface Customer {
  id: string;
  name: string;
  faxNumber: string | null;
  address: string | null;
}

export const getCustomers = () =>
  api.get<Customer[]>('/customers').then((r) => r.data);

// Documents
export interface Document {
  id: string;
  type: string;
  filePath: string;
  createdAt: string;
  caseId: string;
}

export const getDocuments = (caseId: string) =>
  api.get<Document[]>(`/documents/${caseId}`).then((r) => r.data);

export const createDocument = (caseId: string, type: string, includeInternal: boolean) =>
  api.post<{ document: Document; filePath: string }>(`/documents/${caseId}`, { type, includeInternal }).then((r) => r.data);

// Fax
export const sendFax = (caseId: string, documentId: string) =>
  api.post<{ message: string; success: boolean }>(`/fax/${caseId}`, { documentId }).then((r) => r.data);
