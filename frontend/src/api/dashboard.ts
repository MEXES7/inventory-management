import { api } from "./axios";

export interface DashboardResponse {
  totalProducts: number;
  totalUnits: number;
  lowStock: number;
  inStock: number;
  outOfStock: number;
  totalInventoryValue: number;
  recentLogs: {
    id: string;
    changeAmount: number;
    reason: string;
    timestamp: string;
    product: {
      id: string;
      name: string;
      sku: string;
      quantity: number;
    };
  }[];
}

export async function getDashboard() {
  const { data } = await api.get<DashboardResponse>("/dashboard");

  return data;
}
