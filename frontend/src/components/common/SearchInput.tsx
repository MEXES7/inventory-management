import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full md:w-80">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or SKU..."
        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none transition focus:border-blue-500"
      />
    </div>
  );
}
