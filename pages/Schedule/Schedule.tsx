import React, { useState } from 'react';
import { CalendarClock, Plus, Check, X, Trash2, Search } from 'lucide-react';
import { Appointment, Patient, Doctor } from '../../types';
import { formatTime12h } from '../../formatters';

interface ScheduleProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  onNewAppointment: () => void;
  onUpdateStatus: (id: string, status: 'Completed' | 'Cancelled') => void;
  onDeleteStatus: (id: string) => void;
}

export const Schedule = ({ appointments, patients, doctors, onNewAppointment, onUpdateStatus, onDeleteStatus }: ScheduleProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = appointments.filter(a => {
    const patient = patients.find(p => p.id === a.patientId);
    if (!patient) return false;
    const patientName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return patientName.includes(searchTerm.toLowerCase());
  }).sort((a,b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  return (
    <div className="bg-white/40 backdrop-blur-md p-12 rounded-[56px] border border-slate-200 shadow-sm animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <h2 className="text-3xl font-bold text-[#0F2E33] uppercase flex items-center gap-4">
          <CalendarClock className="text-[#D9B061]" /> Clinical Schedule
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient name..." 
              className="w-full pl-11 pr-4 py-3 bg-white/60 border border-slate-200 rounded-2xl outline-none text-sm focus:ring-1 focus:ring-[#D9B061]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={onNewAppointment}
            className="bg-[#0F2E33] text-[#D9B061] px-10 py-5 rounded-[30px] font-bold uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all"
          >
            <Plus size={20} /> New Appointment
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-slate-100">
        {filteredAppointments.map(a => (
          <div key={a.id} className="py-8 flex justify-between items-center group">
            <div className="flex items-center gap-12">
              <div className="text-center min-w-[120px]">
                <div className="text-2xl font-bold text-[#D9B061] leading-none mb-1 uppercase whitespace-nowrap">{formatTime12h(a.time)}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.date.split('-').slice(1).join('/')}</div>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F2E33] mb-1">{patients.find(p => p.id === a.patientId)?.firstName} {patients.find(p => p.id === a.patientId)?.lastName}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.type} • Dr. {doctors.find(d => d.id === a.doctorId)?.name || 'House Staff'}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-xl font-bold text-slate-800">${a.price}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">{a.paymentMethod}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {a.status === 'Scheduled' ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onUpdateStatus(a.id, 'Completed')}
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2 px-5"
                    >
                      <Check size={16} strokeWidth={3} />
                      <span className="text-[10px] font-bold uppercase">Done</span>
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(a.id, 'Cancelled')}
                      className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm flex items-center gap-2 px-5"
                    >
                      <X size={16} strokeWidth={3} />
                      <span className="text-[10px] font-bold uppercase">Cancel</span>
                    </button>
                    <button 
                      onClick={() => onDeleteStatus(a.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm px-4"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className={`px-5 py-3 rounded-full text-[10px] font-bold uppercase border transition-all ${
                      a.status === 'Completed' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-red-50 text-red-400 border-red-100'
                    }`}>
                      {a.status === 'Completed' ? 'Done' : 'Cancelled'}
                    </span>
                    <button 
                      onClick={() => onDeleteStatus(a.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredAppointments.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <Search size={64} className="mx-auto mb-4" />
            <p className="text-xl font-bold uppercase tracking-widest">No matching appointments</p>
          </div>
        )}
      </div>
    </div>
  );
};