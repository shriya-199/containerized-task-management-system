import { BarChart3, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import ProgressChart from '../components/ProgressChart.jsx';
import QuickAddTask from '../components/QuickAddTask.jsx';
import StatCard from '../components/StatCard.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { useTasks } from '../hooks/useTasks.js';

export default function DashboardPage() {
  const taskApi = useTasks();
  const { tasks, stats } = taskApi;
  const recent = tasks.slice(0, 3);
  const upcoming = [...tasks].filter((task) => task.status !== 'completed').slice(0, 3);

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Your productivity command center.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} />
        <StatCard title="Completed Tasks" value={stats.completed} icon={CheckCircle2} tone="success" />
        <StatCard title="Pending Tasks" value={stats.pending} icon={Clock} tone="warning" />
        <StatCard title="Productivity Score" value={`${stats.productivity}%`} icon={BarChart3} tone="danger" />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_390px]">
        <div className="grid gap-6">
          <div>
            <h2 className="mb-3 text-xl font-black">Recent Tasks</h2>
            <div className="grid gap-4">
              {recent.map((task) => (
                <TaskCard key={task.id} task={task} compact onComplete={taskApi.toggleComplete} onImportant={taskApi.toggleImportant} onDelete={(item) => taskApi.deleteTask(item.id)} onEdit={() => {}} onDropTask={taskApi.reorderTasks} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-black">Upcoming Tasks</h2>
            <div className="grid gap-4">
              {upcoming.map((task) => (
                <TaskCard key={task.id} task={task} compact onComplete={taskApi.toggleComplete} onImportant={taskApi.toggleImportant} onDelete={(item) => taskApi.deleteTask(item.id)} onEdit={() => {}} onDropTask={taskApi.reorderTasks} />
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-6">
          <ProgressChart />
          <QuickAddTask />
        </div>
      </section>
    </PageTransition>
  );
}
