import { z } from 'zod';
import api from './config';

// Products
export const ProductSchema = z.object({
  smaregiId: z.string(),
  name: z.string(),
  partNumber: z.string(),
  supplierName: z.string(),
  price: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;

export const searchProducts = (q: string) =>
  api.get(`/products?q=${encodeURIComponent(q)}`).then((r) => z.array(ProductSchema).parse(r.data));

export const getProducts = () =>
  api.get('/products').then((r) => z.array(ProductSchema).parse(r.data));

// Customers
export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  faxNumber: z.string().nullable(),
  address: z.string().nullable(),
});

export type Customer = z.infer<typeof CustomerSchema>;

export const getCustomers = () =>
  api.get('/customers').then((r) => z.array(CustomerSchema).parse(r.data));

// Documents
export const DocumentSchema = z.object({
  id: z.string(),
  type: z.string(),
  filePath: z.string(),
  createdAt: z.string(),
  caseId: z.string(),
});

export type Document = z.infer<typeof DocumentSchema>;

export const getDocuments = (caseId: string) =>
  api.get(`/documents/${caseId}`).then((r) => z.array(DocumentSchema).parse(r.data));

export const createDocument = (caseId: string, type: string, includeInternal: boolean) =>
  api.post(`/documents/${caseId}`, { type, includeInternal }).then((r) =>
    z.object({ document: DocumentSchema, filePath: z.string() }).parse(r.data)
  );

// Fax
export const sendFax = (caseId: string, documentId: string) =>
  api.post(`/fax/${caseId}`, { documentId }).then((r) =>
    z.object({ message: z.string(), success: z.boolean() }).parse(r.data)
  );
