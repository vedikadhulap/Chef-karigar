
import { Job, JobStatus, Referral, StaffMember, Lead, HiredStaff, Transaction, MatchBundle } from './types';

export const APP_NAME = "Chef-karigar";
export const CURRENCY = "₹";

export const INITIAL_PROCESS_FEE = 100;
export const ACCOUNT_OPENING_FEE = 500;
export const AGENCY_COMMISSION_PERCENT = 40;
export const BASE_COMMISSION_PERCENT = 50;
export const COMMISSION_DISCOUNT_PERCENT = 20;

export const REFERRAL_BONUS_AMOUNT = 500;
export const SALES_COMMISSION_AMOUNT = 1500;
export const REFERRAL_ELIGIBILITY_DAYS = 30;
export const CONTRACT_DURATION_MONTHS = 6;

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    role: 'Tandoor Chef',
    location: 'Mamta Cafe, Mumbai',
    pinCode: '400053',
    salary: 25000,
    shiftType: 'Full-time (12 Hours)',
    status: JobStatus.OPEN,
    paymentVerified: true,
    postedDate: '2023-10-15',
    timeline: 'Immediate'
  },
  {
    id: 'j3',
    role: 'Curry Chef',
    location: 'Spice Garden, Delhi',
    pinCode: '110001',
    salary: 28000,
    shiftType: 'Full-time (12 Hours)',
    status: JobStatus.OPEN,
    paymentVerified: true,
    postedDate: '2023-10-20',
    timeline: 'Within 1 Week'
  },
  {
    id: 'j4',
    role: 'Waiter',
    location: 'Royal Dining, Bangalore',
    pinCode: '560001',
    salary: 15000,
    shiftType: 'Full-time (12 Hours)',
    status: JobStatus.OPEN,
    paymentVerified: true,
    postedDate: '2023-10-22',
    timeline: 'Within 1 Month'
  }
];

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 's1',
    name: 'Rajesh Kumar',
    phone: '9876543211',
    skill: 'South Indian Chef',
    experienceYears: 5,
    isVerified: true,
    isSkillVerified: true,
    rating: 4.5,
    startDate: '2023-06-01',
    contractMonths: 6,
    serviceCommissionTotal: 8000,
    status: 'Active',
    currentLocation: 'Mamta Cafe, Mumbai',
    referredBy: 'Amit Singh',
    referredByPhone: '9822110033',
    dateAdded: '2023-10-01',
    callLog: {
        lastContactedBy: 'Agent Sonal',
        contactedDate: '2023-10-25',
        response: 'Working Satisfied',
        nextReminderDate: '2023-11-25'
    },
    editHistory: []
  },
  {
    id: 's2',
    name: 'Amit Singh',
    phone: '9876543212',
    skill: 'Waiter',
    isVerified: true,
    isSkillVerified: true,
    rating: 4.2,
    contractMonths: 0,
    serviceCommissionTotal: 0,
    status: 'Active',
    currentLocation: 'Looking for work',
    referredBy: 'SYSTEM',
    dateAdded: '2023-10-01',
    callLog: { contactedDate: 'Never', lastContactedBy: 'No Agent' }
  },
  {
    id: 's4',
    name: 'Vikram Malhotra',
    phone: '9876543214',
    skill: 'Continental Chef',
    experienceYears: 8,
    isVerified: false,
    isSkillVerified: false,
    rating: 0,
    contractMonths: 0,
    serviceCommissionTotal: 0,
    status: 'Unverified',
    currentLocation: 'Looking for work',
    referredBy: 'Sales: Rahul',
    referredByPhone: '9111222333',
    dateAdded: '2023-10-01',
    callLog: {
        lastContactedBy: 'Agent Amit',
        contactedDate: '2023-10-27',
        response: 'Will call again tomorrow'
    },
    editHistory: []
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'TX-101', type: 'Commission', amount: 8000, description: 'Placement: Rajesh Kumar @ Mamta Cafe', date: '2023-10-15', status: 'Success' },
    { id: 'TX-102', type: 'Fee', amount: 100, description: 'Process Fee: Spice Garden', date: '2023-10-20', status: 'Success' },
    { id: 'TX-103', type: 'Payout', amount: 500, description: 'Referral Bonus: Amit Singh', date: '2023-10-22', status: 'Pending' }
];

export const MOCK_MATCH_BUNDLES: MatchBundle[] = [
    {
        id: 'mb1',
        jobId: 'j1',
        businessName: 'Mamta Cafe',
        role: 'Tandoor Chef',
        salary: 25000,
        candidateIds: ['s4'],
        status: 'Pitched',
        dateCreated: '2023-10-26'
    }
];

export const MOCK_CURRENT_STAFF: HiredStaff[] = [
    { 
      id: 'h1', 
      name: 'Suresh Raina', 
      role: 'Head Chef', 
      salary: 45000, 
      startDate: '15 September 2023',
      nextPayoutDue: '10 Oct 2023',
      status: 'Hired'
    }
];

export const MOCK_REFERRALS: Referral[] = [
  { id: 'r1', candidateName: 'Vikram Seth', candidatePhone: '9876543210', candidateSkill: 'Continental Chef', referrerId: 's1', status: 'Eligible', daysEmployed: 32 }
];

export const MOCK_LEADS: Lead[] = [
  { id: 'l1', businessName: 'Burger King Franchise', location: 'Andheri West, Mumbai', type: 'Franchise', hiringVolume: 15, potentialCommission: 1500, status: 'Open', distance: '2.5 km', contactPerson: 'Mr. Verma', appointmentDate: '2023-11-05', appointmentTime: '11:00 AM', visitTime: '10:45 AM' },
  { id: 'l2', businessName: 'Grand Hyatt Kitchen', location: 'Santacruz, Mumbai', type: 'High-Value', hiringVolume: 30, potentialCommission: 1200, status: 'Open', distance: '5.0 km', contactPerson: 'Ms. Gupta', appointmentDate: '2023-11-06', appointmentTime: '03:00 PM', visitTime: '02:45 PM' }
];
