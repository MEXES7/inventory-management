import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function InventoryStatusChart({
  inStock,
  lowStock,
  outOfStock,
}: Props) {
  const data = [
    { name: "In Stock", value: inStock },
    { name: "Low Stock", value: lowStock },
    { name: "Out of Stock", value: outOfStock },
  ];

  if (inStock + lowStock + outOfStock === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl bg-white shadow">
        <p className="text-gray-500">No inventory data available.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-xl bg-white p-4 shadow md:p-6">
      <h2 className="mb-4 text-lg font-semibold">Inventory Status</h2>

      <div className="h-64 sm:h-72 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="45%"
              innerRadius="45%"
              outerRadius="70%"
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />

            <Legend verticalAlign="bottom" align="center" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
