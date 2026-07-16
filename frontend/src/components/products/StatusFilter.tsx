interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function StatusFilter({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
    >
      <option value="">All Status</option>
      <option value="IN_STOCK">In Stock</option>
      <option value="LOW_STOCK">Low Stock</option>
      <option value="OUT_OF_STOCK">Out of Stock</option>
    </select>
  );
}
