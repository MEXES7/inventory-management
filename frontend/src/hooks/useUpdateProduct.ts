import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../api/products";
import type { ProductFormData } from "../schema/product";

interface UpdateProductPayload {
  id: string;
  data: ProductFormData;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductPayload) => updateProduct(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}
