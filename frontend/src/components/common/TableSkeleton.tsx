interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({
  rows = 8,
  columns = 6,
}: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="min-w-full animate-pulse">
        <thead className="bg-slate-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="p-4">
                <div className="h-4 w-20 rounded bg-slate-200" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row} className="border-t">
              {Array.from({ length: columns }).map((_, col) => (
                <td key={col} className="p-4">
                  <div className="h-4 rounded bg-slate-200" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
