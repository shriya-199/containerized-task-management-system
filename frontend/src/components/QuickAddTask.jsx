import { useContext } from 'react';
import { Plus } from 'lucide-react';
import TaskForm from './TaskForm.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { ToastContext } from '../context/ToastContext.jsx';

export default function QuickAddTask() {
  const { addTask } = useTasks();
  const { notify } = useContext(ToastContext);

  return (
    <div className="glass rounded-app p-5 text-slate-900 dark:text-white">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Plus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black">Quick Add Task</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create a focused task in seconds.</p>
        </div>
      </div>
      <TaskForm
        submitLabel="Add Task"
        onSubmit={(input) => {
          addTask(input);
          notify('Task added successfully');
        }}
      />
    </div>
  );
}
