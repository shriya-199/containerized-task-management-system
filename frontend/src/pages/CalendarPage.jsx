import PageTransition from '../components/PageTransition.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { formatDate, toISODate } from '../utils/date.js';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const today = new Date();
  const days = Array.from({ length: 35 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), index + 1);
    const iso = toISODate(date);
    return { iso, day: date.getDate(), tasks: tasks.filter((task) => task.dueDate === iso) };
  });

  return (
    <PageTransition>
      <h1 className="text-3xl font-black">Calendar</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">Monthly view with tasks on due dates.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5 lg:grid-cols-7">
        {days.map((day) => (
          <div className="glass min-h-36 rounded-app p-4" key={day.iso}>
            <div className="flex items-center justify-between">
              <strong>{day.day}</strong>
              <span className="text-xs font-bold text-slate-400">{formatDate(day.iso).split(' ')[1]}</span>
            </div>
            <div className="mt-3 grid gap-2">
              {day.tasks.map((task) => (
                <div className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-black text-primary" key={task.id}>{task.title}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
