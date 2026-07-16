type Status = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    IN_STOCK: "bg-green-100 text-green-700",
    LOW_STOCK: "bg-yellow-100 text-yellow-700",
    OUT_OF_STOCK: "bg-red-100 text-red-700",
  };

  const labels = {
    IN_STOCK: "In Stock",
    LOW_STOCK: "Low Stock",
    OUT_OF_STOCK: "Out of Stock",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
