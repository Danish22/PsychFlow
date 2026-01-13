
import { Client, Session, SessionMode, NoteType, Assessment, Invoice, WaitlistClient, ClinicalDocument } from './types';

export const DUMMY_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1992-05-14',
    diagnosis: ['GAD', 'Mild Depression'],
    intakeSummary: 'Client presents with symptoms of generalized anxiety related to career transition. Reports difficulty sleeping and racing thoughts.',
    treatmentGoals: ['Develop mindfulness routine', 'Improve work-life boundaries', 'Identify cognitive distortions'],
    status: 'Active',
    nextSession: '2024-05-22',
    lastSession: '2024-05-15',
    totalBalance: 150
  },
  {
    id: 'c2',
    name: 'Marcus Thorne',
    email: 'm.thorne@example.com',
    phone: '(555) 987-6543',
    dateOfBirth: '1985-11-22',
    diagnosis: ['ADHD - Combined Type'],
    intakeSummary: 'Client seeks support for executive dysfunction. Struggles with task initiation and time management in a high-stress tech role.',
    treatmentGoals: ['Implement external organizational systems', 'Manage emotional dysregulation', 'Improve focus duration'],
    status: 'Active',
    nextSession: '2024-05-22',
    lastSession: '2024-05-14',
    totalBalance: 0
  },
  {
    id: 'c3',
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    phone: '(555) 444-2222',
    dateOfBirth: '2001-02-10',
    diagnosis: ['PTSD'],
    intakeSummary: 'History of childhood trauma. Currently experiencing flashbacks and avoidant behavior triggered by interpersonal conflicts.',
    treatmentGoals: ['Somatic regulation techniques', 'Processing traumatic memories', 'Building secure attachment patterns'],
    status: 'Active',
    nextSession: '2024-05-23',
    lastSession: '2024-05-16',
    totalBalance: 350
  }
];

export const DUMMY_WAITLIST: WaitlistClient[] = [
  {
    id: 'w1',
    name: 'Julian Vance',
    email: 'j.vance@example.com',
    phone: '(555) 111-2222',
    dateOfBirth: '1995-08-12',
    diagnosis: [],
    intakeSummary: 'Inquiry for burnout support.',
    treatmentGoals: [],
    status: 'Waitlist',
    addedDate: '2024-04-10',
    priority: 'Medium',
    referralSource: 'Zocdoc'
  },
  {
    id: 'w2',
    name: 'Clarissa Moon',
    email: 'c.moon@example.com',
    phone: '(555) 333-4444',
    dateOfBirth: '1988-12-30',
    diagnosis: [],
    intakeSummary: 'Requested specialist for OCD.',
    treatmentGoals: [],
    status: 'Waitlist',
    addedDate: '2024-05-01',
    priority: 'High',
    referralSource: 'Direct Website'
  }
];

export const DUMMY_DOCUMENTS: ClinicalDocument[] = [
  { id: 'd1', clientId: 'c1', title: 'HIPAA Consent Form', type: 'Consent', status: 'Signed', uploadedAt: '2024-01-10' },
  { id: 'd2', clientId: 'c1', title: 'Telehealth Consent', type: 'Consent', status: 'Signed', uploadedAt: '2024-01-10' },
  { id: 'd3', clientId: 'c2', title: 'Informed Consent', type: 'Consent', status: 'Pending', uploadedAt: '2024-05-12' },
  { id: 'd4', title: 'Practice Intake Template', type: 'Other', status: 'Signed', uploadedAt: '2023-12-01' },
];

export const DUMMY_SESSIONS: Session[] = [
  {
    id: 's1',
    clientId: 'c1',
    date: '2024-05-22',
    startTime: '10:00',
    endTime: '11:00',
    mode: SessionMode.VIDEO,
    fee: 150,
    paymentStatus: 'Pending',
    summary: 'Focus on career anxiety and breathing techniques.'
  },
  {
    id: 's2',
    clientId: 'c2',
    date: '2024-05-22',
    startTime: '13:30',
    endTime: '14:30',
    mode: SessionMode.IN_PERSON,
    fee: 175,
    paymentStatus: 'Paid',
    summary: 'Discussion regarding medication efficacy and routine building.'
  },
  {
    id: 's3',
    clientId: 'c3',
    date: '2024-05-23',
    startTime: '11:00',
    endTime: '12:00',
    mode: SessionMode.VIDEO,
    fee: 175,
    paymentStatus: 'Pending',
    summary: 'Trauma processing session.'
  }
];

export const DUMMY_ASSESSMENTS: Assessment[] = [
  { id: 'a1', clientId: 'c1', type: 'GAD-7', date: '2023-11-01', score: 14, interpretation: 'Moderate Anxiety' },
  { id: 'a2', clientId: 'c1', type: 'GAD-7', date: '2023-12-05', score: 11, interpretation: 'Mild-Moderate Anxiety' },
  { id: 'a3', clientId: 'c1', type: 'GAD-7', date: '2024-01-15', score: 8, interpretation: 'Mild Anxiety' },
  { id: 'a4', clientId: 'c2', type: 'PHQ-9', date: '2024-02-10', score: 19, interpretation: 'Moderately Severe Depression' },
  { id: 'a5', clientId: 'c2', type: 'PHQ-9', date: '2024-03-12', score: 15, interpretation: 'Moderate Depression' },
];

export const DUMMY_INVOICES: Invoice[] = [
  { id: 'inv1', clientId: 'c1', amount: 150, dueDate: '2024-05-30', status: 'Sent' },
  { id: 'inv2', clientId: 'c2', amount: 175, dueDate: '2024-05-28', status: 'Paid' },
  { id: 'inv3', clientId: 'c3', amount: 175, dueDate: '2024-05-25', status: 'Draft' },
  { id: 'inv4', clientId: 'c3', amount: 175, dueDate: '2024-05-18', status: 'Overdue' },
];
