import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md ${
        isSuccess
          ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-400'
          : isError
          ? 'bg-slate-900/95 border-rose-500/40 text-rose-400'
          : 'bg-slate-900/95 border-cyan-500/40 text-cyan-400'
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
        ) : (
          <Info className="w-5 h-5 flex-shrink-0" />
        )}
        <span className="text-xs font-semibold text-slate-100 pr-2">
          {toast.message}
        </span>
      </div>
    </div>
  );
};
