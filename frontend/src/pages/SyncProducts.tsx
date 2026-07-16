import { useState } from "react";
import { useProductsForSync } from "../hooks/useProductsForSync";
import type { Product } from "../api/products";
import { useSyncProducts } from "../hooks/useSyncProduct";
import toast from "react-hot-toast";
import TableSkeleton from "../components/common/TableSkeleton";

export default function InventorySync() {
  const { data, isLoading } = useProductsForSync();
  const syncMutation = useSyncProducts();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleSync = () => {
    if (!data) return;

    const changedProducts = data
      .filter((product: Product) => {
        const newQuantity = quantities[product.id];

        return newQuantity !== undefined && newQuantity !== product.quantity;
      })
      .map((product: Product) => ({
        sku: product.sku,
        quantity: quantities[product.id],
      }));

    if (changedProducts.length === 0) {
      toast("No changes detected.");
      return;
    }

    syncMutation.mutate(
      {
        products: changedProducts,
      },
      {
        onSuccess: () => {
          toast.success("Inventory synchronized successfully.");
          setQuantities({});
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to synchronize inventory.");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-72 animate-pulse rounded bg-slate-200" />

        <TableSkeleton />

        <div className="flex justify-end">
          <div className="h-12 w-56 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory Synchronization</h1>

      <div className="overflow-hidden rounded-xl bg-white shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Current</th>
              <th className="p-4 text-left">New Quantity</th>
              <th className="p-4 text-left">Difference</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((product: Product) => {
              const newQuantity = quantities[product.id] ?? product.quantity;

              const difference = newQuantity - product.quantity;
              return (
                <tr
                  key={product.id}
                  className={`border-t transition-colors ${
                    quantities[product.id] !== undefined &&
                    quantities[product.id] !== product.quantity
                      ? "bg-yellow-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {" "}
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">{product.quantity}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      className="w-24 rounded border px-3 py-2"
                      value={quantities[product.id] ?? product.quantity}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [product.id]: Number(e.target.value),
                        }))
                      }
                    />
                  </td>
                  <td
                    className={`p-4 font-semibold ${
                      difference > 0
                        ? "text-green-600"
                        : difference < 0
                          ? "text-red-600"
                          : "text-gray-500"
                    }`}
                  >
                    {difference > 0 ? `+${difference}` : difference}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSync}
          disabled={syncMutation.isPending}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {syncMutation.isPending
            ? "Synchronizing..."
            : "Synchronize Inventory"}
        </button>
      </div>
    </div>
  );
}
