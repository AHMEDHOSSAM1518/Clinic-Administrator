
import React from 'react';
import { LayoutDashboard, Users, Calendar, Settings as SettingsIcon, LogOut, Activity, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  handleLogout: () => void;
  isOpen: boolean;
}

export const Sidebar = ({ role, activeTab, setActiveTab, currentUser, handleLogout, isOpen }: SidebarProps) => {
  const isOwner = role === UserRole.OWNER;
  const isPrivileged = role === UserRole.ADMIN || role === UserRole.OWNER;

  return (
    <aside className={`bg-[#0F2E33] flex flex-col h-screen sticky top-0 shadow-2xl overflow-hidden text-white z-40 border-r border-white/5 transition-all duration-300 ease-in-out ${isOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 -translate-x-full'}`}>
      <div className="p-12 flex flex-col items-center mb-10 min-w-[288px]">
        <Activity size={44} className="text-[#D9B061] mb-4"/>
        <h1 className="text-xl font-bold text-[#D9B061] tracking-[0.2em] uppercase text-center">Mousa Clinic</h1>
      </div>
      <nav className="flex-1 px-8 space-y-4 min-w-[288px]">
        {/* Dashboard is visible to Owner and Admin (User-like but sees stats) */}
        {isPrivileged && (
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-8 py-5 rounded-[22px] transition-all ${activeTab === 'dashboard' ? 'bg-[#D9B061] text-[#0F2E33] font-bold shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>
            <LayoutDashboard size={22}/><span className="text-[11px] uppercase tracking-widest font-bold">Dashboard</span>
          </button>
        )}
        
        {/* Patient records and appointments are visible to all authenticated roles */}
        <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center gap-4 px-8 py-5 rounded-[22px] transition-all ${activeTab === 'patients' ? 'bg-[#D9B061] text-[#0F2E33] font-bold shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>
          <Users size={22}/><span className="text-[11px] uppercase tracking-widest font-bold">Patients</span>
        </button>
        <button onClick={() => setActiveTab('calendar')} className={`w-full flex items-center gap-4 px-8 py-5 rounded-[22px] transition-all ${activeTab === 'calendar' ? 'bg-[#D9B061] text-[#0F2E33] font-bold shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>
          <Calendar size={22}/><span className="text-[11px] uppercase tracking-widest font-bold">Schedule</span>
        </button>

        {/* ONLY the Owner can access the Personnel Management (Staff) and Settings (Control) */}
        {isOwner && (
          <>
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-4 px-8 py-5 rounded-[22px] transition-all ${activeTab === 'staff' ? 'bg-[#D9B061] text-[#0F2E33] font-bold shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>
              <UserCheck size={22}/><span className="text-[11px] uppercase tracking-widest font-bold">Staff Registry</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-8 py-5 rounded-[22px] transition-all ${activeTab === 'settings' ? 'bg-[#D9B061] text-[#0F2E33] font-bold shadow-lg' : 'text-white/40 hover:bg-white/5'}`}>
              <SettingsIcon size={22}/><span className="text-[11px] uppercase tracking-widest font-bold">Settings</span>
            </button>
          </>
        )}
      </nav>
      <div className="p-10 border-t border-white/5 min-w-[288px]">
         <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest">
            <LogOut size={18} /> Terminate
         </button>
      </div>
    </aside>
  );
};
