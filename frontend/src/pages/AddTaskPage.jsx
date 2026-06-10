import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { useTasks } from '../hooks/useTasks.js';

export default function AddTaskPage() {
  const { addTask } = useTasks();
  const { notify } = useContext(ToastContext);
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black">Add Task</h1>
        <div className="glass mt-6 rounded-app p-6">
          <TaskForm
            onSubmit={(input) => {
              addTask(input);
              notify('Task saved successfully');
              navigate('/app/tasks');
            }}
            onCancel={() => navigate('/app/tasks')}
          />
        </div>
      </div>
    </PageTransition>
  );
}
