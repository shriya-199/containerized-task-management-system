import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Clock, ShieldCheck, Sparkles, Star } from 'lucide-react';

export default function LandingPage() {
  const features = [
    ['Smart Planning', 'Organize tasks by priority, date, category, and importance.', CheckCircle2],
    ['Analytics', 'Track completion rate, productivity, and weekly progress.', BarChart3],
    ['Local Privacy', 'Your data stays in browser localStorage for this demo.', ShieldCheck]
  ];

  return (
    <main className="min-h-screen bg-paper text-slate-950 dark:bg-ink dark:text-white">
      <section className="mx-auto grid min-h-screen w-11/12 max-w-7xl items-center gap-12 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">TaskFlow AI</span>
          <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">Manage Your Tasks Smarter</h1>
          <p className="mt-5 max-w-2xl text-lg font-medium text-slate-600 dark:text-slate-300">
            Organize, track and complete everything in one place with a premium productivity dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="rounded-2xl bg-primary px-6 py-4 font-black text-white shadow-lg shadow-primary/25" to="/signup">
              Get Started
            </Link>
            <Link className="rounded-2xl bg-slate-200 px-6 py-4 font-black text-slate-900 dark:bg-slate-800 dark:text-white" to="/app/dashboard">
              Live Demo
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55 }}
          className="glass rounded-[32px] p-6"
        >
          <div className="grid gap-4">
            {[
              ['Prepare presentation', 'High', 'Today', Star],
              ['Complete assignment', 'Medium', 'Tomorrow', Clock],
              ['Revise Docker commands', 'Low', 'Friday', Sparkles]
            ].map(([title, priority, date, Icon]) => (
              <div className="rounded-app bg-white p-5 shadow-lg dark:bg-slate-900" key={title}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black">{title}</p>
                    <p className="text-sm font-semibold text-slate-500">{date}</p>
                  </div>
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="mt-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">{priority}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto grid w-11/12 max-w-7xl gap-5 pb-16 md:grid-cols-3">
        {features.map(([title, text, Icon]) => (
          <div className="glass rounded-app p-6" key={title}>
            <Icon className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-black">{title}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{text}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm font-bold text-slate-500 dark:border-slate-800">
        TaskFlow AI - React, Tailwind, Context API, LocalStorage, Framer Motion
      </footer>
    </main>
  );
}
