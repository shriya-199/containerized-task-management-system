import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chrome, Lock, Mail } from 'lucide-react';
import { UserContext } from '../context/UserContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [error, setError] = useState('');
  const { login } = useContext(UserContext);
  const { notify } = useContext(ToastContext);
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    login(form.email, form.remember);
    notify('Logged in successfully');
    navigate('/app/dashboard');
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper p-4 dark:bg-ink">
      <form className="glass w-full max-w-md rounded-[28px] p-8 text-slate-900 dark:text-white" onSubmit={submit}>
        <h1 className="text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">Login to continue using TaskFlow AI.</p>
        <label className="mt-6 grid gap-2 text-sm font-black">
          Email
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <Mail className="h-5 w-5 text-slate-400" />
            <input className="w-full bg-transparent outline-none" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
          </div>
        </label>
        <label className="mt-4 grid gap-2 text-sm font-black">
          Password
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <Lock className="h-5 w-5 text-slate-400" />
            <input className="w-full bg-transparent outline-none" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="******" />
          </div>
        </label>
        <div className="mt-4 flex items-center justify-between text-sm font-bold">
          <label className="flex items-center gap-2"><input checked={form.remember} onChange={(event) => setForm({ ...form, remember: event.target.checked })} type="checkbox" />Remember Me</label>
          <button className="text-primary" type="button">Forgot Password</button>
        </div>
        {error && <p className="mt-4 rounded-2xl bg-danger/10 p-3 text-sm font-bold text-danger">{error}</p>}
        <button className="mt-6 w-full rounded-2xl bg-primary py-3 font-black text-white" type="submit">Login</button>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 font-black dark:bg-slate-800" type="button">
          <Chrome className="h-5 w-5" /> Continue with Google
        </button>
        <p className="mt-5 text-center text-sm font-semibold text-slate-500">
          New here? <Link className="font-black text-primary" to="/signup">Sign Up</Link>
        </p>
      </form>
    </main>
  );
}
