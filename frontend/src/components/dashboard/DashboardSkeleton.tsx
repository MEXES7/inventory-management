export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-9 w-52 rounded bg-slate-200" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-xl bg-white p-6 shadow">
            <div className="mb-6 flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-slate-200" />

              <div className="h-10 w-10 rounded-lg bg-slate-200" />
            </div>

            <div className="h-8 w-20 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="mb-6 h-6 w-48 rounded bg-slate-200" />

        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-4 last:border-b-0"
            >
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="h-3 w-28 rounded bg-slate-200" />
              </div>

              <div className="h-6 w-16 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
