export default function Skeleton({ rows = 3 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="glass animate-pulse rounded-app p-5" key={index}>
          <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="mt-4 h-5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
      ))}
    </div>
  );
}
