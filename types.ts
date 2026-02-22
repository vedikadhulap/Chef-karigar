
export enum UserRole {
  BUSINESS = 'BUSINESS',
  STAFF = 'STAFF',
  AGENCY = 'AGENCY',
  EXTERNAL_SALES = 'EXTERNAL_SALES'
}

export type AgencyRole = 'SUPPORT' | 'SALES' | 'FINANCE';

export enum JobStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  CANCELLED = 'CANCELLED'
}

export interface Job {
  id: string;
  role: string;
  location: string;
  pinCode?: string;
  salary: number;
  shiftType: string;
  status: JobStatus;
  paymentVerified: boolean;
  postedDate: string;
  timeline: 'Immediate' | 'Within 1 Week' | 'Within 1 Month';
  amenities?: string[];
}

export interface EditRecord {
    field: string;
    oldValue: string;
    newValue: string;
    changedBy: string;
    date: string;
}

export interface CallLog {
    lastContactedBy?: string;
    contactedDate?: string;
    contactedTime?: string;
    response?: string;
    staffFeedback?: string;
    nextReminderDate?: string;
}

export interface WorkExperience {
    outletName: string;
    location: string;
    duration: string;
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  skill: string;
  isSkillVerified?: boolean;
  experienceYears?: number;
  isVerified: boolean;
  rating: number;
  startDate?: string;
  contractMonths: number;
  serviceCommissionTotal: number;
  status: 'Active' | 'Completed' | 'Terminated' | 'Unverified';
  currentLocation?: string; 
  referredBy?: string; 
  referredByPhone?: string;
  dateAdded?: string;
  isUrgentPlacement?: boolean;
  preferredLocation?: string;
  expectedSalary?: string;
  callLog?: CallLog;
  editHistory?: EditRecord[];
  workHistory?: WorkExperience[];
}

export interface MatchBundle {
    id: string;
    jobId: string;
    businessName: string;
    role: string;
    salary: number;
    candidateIds: string[];
    status: 'New' | 'Pitched' | 'Interviewing' | 'Closed' | 'Cancelled';
    dateCreated: string;
    lastActionBy?: string;
}

export interface Transaction {
    id: string;
    type: 'Fee' | 'Commission' | 'Refund' | 'Payout';
    amount: number;
    description: string;
    date: string;
    status: 'Pending' | 'Success';
}

export interface HiredStaff {
  id: string;
  name: string;
  role: string;
  salary: number;
  startDate: string;
  nextPayoutDue?: string;
  status: 'Active' | 'On Leave' | 'Hired';
}

export interface Referral {
  id: string;
  candidateName: string;
  candidatePhone: string;
  candidateSkill: string;
  referrerId: string;
  status: string;
  daysEmployed: number;
  isWorking?: boolean;
  dateAdded?: string;
}

export interface Lead {
  id: string;
  businessName: string;
  location: string;
  type: 'Franchise' | 'High-Value' | 'Bulk';
  hiringVolume: number;
  potentialCommission: number;
  status: 'Open' | 'Booked';
  distance: string;
  contactPerson: string;
  appointmentDate: string;
  appointmentTime: string;
  visitTime: string;
}
