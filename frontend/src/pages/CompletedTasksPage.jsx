import { useContext } from 'react';
import TaskListPage from './TaskListPage.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { useTasks } from '../hooks/useTasks.js';

export default function CompletedTasksPage() {
  const { deleteCompleted } = useTasks();
  const { notify } = useContext(ToastContext);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          className="rounded-2xl bg-danger px-5 py-3 font-black text-white"
          onClick={() => {
            deleteCompleted();
            notify('Completed tasks deleted', 'info');
          }}
          type="button"
        >
          Delete Permanently
        </button>
      </div>
      <TaskListPage mode="Completed" title="Completed Tasks" />
    </>
  );
}
