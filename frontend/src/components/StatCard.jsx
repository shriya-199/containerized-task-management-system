import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, tone = 'primary' }) {
  const colors = {
    primary: 'from-primary to-secondary',
    success: 'from-success to-emerald-400',
    warning: 'from-warning to-orange-400',
    danger: 'from-danger to-rose-400'
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="glass rounded-app p-5 text-slate-900 dark:text-white"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`rounded-2xl bg-gradient-to-br ${colors[tone]} p-3 text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <strong className="mt-4 block text-3xl font-black">{value}</strong>
    </motion.article>
  );
}
