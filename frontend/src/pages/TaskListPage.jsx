import { useContext, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import PageTransition from '../components/PageTransition.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskFilters from '../components/TaskFilters.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { sortTasks } from '../utils/tasks.js';

export default function TaskListPage({ mode = 'All', title = 'All Tasks' }) {
  const taskApi = useTasks();
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, toggleImportant, reorderTasks } = taskApi;
  const { notify } = useContext(ToastContext);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(mode);
  const [sort, setSort] = useState('Date');
  const [view, setView] = useState('grid');
  const [modal, setModal] = useState(null);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const byStatus = tasks.filter((task) => {
      const activeFilter = mode !== 'All' ? mode : filter;
      if (activeFilter === 'Completed') return task.status === 'completed';
      if (activeFilter === 'Pending') return task.status !== 'completed';
      if (activeFilter === 'Important') return task.important;
      return true;
    });
    const searched = byStatus.filter((task) =>
      [task.title, task.description, task.category].some((value) => value.toLowerCase().includes(query))
    );
    return sortTasks(searched, sort);
  }, [filter, mode, search, sort, tasks]);

  const suggestions = tasks.map((task) => task.title).filter((title) => title.toLowerCase().includes(search.toLowerCase()));

  function confirmDelete(task) {
    setModal({ type: 'delete', task });
  }

  return (
    <PageTransition>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">{title}</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Search, sort, drag, edit, and complete tasks.</p>
        </div>
        <button className="rounded-2xl bg-primary px-5 py-3 font-black text-white shadow-lg" onClick={() => setModal({ type: 'add' })} type="button">
          Add Task
        </button>
      </div>
      <TaskFilters search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} sort={sort} setSort={setSort} view={view} setView={setView} suggestions={suggestions} />
      <section className={`mt-5 grid gap-4 ${view === 'grid' ? 'lg:grid-cols-2' : ''}`}>
        {filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onComplete={toggleComplete} onImportant={toggleImportant} onEdit={(item) => setModal({ type: 'edit', task: item })} onDelete={confirmDelete} onDropTask={reorderTasks} />
          ))
        )}
      </section>
      <AnimatePresence>
        {modal?.type === 'add' && (
          <Modal title="Add Task" onClose={() => setModal(null)}>
            <TaskForm onSubmit={(input) => { addTask(input); notify('Task added'); setModal(null); }} submitLabel="Save Task" />
          </Modal>
        )}
        {modal?.type === 'edit' && (
          <Modal title="Edit Task" onClose={() => setModal(null)}>
            <TaskForm initialTask={modal.task} onSubmit={(input) => { updateTask(modal.task.id, input); notify('Task updated'); setModal(null); }} submitLabel="Update Task" />
          </Modal>
        )}
        {modal?.type === 'delete' && (
          <Modal title="Delete Task" onClose={() => setModal(null)}>
            <p className="text-slate-600 dark:text-slate-300">Delete "{modal.task.title}" permanently?</p>
            <div className="mt-5 flex gap-3">
              <button className="rounded-2xl bg-danger px-5 py-3 font-black text-white" onClick={() => { deleteTask(modal.task.id); notify('Task deleted', 'info'); setModal(null); }} type="button">Delete</button>
              <button className="rounded-2xl bg-slate-200 px-5 py-3 font-black dark:bg-slate-800" onClick={() => setModal(null)} type="button">Cancel</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
