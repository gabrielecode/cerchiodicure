import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-max max-w-[90vw] px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md pointer-events-auto transition-all animate-bounce-short text-sm font-medium border border-slate-700/50"
        >
          {t.type === 'info' ? (
            <Info className="w-5 h-5 text-sky-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
