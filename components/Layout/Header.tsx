import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentUser: any;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header = ({ currentUser, onToggleSidebar, isSidebarOpen }: HeaderProps) => (
  <header className="h-24 bg-white/40 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-16 z-30 shadow-sm transition-all duration-300">
    <button 
      onClick={onToggleSidebar}
      className="p-3 bg-[#0F2E33] text-[#D9B061] rounded-2xl hover:scale-110 transition-all shadow-lg active:scale-95"
    >
      {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
    
    <div className="flex items-center gap-6">
      <div className="text-right">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Connected User</p>
        <p className="text-sm font-bold text-[#0F2E33]">{currentUser?.email}</p>
      </div>
      <div className="w-12 h-12 rounded-[22px] bg-[#D9B061]/20 border border-[#D9B061]/40 flex items-center justify-center text-[#0F2E33] font-bold">
        {currentUser?.email?.[0].toUpperCase()}
      </div>
    </div>
  </header>
);