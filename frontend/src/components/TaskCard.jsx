import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Edit3, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, isOverdue } from '../utils/date.js';

const priorityClass = {
  High: 'bg-danger/10 text-danger',
  Medium: 'bg-warning/10 text-warning',
  Low: 'bg-success/10 text-success'
};

export default function TaskCard({ task, onComplete, onImportant, onEdit, onDelete, onDropTask, compact = false }) {
  return (
    <motion.article
      layout
      draggable
      onDragStart={(event) => event.dataTransfer.setData('taskId', task.id)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onDropTask?.(event.dataTransfer.getData('taskId'), task.id)}
      whileHover={{ y: -3 }}
      className={`glass rounded-app p-5 text-slate-900 dark:text-white ${task.status === 'completed' ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-black ${priorityClass[task.priority]}`}>{task.priority}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {task.category}
            </span>
            {isOverdue(task) && <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-black text-danger">Overdue</span>}
          </div>
          <Link to={`/app/tasks/${task.id}`} className="block truncate text-lg font-black hover:text-primary">
            {task.title}
          </Link>
          {!compact && <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>}
        </div>
        <button className="rounded-2xl bg-slate-100 p-2 dark:bg-slate-800" onClick={() => onImportant(task.id)} type="button">
          <Star className={`h-5 w-5 ${task.important ? 'fill-warning text-warning' : 'text-slate-400'}`} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
          <Calendar className="h-4 w-4" />
          {formatDate(task.dueDate)}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${task.status === 'completed' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
          {task.status === 'completed' ? 'Completed' : 'Pending'}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-xl bg-success/10 px-3 py-2 text-sm font-black text-success" onClick={() => onComplete(task.id)} type="button">
          <CheckCircle2 className="mr-1 inline h-4 w-4" />
          {task.status === 'completed' ? 'Restore' : 'Complete'}
        </button>
        <button className="rounded-xl bg-primary/10 px-3 py-2 text-sm font-black text-primary" onClick={() => onEdit(task)} type="button">
          <Edit3 className="mr-1 inline h-4 w-4" />
          Edit
        </button>
        <button className="rounded-xl bg-danger/10 px-3 py-2 text-sm font-black text-danger" onClick={() => onDelete(task)} type="button">
          <Trash2 className="mr-1 inline h-4 w-4" />
          Delete
        </button>
      </div>
    </motion.article>
  );
}
