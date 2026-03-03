
import { Patient, AestheticTreatment, Appointment, Doctor, StaffUser, UserRole } from './types';

export const mockStaffUsers: StaffUser[] = [
  { id: 'u1', name: 'Admin Mousa', email: 'admin@mousaclinic.com', role: UserRole.ADMIN, lastLogin: '2025-05-24 10:00', position: 'Clinic Director', isActive: true },
  { id: 'u2', name: 'Receptionist Sarah', email: 'sarah.reception@mousaclinic.com', role: UserRole.USER, lastLogin: '2025-05-24 08:30', position: 'Front Desk', isActive: true },
];

export const mockDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Ahmed', specialty: 'Dermatologist', performanceScore: 98, totalSessions: 145, revenueGenerated: 25000, mostUsedService: 'Laser Peel' },
  { id: 'd2', name: 'Dr. James Wilson', specialty: 'Plastic Surgeon', performanceScore: 94, totalSessions: 82, revenueGenerated: 68000, mostUsedService: 'Rhinoplasty' },
  { id: 'd3', name: 'Dr. Elena Mousa', specialty: 'General Practitioner', performanceScore: 99, totalSessions: 210, revenueGenerated: 15000, mostUsedService: 'Consultation' },
];

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    firstName: 'Elena',
    lastName: 'Vance',
    age: 32,
    dob: '1992-05-14',
    gender: 'Female',
    phone: '555-0102',
    email: 'elena@example.com',
    chronicDiseases: 'Type 1 Diabetes',
    allergies: 'Latex, Penicillin',
    medications: 'Insulin, Metformin',
    medicalNotes: 'Patient requires extra monitoring during procedures due to glucose levels.',
    medicalAttachments: [
       { id: 'att1', name: 'Initial Scan', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=200', type: 'image', uploadDate: '2024-12-01' }
    ],
    historyEntries: [
      { id: 'h1', date: '2024-12-01', title: 'Diabetes Diagnosis', description: 'Confirmed Type 1 Diabetes during routine checkup.', type: 'Diagnosis' }
    ]
  },
  {
    id: 'p2',
    firstName: 'Marcus',
    lastName: 'Holloway',
    age: 36,
    dob: '1988-11-20',
    gender: 'Male',
    phone: '555-0199',
    email: 'marcus@example.com',
    chronicDiseases: 'None',
    allergies: 'None',
    medications: 'None',
    medicalNotes: 'Regular athlete, very healthy profile.',
    medicalAttachments: [],
    historyEntries: []
  }
];

export const mockTreatments: AestheticTreatment[] = [
  {
    id: 't1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2025-05-24',
    visitType: 'Procedure',
    serviceName: 'Laser Skin Peel',
    cost: 150,
    paid: 150,
    paymentMethod: 'Visa',
    paymentStatus: 'Paid',
    notes: 'Level 2 peel. Patient tolerated well.',
    attachments: []
  },
  {
    id: 't2',
    patientId: 'p2',
    doctorId: 'd3',
    date: '2025-05-24',
    visitType: 'Consultation',
    serviceName: 'Full Body Assessment',
    cost: 200,
    paid: 200,
    paymentMethod: 'InstaPay',
    paymentStatus: 'Paid',
    attachments: []
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2025-05-24',
    time: '14:30',
    type: 'FollowUp',
    status: 'Scheduled',
    price: 50,
    paymentMethod: 'Cash'
  },
  {
    id: 'a2',
    patientId: 'p2',
    doctorId: 'd3',
    date: '2025-05-24',
    time: '16:00',
    type: 'Consultation',
    status: 'Scheduled',
    price: 100,
    paymentMethod: 'InstaPay'
  }
];
