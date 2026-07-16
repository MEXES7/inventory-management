import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export default function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>
        </div>

        <div className="rounded-lg bg-blue-100 p-3">
          <Icon className="text-blue-600" size={28} />
        </div>
      </div>
    </div>
  );
}
