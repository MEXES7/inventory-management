import {
  Boxes,
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
} from "lucide-react";

import { useDashboard } from "../hooks/useDashboard";
import RecentActivity from "../components/dashboard/RecentActivity";
import StatCard from "../components/dashboard/StatCard";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import InventoryStatusChart from "../components/dashboard/InventoryStatusChart";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  if (error || !data) return <h2>Failed to load dashboard.</h2>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {" "}
        <StatCard title="Products" value={data.totalProducts} icon={Package} />
        <StatCard title="Units" value={data.totalUnits} icon={Boxes} />
        <StatCard
          title="Low Stock"
          value={data.lowStock}
          icon={AlertTriangle}
        />
        <StatCard title="Out of Stock" value={data.outOfStock} icon={XCircle} />
        <StatCard
          title="Inventory Value"
          value={`₦${data.totalInventoryValue.toLocaleString()}`}
          icon={DollarSign}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <InventoryStatusChart
          inStock={data.inStock}
          lowStock={data.lowStock}
          outOfStock={data.outOfStock}
        />

        <RecentActivity logs={data.recentLogs} />
      </div>{" "}
    </div>
  );
}
