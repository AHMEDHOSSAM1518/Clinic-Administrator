import React, { useState } from 'react';
import { ArrowLeft, Plus, Calendar, Activity, Check, X, Search, Trash2, FileText, Download, Image as ImageIcon, Upload, Loader2, Eye } from 'lucide-react';
import { Patient, Appointment, Doctor, FileAttachment } from '../../types';
import { formatTime12h } from '../../formatters';
import { Modal } from '../../components/Common/Modal';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface PatientProfileProps {
  patient: Patient;
  appointments: Appointment[];
  doctors: Doctor[];
  onBack: () => void;
  onAddAppointment: () => void;
  onUpdateStatus: (id: string, status: 'Completed' | 'Cancelled') => void;
  onDeleteStatus: (id: string) => void;
  onAddAttachment: (patientId: string, attachment: FileAttachment) => void;
  onDeleteAttachment: (patientId: string, attachmentId: string) => void;
}

export const PatientProfile = ({ 
  patient, 
  appointments, 
  doctors, 
  onBack, 
  onAddAppointment, 
  onUpdateStatus, 
  onDeleteStatus,
  onAddAttachment,
  onDeleteAttachment
}: PatientProfileProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [viewingAttachment, setViewingAttachment] = useState<FileAttachment | null>(null);

  const filteredApps = appointments.filter(a => 
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `patients/${patient.id}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const newAttachment: FileAttachment = {
        id: 'att-' + Date.now(),
        name: file.name,
        url: downloadURL,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      onAddAttachment(patient.id, newAttachment);
      setIsUploading(false);
    } catch (error) {
      console.error("Upload failed", error);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-500 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-[#0F2E33] font-bold uppercase text-[10px] tracking-widest hover:translate-x-[-4px] transition-all">
        <ArrowLeft size={16} /> Back to Registry
      </button>

      <div className="flex justify-between items-start">
        <div className="flex gap-8 items-center">
          <div className="w-24 h-24 bg-[#0F2E33] rounded-[40px] flex items-center justify-center text-[#D9B061] text-4xl font-bold border-4 border-white shadow-xl">
            {patient.firstName[0]}
          </div>
          <div>
            <h2 className="text-5xl font-bold text-[#0F2E33] tracking-tight">{patient.firstName} {patient.lastName}</h2>
            <p className="text-[#D9B061] font-bold uppercase text-xs tracking-widest mt-2">{patient.phone} • {patient.gender}, {patient.age}Y</p>
          </div>
        </div>
        <button onClick={onAddAppointment} className="bg-[#0F2E33] text-[#D9B061] px-10 py-5 rounded-full font-bold uppercase text-xs tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all">
          <Plus size={20}/> New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white/40 backdrop-blur-md p-10 rounded-[56px] border border-slate-200">
           <h4 className="text-sm font-bold uppercase text-[#0F2E33] mb-6 flex items-center gap-2"><Activity size={18} className="text-[#D9B061]"/> Medical Summary</h4>
           <div className="space-y-6">
              <div>
                <p className={labelClass}>Chronic Conditions</p>
                <p className="text-slate-800 font-medium">{patient.chronicDiseases || "None Reported"}</p>
              </div>
              <div>
                <p className={labelClass}>Clinical Notes</p>
                <p className="text-slate-500 text-sm leading-relaxed">{patient.medicalNotes || "No medical history recorded for this patient."}</p>
              </div>
           </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md p-10 rounded-[56px] border border-slate-200">
           <div className="flex justify-between items-center mb-6">
             <h4 className="text-sm font-bold uppercase text-[#0F2E33] flex items-center gap-2"><FileText size={18} className="text-[#D9B061]"/> Medical Records</h4>
             <label className="cursor-pointer bg-[#0F2E33] text-[#D9B061] p-2 rounded-full hover:scale-110 transition-all shadow-lg">
               {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
               <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx" disabled={isUploading} />
             </label>
           </div>

           <div className="space-y-3">
             {patient.medicalAttachments && patient.medicalAttachments.length > 0 ? (
               patient.medicalAttachments.map(att => (
                 <div key={att.id} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-slate-50 hover:border-[#D9B061]/30 transition-all group">
                   <div className="flex items-center gap-3 overflow-hidden">
                     <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-[#D9B061] transition-colors flex-shrink-0 w-10 h-10 flex items-center justify-center overflow-hidden">
                       {att.type === 'image' ? (
                         <img src={att.url} alt={att.name} className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />
                       ) : (
                         <FileText size={16} />
                       )}
                     </div>
                     <div className="overflow-hidden">
                       <p className="text-[11px] font-bold text-slate-700 truncate">{att.name}</p>
                       <p className="text-[9px] text-slate-400 font-medium">{att.uploadDate}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-1">
                     {att.type === 'image' && (
                       <button 
                         onClick={() => setViewingAttachment(att)}
                         className="p-2 text-slate-400 hover:text-[#D9B061] transition-colors"
                         title="Preview"
                       >
                         <Eye size={14} />
                       </button>
                     )}
                     <a href={att.url} download={att.name} className="p-2 text-slate-400 hover:text-[#0F2E33] transition-colors" title="Download">
                       <Download size={14} />
                     </a>
                     <button onClick={() => onDeleteAttachment(patient.id, att.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                       <Trash2 size={14} />
                     </button>
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl">
                 <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No clinical media attached</p>
               </div>
             )}
           </div>
        </div>

        <div className="lg:col-span-3 bg-white/40 backdrop-blur-md p-10 rounded-[56px] border border-slate-200">
           <div className="flex justify-between items-center mb-10">
              <h4 className="text-sm font-bold uppercase text-[#0F2E33] flex items-center gap-2"><Calendar size={18} className="text-[#D9B061]"/> Scheduled Visits</h4>
              <div className="relative">
                 <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Search visits..." 
                    className="pl-10 pr-4 py-2 bg-white/60 border border-slate-100 rounded-full text-xs outline-none focus:ring-1 focus:ring-[#D9B061]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredApps.length > 0 ? filteredApps.map(app => (
                <div key={app.id} className="p-6 bg-white/80 rounded-[32px] border border-slate-50 flex justify-between items-center group hover:border-[#D9B061] transition-all">
                   <div className="flex items-center gap-8">
                      <div className="text-center min-w-[70px]">
                         <p className="text-xs font-bold text-[#0F2E33]">{app.date.split('-').slice(1).join('/')}</p>
                         <p className="text-[10px] font-bold text-[#D9B061] whitespace-nowrap uppercase">{formatTime12h(app.time)}</p>
                      </div>
                      <div className="h-10 w-[1px] bg-slate-100"></div>
                      <div>
                         <p className="font-bold text-[#0F2E33] flex items-center gap-2">{app.type}</p>
                         <p className="text-[10px] text-slate-400 font-medium">Dr. {doctors.find(d => d.id === app.doctorId)?.name}</p>
                      </div>
                   </div>
                   <div className="text-right flex items-center gap-6">
                      <div>
                         <p className="text-lg font-bold text-slate-800">${app.price}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase">{app.paymentMethod}</p>
                      </div>
                      
                      {app.status === 'Scheduled' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onUpdateStatus(app.id, 'Completed')}
                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Done"
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(app.id, 'Cancelled')}
                            className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                            title="Cancel"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                          <button 
                            onClick={() => onDeleteStatus(app.id)}
                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase border transition-all ${
                            app.status === 'Completed' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-red-50 text-red-400 border-red-100'
                          }`}>
                            {app.status === 'Completed' ? 'Done' : 'Cancelled'}
                          </span>
                          <button 
                            onClick={() => onDeleteStatus(app.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                   </div>
                </div>
              )) : (
                <div className="text-center py-10 opacity-40">
                   <Calendar size={40} className="mx-auto mb-4" />
                   <p className="text-xs font-bold uppercase tracking-widest">No matching sessions found</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <Modal 
        isOpen={!!viewingAttachment} 
        onClose={() => setViewingAttachment(null)} 
        title={viewingAttachment?.name || "Attachment Preview"}
        maxWidth="max-w-4xl"
      >
        {viewingAttachment && (
          <div className="flex flex-col items-center gap-6">
            {viewingAttachment.type === 'image' ? (
              <img 
                src={viewingAttachment.url} 
                alt={viewingAttachment.name} 
                className="max-w-full rounded-2xl shadow-lg border border-slate-100" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="p-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-4">
                <FileText size={64} className="text-slate-300" />
                <p className="text-slate-500 font-medium">Document Preview Not Available</p>
              </div>
            )}
            <div className="flex gap-4">
              <a 
                href={viewingAttachment.url} 
                download={viewingAttachment.name}
                className="bg-[#0F2E33] text-[#D9B061] px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Download size={16} /> Download File
              </a>
              <button 
                onClick={() => setViewingAttachment(null)}
                className="px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1";