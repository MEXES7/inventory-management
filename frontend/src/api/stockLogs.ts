import { api } from "./axios";

export interface StockLog {
  id: string;
  changeAmount: number;
  reason: "RESTOCK" | "SALE";
  timestamp: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
}

export interface StockLogsResponse {
  data: StockLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getStockLogs(page = 1, limit = 10) {
  const { data } = await api.get<StockLogsResponse>("/stock-logs", {
    params: {
      page,
      limit,
    },
  });

  return data;
}
