import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncProducts, type SyncProductsDto } from "../api/products";

export function useSyncProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SyncProductsDto) => syncProducts(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["stockLogs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products-for-sync"],
      });
    },
  });
}
