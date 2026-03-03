
import React from 'react';
import { X } from 'lucide-react';

// Define a proper interface for Modal props and make children optional to fix JSX inference errors in the main App
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  maxWidth?: string;
}

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all overflow-y-auto">
      <div className={`bg-white rounded-3xl w-full ${maxWidth} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-[#0F2E33] tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="p-8 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
