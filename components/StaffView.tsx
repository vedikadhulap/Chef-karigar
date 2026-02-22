
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award,
  CalendarCheck,
  CheckCircle,
  AlertCircle,
  Banknote,
  Briefcase,
  Landmark,
  ChevronDown,
  ChevronUp,
  Bell,
  X,
  Share2,
  PhoneCall,
  MapPin,
  Clock,
  History,
  Send,
  Briefcase as JobIcon,
  Trash2,
  ShieldCheck,
  Contact,
  QrCode,
  ArrowRight,
  Utensils,
  Home,
  // Added missing icon from lucide-react
  Users
} from 'lucide-react';
import { MOCK_REFERRALS, CURRENCY, CONTRACT_DURATION_MONTHS, MOCK_STAFF } from '../constants';
import { Referral, StaffMember, Job } from '../types';
import { GrievanceModal } from './GrievanceModal';
import { StarRatingWidget } from './StarRating';

const SKILL_CATEGORIES: Record<string, string[]> = {
    'Restaurant': ['Continental Chef', 'Tandoor Chef', 'Indian Chef', 'North Indian Chef', 'Waiter', 'Kitchen Helper'],
    'Fast Food': ['Chat Maker', 'Pani Puri Server', 'Pav Bhaji Maker', 'Fast Food Helper', 'Sandwich Artist']
};

interface StaffViewProps {
    jobs: Job[];
    onStaffAdded: (staff: StaffMember) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({ jobs, onStaffAdded }) => {
  const [currentUser] = useState<StaffMember>(MOCK_STAFF[0]);
  
  // Accordion/Section States
  const [showJobRequest, setShowJobRequest] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showBonusHistory, setShowBonusHistory] = useState(false);
  
  // UI States
  const [showNotification, setShowNotification] = useState(true);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [workplaceRating, setWorkplaceRating] = useState(0);

  const handleWorkplaceRating = (rating: number, feedback: string) => {
    setWorkplaceRating(rating);
    // In a real app, this would call an API
    console.log(`Workplace rating: ${rating}/5, feedback: ${feedback}`);
  };

  // Job Request State
  const [jobRequest, setJobRequest] = useState({
      role: '',
      location: '',
      salary: '',
      availability: 'Immediate'
  });

  const [submittedRequest, setSubmittedRequest] = useState<{
      role: string;
      location: string;
      salary: string;
      availability: string;
      date: string;
  } | null>(null);

  // Referral State
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [newRef, setNewRef] = useState({ 
      name: '', 
      phone: '', 
      category: '', 
      skill: '' 
  });
  
  // Job Share Modal State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref: Referral = {
      id: Math.random().toString(36).substr(2, 9),
      candidateName: newRef.name,
      candidatePhone: newRef.phone,
      candidateSkill: newRef.skill || selectedJob?.role || 'Chef',
      referrerId: currentUser.id,
      status: 'Pending',
      daysEmployed: 0,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    const newStaff: StaffMember = {
        id: ref.id,
        name: ref.candidateName,
        phone: ref.candidatePhone,
        skill: ref.candidateSkill,
        isVerified: false,
        rating: 0,
        contractMonths: 0,
        serviceCommissionTotal: 0,
        status: 'Unverified',
        referredBy: `Staff: ${currentUser.name}`,
        dateAdded: ref.dateAdded
    };
    
    onStaffAdded(newStaff);
    setReferrals([ref, ...referrals]);
    setNewRef({ name: '', phone: '', category: '', skill: '' });
    setSelectedJob(null);
    alert("Referral added and automated to Agency for vetting!");
  };

  const handleJobRequestSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newRequest = {
          ...jobRequest,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      };
      
      onStaffAdded({
          ...currentUser,
          id: Math.random().toString(36).substr(2, 9),
          skill: jobRequest.role || currentUser.skill,
          status: 'Unverified',
          referredBy: `Direct Request: ${currentUser.name}`,
          isUrgentPlacement: true,
          preferredLocation: jobRequest.location,
          expectedSalary: jobRequest.salary
      });
      setSubmittedRequest(newRequest);
      alert("Urgent Job Request sent! HR has been notified.");
  };

  const confirmExit = () => {
      alert("Exit request submitted. A penalty has been deducted from your service deposit.");
      setIsExitModalOpen(false);
  };

  // Logic for contract months
  const monthsCompleted = 4; // Mock logic
  const monthsRemaining = CONTRACT_DURATION_MONTHS - monthsCompleted;
  const exitPenalty = 2500;
  const serviceCommissionDeposit = currentUser.serviceCommissionTotal || 8000;

  return (
    <div className="space-y-6 relative">
      {/* Grievance Modal */}
      <GrievanceModal
        isOpen={showGrievanceModal}
        onClose={() => setShowGrievanceModal(false)}
        reporterName={currentUser.name}
        reporterRole="staff"
        contextLabel={currentUser.currentLocation || 'Current Workplace'}
      />

      {/* Digital ID Card Modal */}
      {isIdCardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-300 border-4 border-slate-100">
                  <div className="bg-slate-900 h-24 relative">
                      <button onClick={() => setIsIdCardOpen(false)} className="absolute right-4 top-4 text-white/70 hover:text-white"><X size={24}/></button>
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                          <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden bg-slate-200 shadow-lg">
                             <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60" className="w-full h-full object-cover" />
                          </div>
                      </div>
                  </div>
                  <div className="pt-16 pb-8 px-8 text-center">
                      <h3 className="text-2xl font-black text-slate-800">{currentUser.name}</h3>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">{currentUser.skill}</p>
                      
                      <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">
                          <ShieldCheck size={14} /> Agency Verified
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400 font-medium">Staff ID</span>
                              <span className="text-slate-800 font-bold">#CK-STAFF-9021</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400 font-medium">Joined Date</span>
                              <span className="text-slate-800 font-bold">{currentUser.startDate}</span>
                          </div>
                          <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex justify-center">
                              <QrCode size={80} className="text-slate-800" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Early Exit Confirmation Modal */}
      {isExitModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
                  <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <AlertCircle size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Early Exit Contract?</h3>
                      <p className="text-slate-500 mb-6 leading-relaxed">
                          Your 6-month contract is still active. To exit now, a penalty of <span className="text-red-600 font-bold">{CURRENCY}{exitPenalty}</span> will be charged from your <span className="font-bold">{CURRENCY}{serviceCommissionDeposit}</span> service deposit.
                      </p>
                      <div className="flex gap-4">
                          <button 
                            onClick={() => setIsExitModalOpen(false)}
                            className="flex-1 px-6 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl hover:bg-slate-200 transition"
                          >
                              No
                          </button>
                          <button 
                            onClick={confirmExit}
                            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-100"
                          >
                              Yes
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Share Job Modal */}
      {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2"><Share2 size={18} /> Share & Earn</h3>
                    <button onClick={() => setSelectedJob(null)} className="hover:text-emerald-100"><X size={20}/></button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-500 mb-4">Refer a friend for <strong>{selectedJob.role}</strong> at <strong>{selectedJob.location}</strong>.</p>
                    <form onSubmit={handleReferralSubmit} className="space-y-4">
                        <input required className="w-full border rounded-lg p-2.5 text-sm" placeholder="Friend's Name" value={newRef.name} onChange={e => setNewRef({...newRef, name: e.target.value})} />
                        <input required type="tel" className="w-full border rounded-lg p-2.5 text-sm" placeholder="Friend's Mobile" value={newRef.phone} onChange={e => setNewRef({...newRef, phone: e.target.value})} />
                        <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700">Submit & Earn</button>
                    </form>
                </div>
             </div>
          </div>
      )}

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex gap-6 items-center w-full">
                <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-2xl flex-shrink-0 border-2 border-slate-50 dark:border-slate-700 shadow-sm overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{currentUser.name}</h1>
                        <motion.button whileTap={{ scale: 0.95 }}
                            onClick={() => setIsIdCardOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
                        >
                            <Contact size={14} /> Show ID Card
                        </motion.button>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{currentUser.skill}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>{currentUser.experienceYears || 5} Years Exp.</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">Verified</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Action Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Looking for Job Section */}
            <div className="border border-indigo-100 dark:border-indigo-900/50 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <button 
                    onClick={() => setShowJobRequest(!showJobRequest)}
                    className={`w-full flex justify-between items-center p-5 transition ${showJobRequest ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                        <JobIcon size={18} className="text-indigo-500" /> Looking for Job?
                    </h3>
                    {showJobRequest ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showJobRequest && (
                    <div className="p-5 border-t border-indigo-50 dark:border-indigo-900/30 bg-white dark:bg-slate-900 animate-in slide-in-from-top-2">
                        {submittedRequest ? (
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-emerald-900 text-sm">Request Active: {submittedRequest.role}</h4>
                                    <p className="text-xs text-emerald-600">Our HR will contact you shortly.</p>
                                </div>
                                <button onClick={() => setSubmittedRequest(null)} className="text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition"><Trash2 size={16}/></button>
                            </div>
                        ) : (
                            <form onSubmit={handleJobRequestSubmit} className="space-y-3">
                                <input required placeholder="Preferred Location" className="w-full border dark:border-slate-700 rounded-xl p-3 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none" value={jobRequest.location} onChange={e => setJobRequest({...jobRequest, location: e.target.value})} />
                                <input type="number" required placeholder="Expected Salary (₹)" className="w-full border dark:border-slate-700 rounded-xl p-3 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none" value={jobRequest.salary} onChange={e => setJobRequest({...jobRequest, salary: e.target.value})} />
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition">Send Urgent Request</button>
                            </form>
                        )}
                    </div>
                )}
            </div>

            {/* Verification & Account Section */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <button 
                    onClick={() => setShowVerification(!showVerification)}
                    className={`w-full flex justify-between items-center p-5 transition ${showVerification ? 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                        <ShieldCheck size={18} className="text-emerald-500" /> Verification & Banking
                    </h3>
                    {showVerification ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showVerification && (
                    <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4 animate-in slide-in-from-top-2">
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Aadhaar Verification</span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-1 rounded">Completed</span>
                        </div>
                        <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-1 tracking-widest">UPI ID for Bonuses</label>
                            <div className="relative">
                                <Landmark className="absolute left-3 top-3 text-slate-400" size={16}/>
                                <input placeholder="example@upi" className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 pl-10 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="rajesh.kumar@sbi" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Rate Workplace & Report Dispute */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-amber-100 dark:border-amber-900/30 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm p-5">
            <StarRatingWidget
              staffName="Your Current Workplace"
              currentRating={workplaceRating}
              onSubmit={handleWorkplaceRating}
            />
          </div>
          <div className="border border-rose-100 dark:border-rose-900/30 rounded-2xl bg-white dark:bg-slate-900 shadow-sm p-5 flex flex-col justify-between gap-3">
            <div>
              <p className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Dispute / Grievance</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1 leading-relaxed">
                Facing a problem with salary, treatment or placement? Report it to Agency HR confidentially.
              </p>
            </div>
            <button
              onClick={() => setShowGrievanceModal(true)}
              className="w-full bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-black py-3 rounded-xl text-xs uppercase tracking-widest transition border-2 border-rose-100 dark:border-rose-900 flex items-center justify-center gap-2"
            >
              ⚠️ Report a Dispute
            </button>
          </div>
        </div>

        {/* Contract & Loyalty Bonus Section */}
        <div className="mt-4 border border-orange-200 dark:border-orange-900/30 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <button 
                onClick={() => setShowContract(!showContract)}
                className={`w-full flex justify-between items-center p-5 transition ${showContract ? 'bg-orange-50 dark:bg-orange-950 text-orange-900 dark:text-orange-300' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
                <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                    <Award size={18} className="text-orange-500" /> My Contract & Loyalty Bonus
                </h3>
                {showContract ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {showContract && (
                <div className="p-6 border-t border-orange-100 dark:border-orange-900/30 bg-white dark:bg-slate-900 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-orange-50 dark:bg-orange-950/30 p-5 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                            <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase mb-1 tracking-widest">Completed Time</p>
                            <p className="text-xl font-black text-orange-900 dark:text-orange-300">{monthsCompleted} of {CONTRACT_DURATION_MONTHS} Months</p>
                            <div className="w-full bg-orange-200 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-orange-600 h-full transition-all" style={{ width: `${(monthsCompleted/CONTRACT_DURATION_MONTHS)*100}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase mb-1 tracking-widest">Loyalty Bonus (Deposit Refund)</p>
                            <p className="text-xl font-black text-emerald-900 dark:text-emerald-300">{CURRENCY}{serviceCommissionDeposit.toLocaleString()}</p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-1">Refunded after 6 months completion</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase mb-1 tracking-widest">Refund Status</p>
                            <p className="text-xl font-black text-slate-900 dark:text-slate-100">Wait {monthsRemaining} Mo.</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 italic">Automatically tracks month-by-month</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <h4 className="font-black text-lg">Contract Exit Option</h4>
                            <p className="text-slate-400 text-sm">Need to leave early? Request an exit from your 6-month contract. A small penalty will be deducted from your service deposit.</p>
                        </div>
                        <button 
                            onClick={() => setIsExitModalOpen(true)}
                            className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black text-sm hover:bg-slate-100 transition shadow-lg active:scale-95 whitespace-nowrap"
                        >
                            Request to Exit Contract
                        </button>
                    </div>
                </div>
            )}
        </div>
      </motion.div>

      {/* Bonus History Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <button 
            onClick={() => setShowBonusHistory(!showBonusHistory)}
            className={`w-full flex justify-between items-center p-6 transition ${showBonusHistory ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
            <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Banknote className={showBonusHistory ? 'text-white' : 'text-emerald-500'} /> Earned Bonuses History
            </h2>
            {showBonusHistory ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
        {showBonusHistory && (
            <div className="animate-in slide-in-from-top-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[10px]">
                            <tr>
                                <th className="p-4">Type</th>
                                <th className="p-4">Candidate Referral Name</th>
                                <th className="p-4">Date Earned</th>
                                <th className="p-4 text-right">Bonus Amount</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {[
                                { type: 'Referral Bonus', name: 'Vikram Seth', date: '2023-11-05', amount: 500, status: 'Paid' },
                                { type: 'Referral Bonus', name: 'Rahul Dravid', date: '2023-10-12', amount: 500, status: 'Paid' },
                                { type: 'Retention / Performance', name: 'Self', date: '2023-09-30', amount: 1200, status: 'Paid' }
                            ].map((bonus, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <td className="p-4 font-bold text-slate-800 dark:text-slate-100">{bonus.type}</td>
                                    <td className="p-4 font-medium text-slate-600 dark:text-slate-300">{bonus.name}</td>
                                    <td className="p-4 text-slate-400 dark:text-slate-500">{bonus.date}</td>
                                    <td className="p-4 text-right font-black text-emerald-600">{CURRENCY}{bonus.amount}</td>
                                    <td className="p-4">
                                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">Settled</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </motion.div>

      {/* Job Opportunities Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
             <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 dark:text-slate-100 uppercase tracking-tight">
               <Briefcase className="text-orange-500" /> Hot Job Openings
             </h2>
             <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-orange-200 dark:border-orange-800">Live Today</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {jobs.filter(j => j.status === 'OPEN').slice(0, 5).map((job) => (
                  <motion.div key={job.id} whileHover={{ scale: 1.005 }}
                    className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                  >
                      <div className="flex-1">
                          <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{job.role}</h3>
                          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mt-2">
                              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-400"/> {job.location}</span>
                              <span className="flex items-center gap-1.5"><Clock size={16} className="text-indigo-400"/> {job.shiftType}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-4">
                              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  <Utensils size={14}/> Food Included
                              </div>
                              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  <Home size={14}/> Accommodation Included
                              </div>
                              <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900 uppercase tracking-widest">
                                    Earn up to {CURRENCY}2,000 Bonus
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => alert("Connecting to HR...")} className="flex-1 md:flex-none border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-xl font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2">
                             <PhoneCall size={18} /> Contact
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSelectedJob(job)} className="flex-1 md:flex-none bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition flex items-center justify-center gap-2">
                             <Share2 size={18} /> Share &amp; Earn
                          </motion.button>
                      </div>
                  </motion.div>
              ))}
          </div>
      </div>

      {/* Referral Form Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-emerald-200 dark:border-emerald-900/30 overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white flex flex-col md:flex-row justify-between items-center gap-4">
           <div>
             <h2 className="text-2xl font-black flex items-center gap-3">
               <Users className="animate-pulse" /> Refer Friend & Earn Bonus
             </h2>
             <p className="text-emerald-100 font-medium text-sm mt-1 uppercase tracking-wider">Refer a candidate • Directly linked to Agency HR</p>
           </div>
           <div className="bg-white/20 px-6 py-2 rounded-2xl border border-white/30 backdrop-blur-sm">
               <span className="font-black text-xl">{CURRENCY}1,000+ Earnable</span>
           </div>
        </div>

        <form onSubmit={handleReferralSubmit} className="p-8 bg-emerald-50/20 dark:bg-slate-900 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase ml-1 tracking-widest">Friend's Name</label>
                <input required placeholder="e.g. Rahul Kumar" className="w-full border dark:border-slate-700 rounded-xl p-3 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500" value={newRef.name} onChange={e => setNewRef({...newRef, name: e.target.value})} />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase ml-1 tracking-widest">Mobile Number</label>
                <input required type="tel" placeholder="9876543210" className="w-full border dark:border-slate-700 rounded-xl p-3 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500" value={newRef.phone} onChange={e => setNewRef({...newRef, phone: e.target.value})} />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase ml-1 tracking-widest">Job Skill</label>
                <select required className="w-full border dark:border-slate-700 rounded-xl p-3 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500" value={newRef.skill} onChange={e => setNewRef({...newRef, skill: e.target.value})}>
                    <option value="">Select Skill</option>
                    {Object.values(SKILL_CATEGORIES).flat().map(skill => <option key={skill} value={skill}>{skill}</option>)}
                </select>
            </div>
            <button type="submit" className="bg-emerald-600 text-white font-black py-3.5 rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition active:scale-95 flex items-center justify-center gap-2">
                Refer Now <ArrowRight size={18}/>
            </button>
        </form>
      </div>
    </div>
  );
};
