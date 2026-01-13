
import React, { useEffect, useState } from 'react';

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
  onClick?: () => void,
  className?: string,
  disabled?: boolean,
  type?: 'button' | 'submit'
}> = ({ children, variant = 'primary', onClick, className = "", disabled, type = 'button' }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100",
    secondary: "bg-slate-800 text-white hover:bg-slate-900",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100"
  };

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = "indigo" }) => {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200"
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.indigo}`}>
      {children}
    </span>
  );
};

export const Input: React.FC<{
  label?: string,
  placeholder?: string,
  type?: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
  className?: string,
  as?: 'input' | 'select' | 'textarea'
  children?: React.ReactNode
}> = ({ label, placeholder, type = "text", value, onChange, className = "", as = 'input', children }) => {
  const inputStyles = "w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm";
  
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
      {as === 'select' ? (
        <select value={value} onChange={onChange} className={inputStyles}>
          {children}
        </select>
      ) : as === 'textarea' ? (
        <textarea placeholder={placeholder} value={value} onChange={onChange} className={`${inputStyles} min-h-[100px] resize-none`} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={inputStyles} />
      )}
    </div>
  );
};

export const Modal: React.FC<{
  isOpen: boolean,
  onClose: () => void,
  title: string,
  children: React.ReactNode,
  footer?: React.ReactNode
}> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const Toast: React.FC<{
  message: string,
  isVisible: boolean,
  onClose: () => void,
  type?: 'success' | 'error' | 'info'
}> = ({ message, isVisible, onClose, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgStyles = {
    success: 'bg-emerald-600',
    error: 'bg-rose-600',
    info: 'bg-indigo-600'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[100] ${bgStyles[type]} text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-8 duration-300`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

export const SectionHeader: React.FC<{ title: string, description?: string, action?: React.ReactNode }> = ({ title, description, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
      {description && <p className="text-slate-500 mt-1 text-sm">{description}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
