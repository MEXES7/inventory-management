import type { ProductFormData } from "../schema/product";
import { api } from "./axios";

export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface SyncProductItem {
  sku: string;
  quantity: number;
}

export interface SyncProductsDto {
  products: SyncProductItem[];
}

export async function getProducts(query: ProductQuery) {
  const params: Record<string, string | number> = {
    page: query.page ?? 1,
    limit: query.limit ?? 10,
  };

  if (query.search?.trim()) {
    params.search = query.search.trim();
  }

  if (query.status) {
    params.status = query.status;
  }

  const { data } = await api.get("/products", {
    params,
  });

  return data;
}

export async function getProductsForSync() {
  const { data } = await api.get("/products/for-sync");
  return data;
}

export async function createProduct(data: ProductFormData) {
  const response = await api.post("/products", data);

  return response.data;
}

export async function updateProduct(id: string, data: ProductFormData) {
  const response = await api.patch(`/products/${id}`, data);

  return response.data;
}

export async function deleteProduct(id: string) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

export async function syncProducts(payload: SyncProductsDto) {
  const { data } = await api.post("/products/sync", payload);
  return data;
}
