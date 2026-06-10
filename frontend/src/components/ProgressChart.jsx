import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useTasks } from '../hooks/useTasks.js';

export default function ProgressChart() {
  const { stats } = useTasks();
  const data = [
    { name: 'Completed', value: stats.completed, color: '#22C55E' },
    { name: 'Pending', value: stats.pending, color: '#6366F1' }
  ];

  return (
    <div className="glass rounded-app p-5 text-slate-900 dark:text-white">
      <h2 className="text-lg font-black">Task Progress</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={62} outerRadius={90} paddingAngle={5} dataKey="value">
              {data.map((entry) => (
                <Cell fill={entry.color} key={entry.name} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <strong className="text-3xl font-black">{stats.productivity}%</strong>
        <p className="text-sm font-semibold text-slate-500">Productivity Score</p>
      </div>
    </div>
  );
}
