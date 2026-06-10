import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { ToastContext } from '../context/ToastContext.jsx';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

export default function ToastCenter() {
  const { toasts } = useContext(ToastContext);

  return (
    <div className="fixed right-5 top-5 z-50 grid gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30 }}
              className="glass flex min-w-72 items-center gap-3 rounded-app px-4 py-3 text-sm font-bold text-slate-900 dark:text-white"
            >
              <Icon className="h-5 w-5 text-primary" />
              {toast.message}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
