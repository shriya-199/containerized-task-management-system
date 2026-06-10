import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/55 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-app p-6 text-slate-900 dark:text-white"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black">{title}</h2>
          <button className="rounded-2xl bg-slate-100 p-2 dark:bg-slate-800" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
