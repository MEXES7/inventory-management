import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts, type ProductQuery } from "../api/products";

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => getProducts(query),
    placeholderData: keepPreviousData,
  });
}
