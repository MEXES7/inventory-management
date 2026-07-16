import { useState } from "react";
import { useStockLogs } from "../hooks/useStockLogs";
import Pagination from "../components/common/Pagination";
import { ArrowDown, ArrowUp } from "lucide-react";
import TableSkeleton from "../components/common/TableSkeleton";

export default function StockLogs() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useStockLogs(page);

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-48 animate-pulse rounded bg-slate-200" />

        <TableSkeleton rows={10} columns={5} />

        <div className="flex justify-center">
          <div className="h-10 w-56 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  console.log(data);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Stock Logs</h1>

      <div className="rounded-xl bg-white shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Change</th>
              <th className="p-4 text-left">Reason</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {data?.data.map((log) => (
              <tr
                key={log.id}
                className="border-t hover:bg-slate-50 transition-colors"
              >
                {" "}
                <td className="p-4">{log.product.name}</td>
                <td className="p-4">{log.product.sku}</td>
                <td className="p-4">
                  <div
                    className={`flex items-center gap-1 font-semibold ${
                      log.changeAmount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {log.changeAmount > 0 ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}

                    {log.changeAmount > 0
                      ? `+${log.changeAmount}`
                      : log.changeAmount}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      log.reason === "RESTOCK"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.reason === "RESTOCK" ? "Restock" : "Sale"}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
