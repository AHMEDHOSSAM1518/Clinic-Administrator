import React, { useState } from 'react';
import { TrendingUp, Clock, Check, X, Trash2, Download, Database, FileSpreadsheet, Search } from 'lucide-react';
import { XAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Appointment, Patient } from '../../types';
import { formatTime12h } from '../../formatters';

interface DashboardProps {
  stats: any;
  appointments: Appointment[];
  patients: Patient[];
  onUpdateStatus: (id: string, status: 'Completed' | 'Cancelled') => void;
  onDeleteStatus: (id: string) => void;
}

export const Dashboard = ({ stats, appointments, patients, onUpdateStatus, onDeleteStatus }: DashboardProps) => {
  const [queueSearch, setQueueSearch] = useState('');

  const downloadCSV = (filename: string, csvContent: string) => {
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportFinancials = () => {
    const headers = ['Date', 'Time', 'Patient Name', 'Visit Type', 'Service Fee ($)', 'Payment Route', 'Clinical Status'];
    const rows = appointments.map(a => {
      const patient = patients.find(p => p.id === a.patientId);
      return [
        a.date,
        formatTime12h(a.time),
        patient ? `"${patient.firstName} ${patient.lastName}"` : '"Unknown"',
        `"${a.type}"`,
        a.price,
        `"${a.paymentMethod}"`,
        `"${a.status}"`
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    downloadCSV(`Mousa_Clinic_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  const exportPatients = () => {
    const headers = ['First Name', 'Last Name', 'Age', 'Gender', 'Phone Contact', 'Chronic Diseases', 'Primary Concerns'];
    const rows = patients.map(p => [
      `"${p.firstName}"`,
      `"${p.lastName}"`,
      p.age,
      `"${p.gender}"`,
      `"${p.phone}"`,
      `"${(p.chronicDiseases || '').replace(/"/g, '""')}"`,
      `"${(p.medicalNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    downloadCSV(`Mousa_Clinic_Patient_Registry_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  const filteredQueue = appointments
    .filter(a => a.status === 'Scheduled')
    .filter(a => {
      const patient = patients.find(p => p.id === a.patientId);
      if (!patient) return false;
      return `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(queueSearch.toLowerCase());
    });

  const exportButtonClass = "w-full flex items-center justify-center gap-3 py-5 bg-[#0F2E33] rounded-[24px] text-[#D9B061] font-bold uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] transition-all shadow-xl active:scale-[0.98]";

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-[#0F2E33] uppercase tracking-tight">Global Command</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Operational Intelligence Hub</p>
        </div>
        <div className="flex gap-6 items-center">
           <div className="bg-white/60 backdrop-blur-md px-10 py-6 rounded-3xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Clinic Revenue</p>
              <p className="text-3xl font-bold text-emerald-600 tracking-tight">${stats.totalIncome.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white/40 backdrop-blur-md p-10 rounded-[48px] border border-slate-200 shadow-sm h-[400px]">
           <h4 className="text-lg font-bold uppercase text-[#0F2E33] mb-8 flex items-center gap-3"><TrendingUp size={20} className="text-[#D9B061]" /> Revenue Growth</h4>
           <div className="h-full pb-16">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={stats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" hide />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="income" stroke="#D9B061" strokeWidth={4} fill="#D9B061" fillOpacity={0.08} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-white/40 backdrop-blur-md p-10 rounded-[48px] border border-slate-200 shadow-sm flex flex-col h-full max-h-[400px]">
           <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold uppercase text-[#0F2E33] flex items-center gap-3"><Clock size={20} className="text-[#D9B061]" /> Live Patient Queue</h4>
           </div>
           
           <div className="relative mb-6">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find patient in queue..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-2xl text-[10px] uppercase font-bold tracking-widest outline-none focus:ring-1 focus:ring-[#D9B061] transition-all"
                value={queueSearch}
                onChange={(e) => setQueueSearch(e.target.value)}
              />
           </div>

           <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {filteredQueue.length > 0 ? (
                filteredQueue.map(app => (
                  <div key={app.id} className="p-5 bg-white/80 rounded-3xl border border-slate-100 flex justify-between items-center group hover:border-[#D9B061] transition-all">
                    <div>
                        <p className="text-[10px] font-bold text-[#D9B061] uppercase mb-1">{formatTime12h(app.time)}</p>
                        <p className="font-bold text-[#0F2E33]">{patients.find(p => p.id === app.patientId)?.firstName} {patients.find(p => p.id === app.patientId)?.lastName}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onUpdateStatus(app.id, 'Completed')}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Mark as Done"
                      >
                        <Check size={16} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(app.id, 'Cancelled')}
                        className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                        title="Cancel Session"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => onDeleteStatus(app.id)}
                        className="p-2.5 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Delete Session"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center opacity-30">
                  <p className="text-xs font-bold uppercase tracking-widest italic">
                    {queueSearch ? 'No matches in queue' : 'No active sessions'}
                  </p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Registry Export & Intelligence Section */}
      <div className="bg-white/40 backdrop-blur-md p-12 rounded-[56px] border border-slate-200 shadow-sm animate-in slide-in-from-bottom-5 duration-700">
         <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#0F2E33] rounded-2xl text-[#D9B061]">
               <Database size={24} />
            </div>
            <div>
               <h4 className="text-xl font-bold uppercase text-[#0F2E33]">Registry Export & Intelligence</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrative Data Processing Center</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/60 rounded-[32px] border border-slate-100 space-y-4">
               <div className="flex items-center gap-3 text-[#0F2E33]">
                  <Clock size={18} className="text-[#D9B061]" />
                  <span className="font-bold uppercase text-xs tracking-widest">Patient Demographics</span>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed">Download a complete clinical registry of all enrolled patients, including age, gender, and chronic medical history.</p>
               <button 
                  onClick={exportPatients}
                  className={exportButtonClass}
               >
                  <Download size={16} /> Export Patient Registry
               </button>
            </div>

            <div className="p-8 bg-white/60 rounded-[32px] border border-slate-100 space-y-4">
               <div className="flex items-center gap-3 text-[#0F2E33]">
                  <FileSpreadsheet size={18} className="text-[#D9B061]" />
                  <span className="font-bold uppercase text-xs tracking-widest">Financial Performance</span>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed">Generate a comprehensive spreadsheet of all session earnings, service fees, and payment methods for tax and accounting.</p>
               <button 
                  onClick={exportFinancials}
                  className={exportButtonClass}
               >
                  <Download size={16} /> Export Financial Report
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};