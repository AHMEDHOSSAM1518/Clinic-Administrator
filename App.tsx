
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Activity, Shield, Plus, UserPlus, CalendarPlus, Search, Check, ChevronDown, Loader2 } from 'lucide-react';

import { UserRole, Patient, Appointment, Doctor, AestheticTreatment, StaffUser, FileAttachment } from './types';
import { mockPatients, mockAppointments, mockDoctors, mockTreatments } from './mockData';
import { db } from './lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';

// Context
import { useAuth } from './context/AuthContext';

// Components
import { Watermark } from './components/Common/Watermark';
import { Modal } from './components/Common/Modal';
import { Toast } from './components/Common/Toast';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';

// Pages
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Patients } from './pages/Patients/Patients';
import { Schedule } from './pages/Schedule/Schedule';
import { Settings } from './pages/Settings/Settings';
import { AdminUsers } from './pages/Admin/AdminUsers';
import { PatientProfile } from './pages/Patients/PatientProfile';

const labelClass = "text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 block px-1";
const inputClass = "w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none text-slate-900 font-medium focus:ring-2 focus:ring-[#D9B061] focus:border-[#D9B061] placeholder:text-slate-400 transition-all text-[15px]";

const STORAGE_KEYS = {
  PATIENTS: 'medflow_patients',
  APPOINTMENTS: 'medflow_appointments',
  TREATMENTS: 'medflow_treatments',
};

export default function App() {
  const { user, role, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('patients');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Local Data States
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [treatments, setTreatments] = useState<AestheticTreatment[]>([]);

  // UI States
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [appModalSearch, setAppModalSearch] = useState('');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);

  const notify = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type });

  // Firestore Real-time Listeners
  useEffect(() => {
    if (!user) return;

    const unsubPatients = onSnapshot(collection(db, 'patients'), (snapshot) => {
      const patientsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Patient));
      setPatients(patientsList.length > 0 ? patientsList : mockPatients);
    });

    const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      const appointmentsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Appointment));
      setAppointments(appointmentsList.length > 0 ? appointmentsList : mockAppointments);
    });

    const unsubTreatments = onSnapshot(collection(db, 'treatments'), (snapshot) => {
      const treatmentsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AestheticTreatment));
      setTreatments(treatmentsList.length > 0 ? treatmentsList : mockTreatments);
    });

    return () => {
      unsubPatients();
      unsubAppointments();
      unsubTreatments();
    };
  }, [user]);

  // Hierarchical Tab Redirection Logic
  useEffect(() => {
    if (user && role) {
      if (role === UserRole.OWNER) {
        // Owner has access to all, usually starts at dashboard
        if (activeTab === 'login') setActiveTab('dashboard');
      } else if (role === UserRole.ADMIN) {
        // Admin has Dashboard access but NOT Staff or Settings
        if (activeTab === 'staff' || activeTab === 'settings') {
          setActiveTab('dashboard');
        }
      } else if (role === UserRole.USER) {
        // User only has Patients and Schedule access
        if (activeTab === 'dashboard' || activeTab === 'staff' || activeTab === 'settings') {
          setActiveTab('patients');
        }
      }
    }
  }, [role, user, activeTab]);

  const savePatient = async (data: any) => {
    const processedData = {
      ...data,
      age: parseInt(data.age, 10),
      chronicDiseases: data.chronicDiseases || '',
      medicalNotes: data.medicalNotes || '',
    };

    try {
      if (editingPatient) {
        await updateDoc(doc(db, 'patients', editingPatient.id), processedData);
      } else {
        const newPatient: Omit<Patient, 'id'> = {
          ...processedData,
          medicalAttachments: [],
          historyEntries: [],
          dob: processedData.dob || new Date().toISOString().split('T')[0],
          allergies: '',
          medications: '',
          firstName: processedData.firstName,
          lastName: processedData.lastName,
          gender: processedData.gender,
          phone: processedData.phone,
        };
        await addDoc(collection(db, 'patients'), newPatient);
      }
      setModalOpen(null);
      setEditingPatient(null);
      notify("Records synchronized.");
    } catch (error) {
      console.error("Error saving patient:", error);
      notify("Failed to save patient record.", "error");
    }
  };

  const saveAppointment = async (data: any) => {
    const newApp: Omit<Appointment, 'id'> = {
      patientId: data.patientId,
      doctorId: data.doctorId,
      date: data.date,
      time: data.time,
      type: data.type,
      price: parseFloat(data.price),
      paymentMethod: data.paymentMethod,
      status: 'Scheduled'
    };
    try {
      await addDoc(collection(db, 'appointments'), newApp);
      setModalOpen(null);
      notify("Appointment scheduled.");
      setAppModalSearch('');
      setSelectedPatientId(null);
    } catch (error) {
      console.error("Error saving appointment:", error);
      notify("Failed to schedule appointment.", "error");
    }
  };

  const updateAppointmentStatus = async (id: string, newStatus: 'Completed' | 'Cancelled') => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status: newStatus });
      notify(newStatus === 'Completed' ? "Session finalized. Fee collected." : "Session cancelled.");
    } catch (error) {
      console.error("Error updating status:", error);
      notify("Failed to update status.", "error");
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      notify("Appointment purged from system.", "error");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      notify("Failed to delete appointment.", "error");
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'patients', id));
      notify("Record removed.");
    } catch (error) {
      console.error("Error deleting patient:", error);
      notify("Failed to remove patient record.", "error");
    }
  };

  const addAttachment = async (patientId: string, attachment: FileAttachment) => {
    try {
      const patientRef = doc(db, 'patients', patientId);
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        await updateDoc(patientRef, {
          medicalAttachments: [...(patient.medicalAttachments || []), attachment]
        });
        notify("File attached to record.");
      }
    } catch (error) {
      console.error("Error adding attachment:", error);
      notify("Failed to attach file.", "error");
    }
  };

  const deleteAttachment = async (patientId: string, attachmentId: string) => {
    try {
      const patientRef = doc(db, 'patients', patientId);
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        await updateDoc(patientRef, {
          medicalAttachments: (patient.medicalAttachments || []).filter(a => a.id !== attachmentId)
        });
        notify("Attachment removed.", "error");
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
      notify("Failed to remove attachment.", "error");
    }
  };

  const stats = useMemo(() => {
    const completedApps = appointments.filter(a => a.status === 'Completed');
    const totalIncome = completedApps.reduce((sum, a) => sum + (a.price || 0), 0);
    
    const dailyIncome = completedApps.reduce((acc, a) => {
      acc[a.date] = (acc[a.date] || 0) + (a.price || 0);
      return acc;
    }, {} as Record<string, number>);
    
    const chartData = Object.keys(dailyIncome).length > 0 
      ? Object.keys(dailyIncome).sort().map(date => ({ date, income: dailyIncome[date] }))
      : [{ date: new Date().toISOString().split('T')[0], income: 0 }];
    
    return { totalIncome, chartData };
  }, [appointments]);

  if (authLoading) return (
    <div className="min-h-screen bg-[#0F2E33] flex flex-col items-center justify-center text-white font-bold tracking-widest uppercase">
       <Loader2 className="animate-spin text-[#D9B061] mb-6" size={60} />
       Syncing Clinical Terminal...
    </div>
  );

  if (!user) return <Login onNavigateToSetup={() => {}} />;

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const filteredModalPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(appModalSearch.toLowerCase())
  );

  const isOwner = role === UserRole.OWNER;
  const isAdmin = role === UserRole.ADMIN;
  const isPrivileged = isOwner || isAdmin;

  return (
    <div className="min-h-screen flex font-formal bg-transparent overflow-hidden">
      <Watermark />
      <Sidebar 
        role={role as UserRole} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={user} 
        isOpen={sidebarOpen}
        handleLogout={logout} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300">
        <Header currentUser={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-16 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && isPrivileged && (
              <Dashboard 
                stats={stats} 
                appointments={appointments} 
                patients={patients} 
                onUpdateStatus={updateAppointmentStatus}
                onDeleteStatus={deleteAppointment}
              />
            )}
            {activeTab === 'patients' && <Patients patients={patients} setModalOpen={setModalOpen} setEditingPatient={setEditingPatient} deletePatient={deletePatient} setSelectedPatientId={(id) => { setSelectedPatientId(id); setActiveTab('profile'); }} />}
            {activeTab === 'profile' && selectedPatient && (
              <PatientProfile 
                patient={selectedPatient} 
                appointments={appointments.filter(a => a.patientId === selectedPatient.id)} 
                doctors={doctors}
                onBack={() => setActiveTab('patients')}
                onAddAppointment={() => setModalOpen('appointment')}
                onUpdateStatus={updateAppointmentStatus}
                onDeleteStatus={deleteAppointment}
                onAddAttachment={addAttachment}
                onDeleteAttachment={deleteAttachment}
              />
            )}
            {activeTab === 'calendar' && (
              <Schedule 
                appointments={appointments} 
                patients={patients} 
                doctors={doctors} 
                onNewAppointment={() => setModalOpen('appointment')}
                onUpdateStatus={updateAppointmentStatus}
                onDeleteStatus={deleteAppointment}
              />
            )}
            {/* ONLY Owner can see Staff and Settings content */}
            {activeTab === 'staff' && isOwner && <AdminUsers />}
            {activeTab === 'settings' && isOwner && (
              <Settings 
                currentUser={user} 
                staff={[]} 
                onToggleActive={() => {}}
                onChangeRole={() => {}}
                requestPasswordUpdate={() => {}} 
                patientsCount={patients.length} 
              />
            )}
          </div>
        </main>
      </div>

      <Modal isOpen={modalOpen === 'patient'} onClose={() => { setModalOpen(null); setEditingPatient(null); }} title={editingPatient ? "Edit Clinical Profile" : "Register Patient"}>
        <form onSubmit={(e) => { e.preventDefault(); savePatient(Object.fromEntries(new FormData(e.currentTarget).entries())); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>First Name</label><input name="firstName" required className={inputClass} defaultValue={editingPatient?.firstName} /></div>
            <div><label className={labelClass}>Second Name</label><input name="lastName" required className={inputClass} defaultValue={editingPatient?.lastName} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Phone</label><input name="phone" required className={inputClass} defaultValue={editingPatient?.phone} /></div>
            <div><label className={labelClass}>Age</label><input name="age" type="number" required className={inputClass} defaultValue={editingPatient?.age} /></div>
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select name="gender" required className={inputClass} defaultValue={editingPatient?.gender || 'Female'}>
              <option value="Male">Male</option><option value="Female">Female</option>
            </select>
          </div>
          <div><label className={labelClass}>Chronic Disease</label><input name="chronicDiseases" className={inputClass} defaultValue={editingPatient?.chronicDiseases} /></div>
          <div><label className={labelClass}>Medical History</label><textarea name="medicalNotes" className={`${inputClass} min-h-[100px]`} defaultValue={editingPatient?.medicalNotes}></textarea></div>
          <button type="submit" className="w-full bg-[#0F2E33] text-[#D9B061] py-5 rounded-3xl font-bold shadow-xl">Commit</button>
        </form>
      </Modal>

      <Modal isOpen={modalOpen === 'appointment'} onClose={() => { setModalOpen(null); setAppModalSearch(''); setIsPatientDropdownOpen(false); }} title="Create New Appointment">
        <form onSubmit={(e) => { e.preventDefault(); saveAppointment(Object.fromEntries(new FormData(e.currentTarget).entries())); }} className="space-y-6">
          <div className="bg-[#0F2E33] p-7 rounded-[32px] border border-[#D9B061]/20 shadow-xl transition-all relative">
            <label className={`${labelClass} !text-[#D9B061]/70 mb-3`}>Patient Selection</label>
            <div 
              onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
              className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl outline-none text-[#D9B061] font-bold transition-all text-[15px] flex justify-between items-center cursor-pointer"
            >
              <span>{selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : "Select Patient"}</span>
              <ChevronDown size={18} />
            </div>
            <input type="hidden" name="patientId" value={selectedPatientId || ''} required />
            {isPatientDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#0F2E33] border border-[#D9B061]/30 rounded-[24px] shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <input autoFocus type="text" placeholder="Search..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm outline-none text-[#D9B061]" value={appModalSearch} onChange={(e) => setAppModalSearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                </div>
                <div className="max-h-[240px] overflow-y-auto">
                  {filteredModalPatients.map(p => (
                    <div key={p.id} onClick={() => { setSelectedPatientId(p.id); setIsPatientDropdownOpen(false); }} className={`flex items-center px-5 py-4 cursor-pointer hover:bg-white/10 ${selectedPatientId === p.id ? "bg-[#D9B061] text-[#0F2E33]" : "text-[#D9B061]/80"}`}>
                      {p.firstName} {p.lastName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Date</label><input name="date" type="date" required className={inputClass} defaultValue={new Date().toISOString().split('T')[0]} /></div>
            <div><label className={labelClass}>Time</label><input name="time" type="time" required className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Type</label><select name="type" className={inputClass}><option value="Consultation">Consultation</option><option value="Procedure">Procedure</option></select></div>
            <div><label className={labelClass}>Price ($)</label><input name="price" type="number" required className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Doctor</label><select name="doctorId" className={inputClass}>{doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <button type="submit" className="w-full bg-[#0F2E33] text-[#D9B061] py-5 rounded-3xl font-bold shadow-xl">Finalize Appointment</button>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
