import { useContext, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Calendar, CheckCircle2, Edit3, Star, Trash2 } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import PageTransition from '../components/PageTransition.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { formatDate } from '../utils/date.js';

export default function TaskDetailsPage() {
  const { id } = useParams();
  const { tasks, updateTask, deleteTask, toggleComplete, toggleImportant } = useTasks();
  const { notify } = useContext(ToastContext);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return (
      <PageTransition>
        <div className="glass rounded-app p-8">
          <h1 className="text-2xl font-black">Task not found</h1>
          <Link className="mt-4 inline-flex rounded-2xl bg-primary px-5 py-3 font-black text-white" to="/app/tasks">Back to tasks</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="glass rounded-app p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">{task.title}</h1>
            <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{task.description}</p>
          </div>
          <button className="rounded-2xl bg-warning/10 p-3 text-warning" onClick={() => toggleImportant(task.id)} type="button">
            <Star className={`h-6 w-6 ${task.important ? 'fill-warning' : ''}`} />
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Status', task.status],
            ['Category', task.category],
            ['Priority', task.priority],
            ['Due Date', formatDate(task.dueDate)]
          ].map(([label, value]) => (
            <div className="rounded-app bg-slate-100 p-4 dark:bg-slate-900" key={label}>
              <p className="text-xs font-black uppercase text-slate-500">{label}</p>
              <p className="mt-2 font-black capitalize">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-2xl bg-success px-5 py-3 font-black text-white" onClick={() => toggleComplete(task.id)} type="button">
            <CheckCircle2 className="mr-2 inline h-5 w-5" />
            {task.status === 'completed' ? 'Restore' : 'Complete'}
          </button>
          <button className="rounded-2xl bg-primary px-5 py-3 font-black text-white" onClick={() => setEditing(true)} type="button">
            <Edit3 className="mr-2 inline h-5 w-5" />
            Edit
          </button>
          <button className="rounded-2xl bg-danger px-5 py-3 font-black text-white" onClick={() => { deleteTask(task.id); notify('Task deleted'); navigate('/app/tasks'); }} type="button">
            <Trash2 className="mr-2 inline h-5 w-5" />
            Delete
          </button>
        </div>
      </div>

      <section className="glass mt-6 rounded-app p-6">
        <h2 className="text-xl font-black">Comments</h2>
        <div className="mt-4 grid gap-3">
          {(task.comments.length ? task.comments : ['No comments yet. Add notes while editing this task.']).map((comment, index) => (
            <div className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300" key={`${comment}-${index}`}>
              {comment}
            </div>
          ))}
        </div>
      </section>

      <section className="glass mt-6 rounded-app p-6">
        <h2 className="text-xl font-black">Timeline</h2>
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
          <Calendar className="h-4 w-4" />
          Created on {formatDate(task.createdAt.slice(0, 10))}
        </p>
      </section>

      {editing && (
        <Modal title="Edit Task" onClose={() => setEditing(false)}>
          <TaskForm initialTask={task} onSubmit={(input) => { updateTask(task.id, input); notify('Task updated'); setEditing(false); }} submitLabel="Update Task" />
        </Modal>
      )}
    </PageTransition>
  );
}
