import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Search } from 'lucide-react';
import { Patient } from '../../types';

interface PatientsProps {
  patients: Patient[];
  setModalOpen: (modal: string) => void;
  setEditingPatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  setSelectedPatientId: (id: string) => void;
}

export const Patients = ({ patients, setModalOpen, setEditingPatient, deletePatient, setSelectedPatientId }: PatientsProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h2 className="text-4xl font-bold text-[#0F2E33] uppercase">Medical Registry</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="w-full pl-14 pr-6 py-5 bg-white/60 backdrop-blur-md border border-slate-200 rounded-[30px] outline-none text-slate-900 font-medium focus:ring-2 focus:ring-[#D9B061] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setModalOpen('patient')} className="bg-[#0F2E33] text-[#D9B061] px-10 py-5 rounded-[30px] font-bold uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
            <Plus size={20}/> Enroll Patient
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {filteredPatients.map(p => (
          <div key={p.id} className="bg-white/40 backdrop-blur-md p-10 rounded-[56px] border border-slate-200 hover:border-[#D9B061] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-all flex gap-3">
              <button onClick={() => { setEditingPatient(p); setModalOpen('patient'); }} className="p-3 bg-white/80 rounded-2xl shadow-sm text-slate-400 hover:text-[#0F2E33]"><Edit2 size={16}/></button>
              <button onClick={() => deletePatient(p.id)} className="p-3 bg-red-50/80 rounded-2xl shadow-sm text-red-300 hover:text-red-600"><Trash2 size={16}/></button>
            </div>
            <div className="w-20 h-20 bg-[#0F2E33] rounded-[32px] flex items-center justify-center text-[#D9B061] text-3xl font-bold mb-8 overflow-hidden">
              {p.avatar ? (
                <img src={p.avatar} alt={p.firstName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                p.firstName[0]
              )}
            </div>
            <h3 className="text-2xl font-bold text-[#0F2E33] tracking-tight">{p.firstName} {p.lastName}</h3>
            <div className="flex items-center gap-2 text-slate-400 mb-4 uppercase tracking-widest text-xs font-bold">
              <Calendar size={14} /> <span>{p.age} years • {p.gender}</span>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-8 uppercase tracking-widest">{p.phone}</p>
            <button onClick={() => setSelectedPatientId(p.id)} className="w-full py-4 bg-white/60 rounded-3xl text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F2E33] border border-slate-100 hover:bg-[#0F2E33] hover:text-[#D9B061] transition-all">Open Clinical Profile</button>
          </div>
        ))}
        {filteredPatients.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-30">
            <Search size={64} className="mx-auto mb-4" />
            <p className="text-xl font-bold uppercase tracking-widest">No patients match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};