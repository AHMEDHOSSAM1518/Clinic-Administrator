import React from 'react';
import { UserCheck, Shield, Mail, Clock, Plus, Edit2, Trash2 } from 'lucide-react';
import { StaffUser } from '../../types';

interface StaffProps {
  staff: StaffUser[];
  setModalOpen: (modal: string) => void;
  setEditingStaff: (staff: StaffUser) => void;
  deleteStaff: (id: string) => void;
}

export const Staff = ({ staff, setModalOpen, setEditingStaff, deleteStaff }: StaffProps) => (
  <div className="space-y-12 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-4xl font-bold text-[#0F2E33] uppercase tracking-tight">Clinical Personnel</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Resource Management & Access</p>
      </div>
      <button 
        onClick={() => { setEditingStaff(null as any); setModalOpen('staff'); }} 
        className="bg-[#0F2E33] text-[#D9B061] px-10 py-5 rounded-[30px] font-bold uppercase text-xs tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"
      >
        <Plus size={20}/> Add Staff
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
      {staff.map(member => (
        <div key={member.id} className="bg-white/40 backdrop-blur-md p-10 rounded-[56px] border border-slate-200 hover:border-[#D9B061] transition-all group relative overflow-hidden">
          {/* Action Buttons */}
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all flex gap-3 z-10">
            <button 
              onClick={() => { setEditingStaff(member); setModalOpen('staff'); }} 
              className="p-3 bg-white/80 rounded-2xl shadow-sm text-slate-400 hover:text-[#0F2E33] transition-colors"
            >
              <Edit2 size={16}/>
            </button>
            <button 
              onClick={() => deleteStaff(member.id)} 
              className="p-3 bg-red-50/80 rounded-2xl shadow-sm text-red-300 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16}/>
            </button>
          </div>

          <div className="w-16 h-16 bg-[#0F2E33] rounded-[24px] flex items-center justify-center text-[#D9B061] mb-6 shadow-lg">
            <UserCheck size={28} />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-[#0F2E33] tracking-tight">{member.name}</h3>
              <p className="text-[10px] font-bold text-[#D9B061] uppercase tracking-widest flex items-center gap-2 mt-1">
                <Shield size={12} /> {member.role} • {member.position || "General Staff"}
              </p>
            </div>
            <div className="pt-6 space-y-3 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <Mail size={16} className="text-[#0F2E33]/30" /> <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <Clock size={16} className="text-[#0F2E33]/30" /> <span>Last Active: {member.lastLogin}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {staff.length === 0 && (
        <div className="col-span-full py-20 text-center opacity-20">
          <UserCheck size={64} className="mx-auto mb-4" />
          <p className="text-xl font-bold uppercase tracking-widest">No personnel records found</p>
        </div>
      )}
    </div>
  </div>
);