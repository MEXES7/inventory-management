import { useQuery } from "@tanstack/react-query";
import { getStockLogs } from "../api/stockLogs";

export function useStockLogs(page: number) {
  return useQuery({
    queryKey: ["stockLogs", page],
    queryFn: () => getStockLogs(page),
  });
}
