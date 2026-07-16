import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../libs/socket";

export function useInventorySocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const refresh = () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    };

    socket.on("product.created", refresh);
    socket.on("product.updated", refresh);
    socket.on("product.deleted", refresh);
    socket.on("inventory.sync.completed", refresh);

    return () => {
      socket.off("product.created", refresh);
      socket.off("product.updated", refresh);
      socket.off("product.deleted", refresh);
      socket.off("inventory.sync.completed", refresh);
    };
  }, [queryClient]);
}
