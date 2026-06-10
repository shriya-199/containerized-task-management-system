import { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Home,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Star,
  Sun,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme.js';
import { UserContext } from '../context/UserContext.jsx';

const links = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/tasks', label: 'All Tasks', icon: ListTodo },
  { to: '/app/completed', label: 'Completed Tasks', icon: CheckCircle2 },
  { to: '/app/pending', label: 'Pending Tasks', icon: Home },
  { to: '/app/important', label: 'Important', icon: Star },
  { to: '/app/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/settings', label: 'Settings', icon: Settings }
];

function Sidebar({ open, onClose }) {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-slate-950/50 lg:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose}></div>
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-105%' }}
        className="fixed left-0 top-0 z-40 flex h-screen w-80 flex-col border-r border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:sticky lg:translate-x-0"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-slate-950 dark:text-white">TaskFlow AI</p>
            <span className="text-xs font-bold uppercase text-primary">Smart productivity</span>
          </div>
          <button className="rounded-2xl bg-slate-100 p-2 dark:bg-slate-800 lg:hidden" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 grid gap-2">
          {links.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  isActive
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                }`
              }
              key={item.to}
              onClick={onClose}
              to={item.to}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto grid gap-3 rounded-app bg-slate-100 p-4 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary font-black text-white">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="truncate font-black text-slate-900 dark:text-white">{user.name}</p>
              <p className="truncate text-xs font-semibold text-slate-500">{user.email}</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-black text-danger dark:bg-slate-800" onClick={signOut} type="button">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    function handleShortcut(event) {
      const tagName = event.target.tagName.toLowerCase();
      if (event.key === '/' && !['input', 'textarea', 'select'].includes(tagName)) {
        event.preventDefault();
        navigate('/app/tasks');
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-paper text-slate-950 dark:bg-ink dark:text-white">
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-h-screen flex-1 p-4 lg:p-7">
          <header className="glass sticky top-4 z-20 mb-6 flex items-center justify-between gap-4 rounded-app px-4 py-3">
            <button className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-900 lg:hidden" onClick={() => setSidebarOpen(true)} type="button">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden max-w-md flex-1 items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-900 md:flex">
              <Search className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-semibold text-slate-500">Press / to search tasks</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-900" onClick={toggleTheme} type="button">
                {isDark ? <Sun className="h-5 w-5 text-warning" /> : <Moon className="h-5 w-5 text-primary" />}
              </button>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-sm font-black text-white">
                {user.avatar}
              </div>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
