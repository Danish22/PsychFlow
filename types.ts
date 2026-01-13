
export enum NoteType {
  SOAP = 'SOAP',
  DAP = 'DAP',
  BIRP = 'BIRP'
}

export enum SessionMode {
  IN_PERSON = 'In-Person',
  VIDEO = 'Video',
  PHONE = 'Phone'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  diagnosis: string[];
  intakeSummary: string;
  treatmentGoals: string[];
  status: 'Active' | 'Discharged' | 'Waitlist';
  nextSession?: string;
  lastSession?: string;
  totalBalance?: number;
}

export interface WaitlistClient extends Client {
  addedDate: string;
  priority: 'High' | 'Medium' | 'Low';
  referralSource: string;
}

export interface ClinicalDocument {
  id: string;
  clientId?: string;
  title: string;
  type: 'Consent' | 'Assessment' | 'Identity' | 'Other';
  status: 'Signed' | 'Pending' | 'Expired';
  uploadedAt: string;
}

export interface Session {
  id: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: SessionMode;
  fee: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  noteId?: string;
  summary: string;
}

export interface ClinicalNote {
  id: string;
  sessionId: string;
  clientId: string;
  type: NoteType;
  content: {
    s?: string; // Subjective
    o?: string; // Objective
    a?: string; // Assessment
    p?: string; // Plan
    d?: string; // Data
    b?: string; // Behavior
    i?: string; // Intervention
    r?: string; // Response
  };
  locked: boolean;
  updatedAt: string;
}

export interface Assessment {
  id: string;
  clientId: string;
  type: 'PHQ-9' | 'GAD-7';
  date: string;
  score: number;
  interpretation: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Sent' | 'Draft' | 'Overdue';
}
