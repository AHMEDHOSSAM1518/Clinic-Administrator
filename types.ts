
export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export type VisitType = 'Consultation' | 'Procedure' | 'FollowUp' | 'Surgery' | 'Routine Checkup';

export type PaymentMethod = 'Cash' | 'Visa' | 'InstaPay' | 'Bank Transfer';

export type PaymentStatus = 'Paid' | 'Unpaid' | 'Partial' | 'Collected Now';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  position: string;
  lastLogin: string;
  isActive: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  uploadDate: string;
}

export interface MedicalHistoryEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'Note' | 'Event' | 'Diagnosis';
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  dob: string;
  gender: 'Male' | 'Female';
  phone: string;
  email?: string;
  chronicDiseases: string;
  allergies: string;
  medications: string;
  medicalNotes: string;
  medicalAttachments: FileAttachment[];
  historyEntries: MedicalHistoryEntry[];
  avatar?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  performanceScore: number;
  totalSessions: number;
  revenueGenerated: number;
  mostUsedService?: string;
}

export interface AestheticTreatment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  visitType: VisitType;
  serviceName: string;
  cost: number;
  paid: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  attachments: FileAttachment[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: VisitType;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  price: number;
  paymentMethod: PaymentMethod;
}
