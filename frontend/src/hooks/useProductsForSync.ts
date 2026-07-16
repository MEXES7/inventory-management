import { useQuery } from "@tanstack/react-query";
import { getProductsForSync } from "../api/products";

export function useProductsForSync() {
  return useQuery({
    queryKey: ["products-for-sync"],
    queryFn: getProductsForSync,
  });
}
