import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right-10 duration-300 ${
      type === 'success' ? 'bg-[#0F2E33] text-white' : 'bg-red-600 text-white'
    }`}>
      {type === 'success' ? <CheckCircle size={20} className="text-[#D9B061]" /> : <AlertCircle size={20} />}
      <span className="font-bold tracking-tight">{message}</span>
    </div>
  );
};
