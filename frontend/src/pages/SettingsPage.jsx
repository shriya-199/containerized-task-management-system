import { useContext, useState } from 'react';
import { Bell, Mail, Trash2 } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { UserContext } from '../context/UserContext.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { useTheme } from '../hooks/useTheme.js';

export default function SettingsPage() {
  const { user, setUser } = useContext(UserContext);
  const { notify } = useContext(ToastContext);
  const { deleteAll } = useTasks();
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState({ notifications: true, email: false });

  return (
    <PageTransition>
      <h1 className="text-3xl font-black">Settings</h1>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="glass rounded-app p-6">
          <h2 className="text-xl font-black">Profile</h2>
          <div className="mt-4 grid gap-4">
            <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900" value={user.name} onChange={(event) => setUser({ ...user, name: event.target.value })} />
            <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900" value={user.email} onChange={(event) => setUser({ ...user, email: event.target.value })} />
          </div>
        </section>
        <section className="glass rounded-app p-6">
          <h2 className="text-xl font-black">Theme</h2>
          <div className="mt-4 flex gap-3">
            {['light', 'dark'].map((item) => (
              <button className={`rounded-2xl px-5 py-3 font-black ${theme === item ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-900'}`} key={item} onClick={() => setTheme(item)} type="button">
                {item}
              </button>
            ))}
          </div>
        </section>
        <section className="glass rounded-app p-6">
          <h2 className="text-xl font-black">Preferences</h2>
          <div className="mt-4 grid gap-3">
            <Toggle label="Notifications" icon={Bell} checked={prefs.notifications} onChange={() => setPrefs({ ...prefs, notifications: !prefs.notifications })} />
            <Toggle label="Email Reminders" icon={Mail} checked={prefs.email} onChange={() => setPrefs({ ...prefs, email: !prefs.email })} />
          </div>
        </section>
        <section className="glass rounded-app border border-danger/30 p-6">
          <h2 className="text-xl font-black text-danger">Danger Zone</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">This clears all tasks from localStorage.</p>
          <button className="mt-5 rounded-2xl bg-danger px-5 py-3 font-black text-white" onClick={() => { deleteAll(); notify('All tasks deleted', 'error'); }} type="button">
            <Trash2 className="mr-2 inline h-5 w-5" />
            Delete All Tasks
          </button>
        </section>
      </div>
    </PageTransition>
  );
}

function Toggle({ label, icon: Icon, checked, onChange }) {
  return (
    <button className="flex items-center justify-between rounded-2xl bg-slate-100 p-4 dark:bg-slate-900" onClick={onChange} type="button">
      <span className="flex items-center gap-3 font-black"><Icon className="h-5 w-5 text-primary" />{label}</span>
      <span className={`h-6 w-11 rounded-full p-1 ${checked ? 'bg-primary' : 'bg-slate-300'}`}>
        <span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-5' : ''}`}></span>
      </span>
    </button>
  );
}
