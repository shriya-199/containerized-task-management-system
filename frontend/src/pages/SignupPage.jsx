import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { UserContext } from '../context/UserContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const { signup } = useContext(UserContext);
  const { notify } = useContext(ToastContext);
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    if (form.name.trim().length < 3) return setError('Full name must be at least 3 characters.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (!/(?=.*[A-Z])(?=.*[0-9]).{8,}/.test(form.password)) return setError('Password needs 8 characters, one capital letter and one number.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    signup(form.name, form.email);
    notify('Account created successfully');
    navigate('/app/dashboard');
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper p-4 dark:bg-ink">
      <form className="glass w-full max-w-md rounded-[28px] p-8 text-slate-900 dark:text-white" onSubmit={submit}>
        <h1 className="text-3xl font-black">Create account</h1>
        {['name', 'email', 'password', 'confirm'].map((field) => (
          <label className="mt-4 grid gap-2 text-sm font-black capitalize" key={field}>
            {field === 'confirm' ? 'Confirm Password' : field === 'name' ? 'Full Name' : field}
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
              type={field.includes('password') || field === 'confirm' ? 'password' : field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={(event) => setForm({ ...form, [field]: event.target.value })}
            />
          </label>
        ))}
        {error && <p className="mt-4 rounded-2xl bg-danger/10 p-3 text-sm font-bold text-danger">{error}</p>}
        <button className="mt-6 w-full rounded-2xl bg-primary py-3 font-black text-white" type="submit">Create Account</button>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 font-black dark:bg-slate-800" type="button">
          <Chrome className="h-5 w-5" /> Google Signup
        </button>
        <p className="mt-5 text-center text-sm font-semibold text-slate-500">
          Already registered? <Link className="font-black text-primary" to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
