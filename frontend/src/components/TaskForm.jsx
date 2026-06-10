import { useState } from 'react';
import { CalendarDays, Save } from 'lucide-react';
import { addDays } from '../utils/date.js';
import { categories, priorities } from '../utils/tasks.js';

const defaultForm = {
  title: '',
  description: '',
  category: 'Personal',
  priority: 'Medium',
  dueDate: addDays(1),
  reminderTime: '09:00',
  important: false
};

export default function TaskForm({ initialTask, onSubmit, onCancel, submitLabel = 'Save Task' }) {
  const [form, setForm] = useState(
    initialTask
      ? {
          title: initialTask.title,
          description: initialTask.description,
          category: initialTask.category,
          priority: initialTask.priority,
          dueDate: initialTask.dueDate,
          reminderTime: initialTask.reminderTime,
          important: initialTask.important
        }
      : defaultForm
  );
  const [errors, setErrors] = useState({});

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function validate() {
    const nextErrors = {};
    if (form.title.trim().length < 3) nextErrors.title = 'Task title must be at least 3 characters.';
    if (form.description.trim().length < 5) nextErrors.description = 'Description must be at least 5 characters.';
    if (!form.dueDate) nextErrors.dueDate = 'Due date is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    if (!initialTask) setForm(defaultForm);
  }

  const inputClass =
    'focus-ring w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white';

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <label className="grid gap-2 text-sm font-black text-slate-600 dark:text-slate-300">
        Task Title
        <input className={inputClass} name="title" value={form.title} onChange={updateField} placeholder="Plan tomorrow's work" />
        {errors.title && <span className="text-xs text-danger">{errors.title}</span>}
      </label>

      <label className="grid gap-2 text-sm font-black text-slate-600 dark:text-slate-300">
        Description
        <textarea
          className={inputClass}
          name="description"
          value={form.description}
          onChange={updateField}
          placeholder="Write task details"
          rows="4"
        />
        {errors.description && <span className="text-xs text-danger">{errors.description}</span>}
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-slate-600 dark:text-slate-300">
          Category
          <select className={inputClass} name="category" value={form.category} onChange={updateField}>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black text-slate-600 dark:text-slate-300">
          Priority
          <select className={inputClass} name="priority" value={form.priority} onChange={updateField}>
            {priorities.map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-slate-600 dark:text-slate-300">
          Due Date
          <input className={inputClass} type="date" name="dueDate" value={form.dueDate} onChange={updateField} />
          {errors.dueDate && <span className="text-xs text-danger">{errors.dueDate}</span>}
        </label>
        <label className="grid gap-2 text-sm font-black text-slate-600 dark:text-slate-300">
          Reminder Time
          <input className={inputClass} type="time" name="reminderTime" value={form.reminderTime} onChange={updateField} />
        </label>
      </div>

      <label className="flex items-center gap-3 rounded-2xl bg-slate-100 p-4 text-sm font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <input type="checkbox" name="important" checked={form.important} onChange={updateField} />
        Mark as important
      </label>

      <div className="flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-black text-white shadow-lg" type="submit">
          <Save className="h-4 w-4" />
          {submitLabel}
        </button>
        {onCancel && (
          <button className="rounded-2xl bg-slate-200 px-5 py-3 font-black text-slate-800 dark:bg-slate-800 dark:text-white" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
          <CalendarDays className="h-4 w-4" />
          LocalStorage persistence enabled
        </span>
      </div>
    </form>
  );
}
