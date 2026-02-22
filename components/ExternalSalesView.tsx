
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  CheckCircle, 
  TrendingUp,
  Send,
  ChevronDown,
  ChevronUp,
  Clock,
  Smartphone,
  UserPlus,
  Banknote,
  Menu,
  X,
  History,
  Trash2,
  Briefcase as JobIcon,
  PhoneCall,
  Share2,
  CalendarDays,
  UserCheck,
  ShieldCheck,
  Info,
  Calendar,
  Timer,
  AlertCircle,
  XCircle,
  Utensils,
  Home,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { MOCK_LEADS, MOCK_REFERRALS, CURRENCY } from '../constants';
import { Lead, Referral, Job, StaffMember } from '../types';
import { MapComponent } from './MapComponent';
import { SkeletonCard } from './Skeleton';
import { useOfflineSync } from '../hooks/useOfflineSync';

const SKILL_CATEGORIES: Record<string, string[]> = {
    'Restaurant': ['Continental Chef', 'Tandoor Chef', 'Indian Chef', 'North Indian Chef', 'Waiter', 'Kitchen Helper'],
    'Fast Food': ['Chat Maker', 'Pani Puri Server', 'Pav Bhaji Maker', 'Fast Food Helper', 'Sandwich Artist']
};

interface ExternalSalesViewProps {
  jobs: Job[];
  onStaffAdded: (staff: StaffMember) => void;
  initialView?: 'home' | 'nearby';
}

export const ExternalSalesView: React.FC<ExternalSalesViewProps> = ({ jobs, onStaffAdded, initialView }) => {
  const navigate = useNavigate();
  // Auth/Registration State
  const [isRegistered, setIsRegistered] = useState(false);
  const [regStep, setRegStep] = useState(1); 
  const [regForm, setRegForm] = useState({ aadhaar: '', mobile: '', otp: '' });
  const [isVerifying, setIsVerifying] = useState(false);

  // Dashboard State
  const [activeView, setActiveView] = useState<'home' | 'nearby'>(initialView ?? 'home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Offline sync — queues lead bookings / referrals when offline
  const { enqueue } = useOfflineSync();
  
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [cancellingLeadId, setCancellingLeadId] = useState<string | null>(null);
  
  // Refer & Earn State
  const [showReferral, setShowReferral] = useState(false); 
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [referralForm, setReferralForm] = useState({ name: '', phone: '', skill: '', workplace: '' });

  // Job Share Modal State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobReferralForm, setJobReferralForm] = useState({ name: '', phone: '' });

  const [showJobRequest, setShowJobRequest] = useState(true);
  const [candidateRequest, setCandidateRequest] = useState({ name: '', phone: '', role: '', location: '', salary: '', availability: 'Immediate' });
  const [submittedCandidateRequest, setSubmittedCandidateRequest] = useState<{ name: string; phone: string; role: string; location: string; salary: string; availability: string; date: string; } | null>(null);

  const handleBookLead = (id: string) => {
      const lead = leads.find(l => l.id === id);
      if (!navigator.onLine) {
        enqueue('book-lead', { leadId: id }, lead?.businessName ? `Book ${lead.businessName}` : 'Book Lead');
        setLeads(leads.map(l => l.id === id ? { ...l, status: 'Booked' } : l));
        return;
      }
      setLeads(leads.map(l => l.id === id ? { ...l, status: 'Booked' } : l));
      toast.success('Appointment booked! HR team will join you for the visit.', { icon: '✅', duration: 4000 });
  };

  const handleCancelLead = (id: string) => {
      setLeads(leads.map(l => l.id === id ? { ...l, status: 'Open' } : l));
      setCancellingLeadId(null);
  };

  const handleReferralSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newRef: Referral = {
          id: Math.random().toString(36).substr(2, 9),
          candidateName: referralForm.name,
          candidatePhone: referralForm.phone,
          candidateSkill: referralForm.skill,
          referrerId: 'Partner_Rahul',
          status: 'Pending',
          daysEmployed: 0,
          dateAdded: new Date().toISOString().split('T')[0]
      };
      
      const newStaff: StaffMember = {
          id: newRef.id,
          name: newRef.candidateName,
          phone: newRef.candidatePhone,
          skill: newRef.candidateSkill,
          isVerified: false,
          rating: 0,
          contractMonths: 0,
          serviceCommissionTotal: 0,
          status: 'Unverified',
          referredBy: `Partner: Rahul (Sales)`,
          dateAdded: newRef.dateAdded
      };
      
      onStaffAdded(newStaff);
      setReferrals([newRef, ...referrals]);
      if (!navigator.onLine) {
        enqueue('submit-referral', { referral: newRef }, `Referral: ${referralForm.name}`);
      } else {
        toast.success(`Candidate ${referralForm.name} added to Agency Dashboard!`, { icon: '🎉', duration: 4000 });
      }
      setReferralForm({ name: '', phone: '', skill: '', workplace: '' });
  };

  const handleJobReferralSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newRef: Referral = {
          id: Math.random().toString(36).substr(2, 9),
          candidateName: jobReferralForm.name,
          candidatePhone: jobReferralForm.phone,
          candidateSkill: selectedJob?.role || 'Unknown',
          referrerId: 'Partner_Rahul',
          status: 'Pending',
          daysEmployed: 0,
          dateAdded: new Date().toISOString().split('T')[0]
      };

      const newStaff: StaffMember = {
          id: newRef.id,
          name: newRef.candidateName,
          phone: newRef.candidatePhone,
          skill: newRef.candidateSkill,
          isVerified: false,
          rating: 0,
          contractMonths: 0,
          serviceCommissionTotal: 0,
          status: 'Unverified',
          referredBy: `Partner: Rahul (Applied for ${selectedJob?.role})`,
          dateAdded: newRef.dateAdded
      };

      onStaffAdded(newStaff);
      setReferrals([newRef, ...referrals]);
      toast.success(`Referral submitted for ${selectedJob?.role}! Linked to HR.`, { icon: '✅' });
      setJobReferralForm({ name: '', phone: '' });
      setSelectedJob(null);
  };

  const handleCandidateRequestSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newRequest = {
          ...candidateRequest,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      };
      
      const newStaff: StaffMember = {
          id: Math.random().toString(36).substr(2, 9),
          name: candidateRequest.name,
          phone: candidateRequest.phone,
          skill: candidateRequest.role,
          isVerified: false,
          rating: 0,
          contractMonths: 0,
          serviceCommissionTotal: 0,
          status: 'Unverified',
          referredBy: `Sales Partner Candidate Request`,
          dateAdded: new Date().toISOString().split('T')[0],
          isUrgentPlacement: true,
          preferredLocation: candidateRequest.location,
          expectedSalary: candidateRequest.salary
      };

      onStaffAdded(newStaff);
      setSubmittedCandidateRequest(newRequest);
      toast.success("Urgent Request logged in Agency Portal!", { icon: '🚀', duration: 4000 });
  };

  const handleRegistration = (e: React.FormEvent) => {
      e.preventDefault();
      if (regStep === 1) {
          if (regForm.mobile.length === 10) {
              setRegStep(2);
          } else {
              alert("Please enter a valid 10-digit mobile number.");
          }
      } else {
          setIsVerifying(true);
          setTimeout(() => {
              setIsVerifying(false);
              setIsRegistered(true);
          }, 1500);
      }
  };

  if (!isRegistered) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
              <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <div className="bg-slate-900 dark:bg-slate-800 p-12 text-center text-white relative">
                      <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                          <TrendingUp size={40} />
                      </div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Sales Partner Registration</h2>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Earn rewards by connecting staff and businesses.</p>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                  </div>
                  
                  <form onSubmit={handleRegistration} className="p-12 space-y-8">
                      {regStep === 1 ? (
                          <>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-4 top-4 text-slate-400" size={20} />
                                        <input 
                                            type="tel" 
                                            placeholder="9876543210"
                                            className="w-full pl-12 p-4 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none font-black text-slate-800 transition shadow-sm bg-slate-50"
                                            value={regForm.mobile}
                                            onChange={e => setRegForm({...regForm, mobile: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Aadhaar Number</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-4 text-slate-400" size={20} />
                                        <input 
                                            type="text" 
                                            placeholder="XXXX-XXXX-XXXX"
                                            className="w-full pl-12 p-4 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none font-black text-slate-800 transition shadow-sm bg-slate-50"
                                            value={regForm.aadhaar}
                                            onChange={e => setRegForm({...regForm, aadhaar: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] hover:bg-slate-800 transition shadow-xl uppercase tracking-[0.2em] text-sm">
                                Next: Verify OTP
                            </button>
                          </>
                      ) : (
                          <>
                             <div className="text-center mb-6">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">OTP sent to +91 {regForm.mobile}</p>
                             </div>
                             <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Enter OTP</label>
                                <input 
                                    type="text" 
                                    placeholder="4-Digit"
                                    className="w-full p-5 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none text-center tracking-[1em] text-2xl font-black bg-slate-50 text-slate-800"
                                    value={regForm.otp}
                                    onChange={e => setRegForm({...regForm, otp: e.target.value})}
                                />
                             </div>
                             <button disabled={isVerifying} className="w-full bg-orange-500 text-white font-black py-5 rounded-[2rem] hover:bg-orange-600 transition disabled:opacity-50 shadow-xl uppercase tracking-[0.2em] text-sm">
                                {isVerifying ? 'Verifying...' : 'Register & Log In'}
                             </button>
                          </>
                      )}
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6 relative">
      {/* Share Job Modal */}
      {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
             <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200 border-4 border-white dark:border-slate-800">
                <div className="bg-emerald-600 dark:bg-emerald-700 p-6 flex justify-between items-center text-white">
                    <h3 className="font-black flex items-center gap-3 uppercase tracking-tight text-lg"><Share2 size={24} /> Refer & Earn</h3>
                    <button onClick={() => setSelectedJob(null)} className="hover:rotate-90 transition"><X size={24}/></button>
                </div>
                <div className="p-8">
                    <form onSubmit={handleJobReferralSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Friend's Name</label>
                            <input required className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold bg-slate-50 outline-none focus:border-emerald-500 transition" placeholder="Candidate Name" value={jobReferralForm.name} onChange={e => setJobReferralForm({...jobReferralForm, name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Friend's Mobile</label>
                            <input required type="tel" className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold bg-slate-50 outline-none focus:border-emerald-500 transition" placeholder="Candidate Mobile" value={jobReferralForm.phone} onChange={e => setJobReferralForm({...jobReferralForm, phone: e.target.value})} />
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-100">Submit Candidate</button>
                    </form>
                </div>
             </div>
          </div>
      )}

      {/* Cancel Appointment Tab/Popup (Exact Request Implementation) */}
      {cancellingLeadId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300 border-4 border-white">
                  <div className="p-10 text-center">
                      <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                          <AlertCircle size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tighter uppercase">Cancel Appointment?</h3>
                      <p className="text-slate-500 mb-10 leading-relaxed font-bold">
                          You will <span className="text-rose-600 font-black">lose {CURRENCY}{leads.find(l => l.id === cancellingLeadId)?.potentialCommission}</span> in estimated commission if you cancel this visit.
                      </p>
                      <div className="flex gap-4">
                          <button 
                            onClick={() => setCancellingLeadId(null)}
                            className="flex-1 px-8 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-200 transition active:scale-95 uppercase tracking-widest text-[11px]"
                          >
                              No, Keep it
                          </button>
                          <button 
                            onClick={() => handleCancelLead(cancellingLeadId)}
                            className="flex-1 px-8 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition active:scale-95 shadow-xl shadow-red-200 uppercase tracking-widest text-[11px]"
                          >
                              Yes, Cancel
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
      >
         <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => setIsProfileOpen(true)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 transition"><Menu size={24} /></button>
            <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Sales Partner Portal</h1>
         </div>
         <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(activeView === 'home' ? '/sales/nearby' : '/sales/dashboard')} 
            className={`px-8 py-4 rounded-2xl text-sm font-black transition shadow-xl flex items-center gap-3 uppercase tracking-widest ${activeView === 'nearby' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-700'}`}
         >
            <MapPin size={20} className={activeView === 'nearby' ? 'animate-bounce' : ''} /> 
            {activeView === 'home' ? 'Show Nearby Opportunities' : 'Back to Home'}
         </motion.button>
      </motion.div>

      {activeView === 'home' ? (
      <div className="space-y-6 animate-in slide-in-from-left duration-300">
        
        {/* Submit Candidate Request Section */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-blue-100 bg-white">
            <button 
                onClick={() => setShowJobRequest(!showJobRequest)}
                className={`w-full p-8 flex justify-between items-center cursor-pointer transition ${showJobRequest ? 'bg-blue-50/50' : 'bg-white hover:bg-blue-50/30'}`}
            >
                <div className="text-left">
                    <h2 className="text-2xl font-black flex items-center gap-4 text-slate-800 uppercase tracking-tighter">
                        <JobIcon className="text-blue-500" size={32} /> Submit Candidate Job Request
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Found someone looking for work? Log it here for HR.</p>
                </div>
                <div className="bg-white p-2 rounded-full shadow-sm border border-blue-100">
                  {showJobRequest ? <ChevronUp size={24} className="text-blue-600"/> : <ChevronDown size={24} className="text-slate-300"/>}
                </div>
            </button>
            
            {showJobRequest && (
                <div className="p-10 border-t border-blue-100 bg-white">
                    {submittedCandidateRequest ? (
                         <div className="bg-emerald-50 rounded-3xl p-8 border-2 border-emerald-100 flex justify-between items-center shadow-inner">
                            <div>
                                <h4 className="font-black text-emerald-900 text-xl flex items-center gap-3 tracking-tight">
                                    <CheckCircle size={28} className="text-emerald-500" /> Request successfully logged!
                                </h4>
                                <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mt-2">HR team will contact {submittedCandidateRequest.name} shortly.</p>
                            </div>
                            <button onClick={() => setSubmittedCandidateRequest(null)} className="bg-white text-rose-600 p-4 hover:bg-rose-50 rounded-2xl transition border-2 border-rose-100 shadow-sm"><Trash2 size={24}/></button>
                         </div>
                    ) : (
                        <form onSubmit={handleCandidateRequestSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div className="space-y-1">
                                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Candidate Name *</label>
                                         <input required className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-black focus:border-blue-500 outline-none transition bg-slate-50" value={candidateRequest.name} onChange={e => setCandidateRequest({...candidateRequest, name: e.target.value})} />
                                     </div>
                                     <div className="space-y-1">
                                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mobile Number *</label>
                                         <input required type="tel" className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-black focus:border-blue-500 outline-none transition bg-slate-50" value={candidateRequest.phone} onChange={e => setCandidateRequest({...candidateRequest, phone: e.target.value})} />
                                     </div>
                                     <div className="space-y-1">
                                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Staff Role *</label>
                                         <select required className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-black focus:border-blue-500 outline-none transition bg-slate-50 appearance-none" value={candidateRequest.role} onChange={e => setCandidateRequest({...candidateRequest, role: e.target.value})}>
                                             <option value="">Select Role</option>
                                             {SKILL_CATEGORIES['Restaurant'].map(skill => <option key={skill} value={skill}>{skill}</option>)}
                                         </select>
                                     </div>
                                     <div className="space-y-1">
                                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Preferred Location *</label>
                                         <input required placeholder="City or Locality" className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm font-black focus:border-blue-500 outline-none transition bg-slate-50" value={candidateRequest.location} onChange={e => setCandidateRequest({...candidateRequest, location: e.target.value})} />
                                     </div>
                                 </div>
                                 <motion.button whileTap={{ scale: 0.97 }} type="submit" className="w-full bg-blue-600 text-white font-black py-6 rounded-3xl hover:bg-blue-700 transition flex items-center justify-center gap-4 shadow-2xl uppercase tracking-[0.2em] text-sm">
                                     <Send size={24} /> Share Candidate with HR
                                 </motion.button>
                        </form>
                    )}
                </div>
            )}
        </div>

        {/* Live Job Feed */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="p-8 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-2xl font-black flex items-center gap-4 text-slate-800 dark:text-slate-100 uppercase tracking-tighter">
                  <Briefcase className="text-orange-500" size={32} /> Hot Vacancies Today
                </h2>
                <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-full font-black uppercase tracking-[0.2em] border border-orange-200 dark:border-orange-800">Live Feed</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {jobs.filter(j => j.status === 'OPEN').map((job) => (
                    <motion.div key={job.id} whileHover={{ scale: 1.005 }}
                      className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                    >
                        <div className="flex-1">
                            <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition tracking-tight">{job.role}</h3>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-tight">
                                <span className="flex items-center gap-2"><MapPin size={18} className="text-indigo-400"/> {job.location}</span>
                                <span className="flex items-center gap-2"><Clock size={18} className="text-indigo-400"/> {job.shiftType}</span>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-6">
                                <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                    <Utensils size={14} className="text-slate-400"/> Food Included
                                </span>
                                <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                    <Home size={14} className="text-slate-400"/> Accommodation
                                </span>
                                <div className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800 uppercase tracking-widest shadow-inner">
                                    Earn up to {CURRENCY}2,000 Bonus
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <motion.button whileTap={{ scale: 0.95 }}
                                onClick={() => toast.success('Connecting to Business HR...', { icon: '📞' })}
                                className="flex-1 md:flex-none border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                                Contact HR
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedJob(job)}
                                className="flex-1 md:flex-none bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition flex items-center justify-center gap-3"
                            >
                                <Share2 size={20} /> Refer &amp; Earn
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Share & Earn General Bonus Section */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-emerald-100 bg-white">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer" onClick={() => setShowReferral(!showReferral)}>
                <div>
                    <h2 className="text-3xl font-black flex items-center gap-4 uppercase tracking-tighter">
                        <Banknote className="animate-pulse" size={40} /> Refer Friend & Earn Bonus
                    </h2>
                    <p className="text-emerald-100 font-black text-xs uppercase tracking-[0.2em] mt-2 opacity-80">मित्रों को रेफर करें • Linked to Agency HR Portal</p>
                </div>
                <div className="bg-white/20 px-8 py-3 rounded-[2rem] border border-white/30 backdrop-blur-sm shadow-xl">
                    <span className="font-black text-xl">{CURRENCY}1,000+ Earnable</span>
                </div>
            </div>
            
            {showReferral && (
                <div className="p-10 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="font-black text-xl text-slate-800 flex items-center gap-3 uppercase tracking-tight">
                                <UserPlus size={24} className="text-emerald-600" /> New Candidate Detail
                            </h3>
                            <form onSubmit={handleReferralSubmit} className="space-y-6 p-8 bg-emerald-50/20 rounded-3xl border-2 border-emerald-50">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest ml-1">Full Name *</label>
                                    <input required className="w-full border-2 border-white rounded-2xl p-4 text-sm font-bold shadow-sm outline-none focus:border-emerald-500 transition" value={referralForm.name} onChange={e => setReferralForm({...referralForm, name: e.target.value})} placeholder="e.g. Rahul Dravid" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest ml-1">Mobile Number *</label>
                                    <input required type="tel" className="w-full border-2 border-white rounded-2xl p-4 text-sm font-bold shadow-sm outline-none focus:border-emerald-500 transition" value={referralForm.phone} onChange={e => setReferralForm({...referralForm, phone: e.target.value})} placeholder="10 Digit Number" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest ml-1">Role (e.g. Chef) *</label>
                                        <input required className="w-full border-2 border-white rounded-2xl p-4 text-sm font-bold shadow-sm outline-none focus:border-emerald-500 transition" value={referralForm.skill} onChange={e => setReferralForm({...referralForm, skill: e.target.value})} placeholder="e.g. Waiter" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest ml-1">Current Outlet</label>
                                        <input className="w-full border-2 border-white rounded-2xl p-4 text-sm font-bold shadow-sm outline-none focus:border-emerald-500 transition" value={referralForm.workplace} onChange={e => setReferralForm({...referralForm, workplace: e.target.value})} placeholder="Optional" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-emerald-600 text-white font-black py-6 rounded-3xl hover:bg-emerald-700 transition flex items-center justify-center gap-4 shadow-2xl active:scale-95 uppercase tracking-[0.2em] text-sm">
                                    <Send size={24} /> Submit to Agency
                                </button>
                            </form>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-black text-xl text-slate-800 flex items-center gap-3 uppercase tracking-tight">
                                <History size={24} className="text-slate-400" /> Referral Tracking
                            </h3>
                            <div className="overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-xl">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[10px] border-b">
                                        <tr>
                                            <th className="p-6">Staff Details</th>
                                            <th className="p-6">Status</th>
                                            <th className="p-6 text-right">Bonus Earned</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-bold">
                                        {referrals.map(ref => (
                                            <tr key={ref.id} className="hover:bg-slate-50 transition">
                                                <td className="p-6">
                                                    <div className="font-black text-slate-800 uppercase tracking-tight">{ref.candidateName}</div>
                                                    <div className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">{ref.candidateSkill}</div>
                                                </td>
                                                <td className="p-6">
                                                    {ref.status === 'Hired' || ref.status === 'Paid' 
                                                    ? <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-200">HIRED</span> 
                                                    : <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-amber-100">PENDING</span>}
                                                </td>
                                                <td className="p-6 text-right font-black text-emerald-600 text-base">
                                                    {ref.daysEmployed >= 30 ? `${CURRENCY}500` : '--'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
      ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 dark:from-indigo-900 dark:via-indigo-800 dark:to-blue-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden"
              >
                  <div className="relative z-10">
                    <h2 className="text-4xl font-black flex items-center gap-5 uppercase tracking-tighter">
                        <MapPin className="text-white animate-pulse" size={48} /> Nearby Opportunities
                    </h2>
                    <p className="text-indigo-100 dark:text-indigo-300 mt-4 text-xl font-medium max-w-2xl leading-relaxed">Interactive Map: Explore high-potential outlets in your vicinity</p>
                  </div>
                  <div className="absolute -right-12 -bottom-12 opacity-10">
                      <TrendingUp size={240} />
                  </div>
              </motion.div>

              {/* Interactive Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="h-[500px]"
              >
                <MapComponent 
                  center={{ lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' }}
                  markers={leads.map(lead => ({
                    id: lead.id,
                    position: { lat: 19.0760 + (Math.random() - 0.5) * 0.1, lng: 72.8777 + (Math.random() - 0.5) * 0.1, address: lead.location },
                    type: 'business',
                    title: lead.businessName,
                    description: `${lead.type} Lead • ${CURRENCY}${lead.potentialCommission}`
                  }))}
                  onMarkerClick={(marker) => {
                    const lead = leads.find(l => l.id === marker.id);
                    if (lead) {
                      toast(`${lead.businessName} - ${lead.distance} away`, { icon: '📍' });
                    }
                  }}
                />
              </motion.div>

              <div className="grid grid-cols-1 gap-8">
                {leads.map((lead, index) => (
                    <motion.div 
                      key={lead.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`group bg-white dark:bg-slate-900 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden shadow-xl ${lead.status === 'Booked' ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-indigo-50 dark:border-indigo-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-2xl'}`}
                    >
                        <div className="flex flex-col md:flex-row">
                            <div className="p-10 flex-1">
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <h3 className="font-black text-3xl text-slate-800 dark:text-slate-100 uppercase tracking-tighter">{lead.businessName}</h3>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${lead.type === 'High-Value' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {lead.type} Lead
                                    </span>
                                    {lead.status === 'Booked' && (
                                        <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.2em] shadow-lg shadow-emerald-100">
                                            <UserCheck size={14} /> Appointment Confirmed
                                        </span>
                                    )}
                                </div>
                                
                                <p className="text-slate-500 flex items-center gap-3 text-lg font-medium">
                                    <MapPin size={24} className="text-indigo-500" /> {lead.location} • <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">{lead.distance} away</span>
                                </p>

                                <div className="mt-10 flex flex-wrap gap-6">
                                    <div className="bg-white p-5 rounded-2xl border-2 border-slate-50 shadow-sm min-w-[180px] group-hover:border-indigo-100 transition">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Slot</p>
                                            <Calendar size={16} className="text-indigo-400" />
                                        </div>
                                        <div className="text-slate-800 font-black text-xl">
                                            {lead.appointmentDate}
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border-2 border-slate-50 shadow-sm min-w-[180px] group-hover:border-indigo-100 transition">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timing</p>
                                            <Timer size={16} className="text-indigo-400" />
                                        </div>
                                        <div className="text-slate-800 font-black text-xl">
                                            {lead.appointmentTime}
                                        </div>
                                    </div>
                                    {lead.status === 'Booked' && (
                                        <div className="bg-emerald-100 p-5 rounded-2xl border-2 border-emerald-200 shadow-lg flex-1 min-w-[280px]">
                                            <p className="text-[10px] font-black text-emerald-800 uppercase mb-2 tracking-widest">Assigned Support Staff</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3 text-emerald-900 font-black text-lg">
                                                    <ShieldCheck size={24} /> Mr. Anand K.
                                                </div>
                                                <button className="bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border-2 border-emerald-200 hover:bg-emerald-50 transition shadow-sm">
                                                    <Smartphone size={14} /> Call HR
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`p-10 md:w-80 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l-2 border-slate-50 ${lead.status === 'Booked' ? 'bg-white' : 'bg-slate-50/50'}`}>
                                <div className="text-center mb-8">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Estimated Commission</p>
                                    <p className="text-5xl font-black text-slate-900 tracking-tighter">{CURRENCY}{lead.potentialCommission}</p>
                                </div>
                                {lead.status !== 'Booked' ? (
                                    <motion.button 
                                        onClick={() => handleBookLead(lead.id)} 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full bg-slate-900 dark:bg-indigo-700 text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 dark:hover:bg-indigo-600 transition shadow-2xl flex items-center justify-center gap-3"
                                    >
                                        Book Now <ArrowRight size={20} />
                                    </motion.button>
                                ) : (
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="text-center text-emerald-700 py-4 bg-white rounded-2xl flex items-center justify-center gap-3 border-4 border-emerald-100 shadow-xl">
                                            <CheckCircle size={24} className="animate-bounce" />
                                            <p className="font-black uppercase tracking-widest text-sm">Scheduled</p>
                                        </div>
                                        <button 
                                            onClick={() => setCancellingLeadId(lead.id)}
                                            className="w-full text-[10px] text-rose-500 font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:text-rose-700 transition active:scale-95 py-2"
                                        >
                                            <XCircle size={16} /> Cancel Appointment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
              </div>
          </motion.div>
      )}
    </div>
  );
};
