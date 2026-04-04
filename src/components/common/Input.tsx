import React from 'react';
import { cn } from '../../utils/format';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1 block">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            {icon}
          </div>
        )}
        <input 
          className={cn(
            "w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold",
            icon && "pl-12",
            error && "ring-2 ring-red-500/50",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-bold px-1">{error}</p>}
    </div>
  );
};
