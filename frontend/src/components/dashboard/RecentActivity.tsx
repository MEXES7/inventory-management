import type { DashboardResponse } from "../../api/dashboard";

interface Props {
  logs: DashboardResponse["recentLogs"];
}

export default function RecentActivity({ logs }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold">Recent Stock Activity</h2>
      </div>

      <div className="space-y-4 p-6">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div>
              <p className="font-medium">{log.product.name}</p>
              <p className="text-sm text-gray-500">{log.reason}</p>
            </div>

            <span
              className={
                log.changeAmount > 0 ? "text-green-600" : "text-red-600"
              }
            >
              {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
