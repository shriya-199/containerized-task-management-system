import { ClipboardList } from 'lucide-react';

export default function EmptyState({ title = 'No tasks found', message = 'Create a task or adjust filters.' }) {
  return (
    <div className="glass rounded-app p-10 text-center text-slate-900 dark:text-white">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <ClipboardList className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
