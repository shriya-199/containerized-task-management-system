import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import StatCard from '../components/StatCard.jsx';
import { useTasks } from '../hooks/useTasks.js';

export default function AnalyticsPage() {
  const { tasks, stats } = useTasks();
  const categories = Object.entries(tasks.reduce((acc, task) => ({ ...acc, [task.category]: (acc[task.category] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
  const priority = Object.entries(tasks.reduce((acc, task) => ({ ...acc, [task.priority]: (acc[task.priority] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
  const weekly = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => ({ day, completed: Math.max(0, stats.completed - index + 2) }));

  return (
    <PageTransition>
      <h1 className="text-3xl font-black">Analytics</h1>
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} tone="success" />
        <StatCard title="Pending" value={stats.pending} icon={Clock} tone="warning" />
        <StatCard title="Productivity" value={`${stats.productivity}%`} icon={BarChart3} />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="glass rounded-app p-5">
          <h2 className="text-xl font-black">Weekly Productivity</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#6366F1" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <ChartCard title="Category Distribution" data={categories} />
        <ChartCard title="Priority Distribution" data={priority} />
        <div className="glass rounded-app p-5">
          <h2 className="text-xl font-black">Task Completion Rate</h2>
          <p className="mt-5 text-6xl font-black text-primary">{stats.productivity}%</p>
          <p className="mt-3 font-semibold text-slate-500">Completed tasks divided by total tasks.</p>
        </div>
      </section>
    </PageTransition>
  );
}

function ChartCard({ title, data }) {
  const colors = ['#6366F1', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444'];
  return (
    <div className="glass rounded-app p-5">
      <h2 className="text-xl font-black">{title}</h2>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={92} label>
              {data.map((entry, index) => (
                <Cell fill={colors[index % colors.length]} key={entry.name} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
