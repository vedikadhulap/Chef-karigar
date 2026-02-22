
import React, { useState } from 'react';
import { 
  PlusCircle, 
  CheckCircle2, 
  Star, 
  Users,
  Store,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Banknote,
  AlertTriangle,
  MapPin,
  Clock,
  Briefcase,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  Wallet,
  Building2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { CURRENCY, INITIAL_PROCESS_FEE, MOCK_CURRENT_STAFF } from '../constants';
import { Job, JobStatus, HiredStaff, MatchBundle, StaffMember } from '../types';
import { ChatHub } from './ChatHub';
import { SkeletonCard, SkeletonTable } from './Skeleton';
import { GrievanceModal } from './GrievanceModal';
import { StarRatingWidget, StarRating } from './StarRating';

const ROLE_OPTIONS = [
  'Continental Chef', 
  'Tandoor Chef', 
  'Indian Chef', 
  'North Indian Chef', 
  'Waiter', 
  'Kitchen Helper',
  'Chat Maker', 
  'Pani Puri Server', 
  'Pav Bhaji Maker', 
  'Fast Food Helper', 
  'Sandwich Artist',
  'Other'
];

interface BusinessViewProps {
    jobs: Job[];
    onJobPosted: (job: Job) => void;
    matchBundles: MatchBundle[];
    staffList: StaffMember[];
    onUpdateMatchBundles: (bundles: MatchBundle[]) => void;
}

export const BusinessView: React.FC<BusinessViewProps> = ({ 
    jobs, 
    onJobPosted, 
    matchBundles, 
    staffList, 
    onUpdateMatchBundles 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'current-staff' | 'post-job'>('dashboard');
  const [currentStaffList, setCurrentStaffList] = useState<HiredStaff[]>(MOCK_CURRENT_STAFF);
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Post Job Form State
  const [newJob, setNewJob] = useState({
    role: '',
    pinCode: '',
    salary: '25000',
    shiftType: 'Full-time (12 Hours)',
    timeline: 'Immediate' as const
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [grievanceTarget, setGrievanceTarget] = useState<{ name: string } | null>(null);
  const [staffRatings, setStaffRatings] = useState<Record<string, number>>({});
  const [customRole, setCustomRole] = useState('');

  const handleRateStaff = (staffId: string, rating: number, feedback: string) => {
    setStaffRatings(prev => ({ ...prev, [staffId]: rating }));
    toast.success(`Rating of ${rating}/5 submitted for ${currentStaffList.find(s => s.id === staffId)?.name || 'staff'}!`, { icon: '⭐' });
  };

  const mamtaJobs = jobs.filter(j => j.location.includes('Mamta'));
  const activeProposals = matchBundles.filter(b => b.businessName.includes('Mamta') && (b.status === 'New' || b.status === 'Pitched'));

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onJobPosted({
        id: Math.random().toString(36).substr(2, 9),
        role: newJob.role === 'Other' ? customRole.trim() || 'Other' : newJob.role,
        location: 'Mamta Cafe, Mumbai',
        pinCode: newJob.pinCode,
        salary: Number(newJob.salary),
        shiftType: newJob.shiftType,
        status: JobStatus.OPEN,
        paymentVerified: true,
        postedDate: new Date().toISOString().split('T')[0],
        timeline: newJob.timeline
      });
      setIsProcessing(false);
      setActiveTab('dashboard');
      setNewJob({ role: '', pinCode: '', salary: '25000', shiftType: 'Full-time (12 Hours)', timeline: 'Immediate' });
      setCustomRole('');
      toast.success('Job posted successfully! HR team is sourcing candidates.', { icon: '✅' });
    }, 1000);
  };

  const handleHire = (bundleId: string, candidateId: string, isVerified: boolean) => {
    const candidate = staffList.find(s => s.id === candidateId);
    if (!candidate) return;

    if (!isVerified) {
        if(confirm(`Accept ${candidate.name} for trial?`)) {
            onUpdateMatchBundles(matchBundles.map(b => b.id === bundleId ? { ...b, status: 'Interviewing' } : b));
            setShowChat(true);
            toast.success(`${candidate.name} approved for trial! Chat is now active.`, { icon: '💬' });
        }
    } else {
        if(confirm(`Hire ${candidate.name} immediately?`)) {
            onUpdateMatchBundles(matchBundles.map(b => b.id === bundleId ? { ...b, status: 'Closed' } : b));
            setCurrentStaffList([...currentStaffList, {
                id: candidate.id,
                name: candidate.name,
                role: candidate.skill,
                salary: 25000,
                startDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                nextPayoutDue: 'Upcoming',
                status: 'Hired'
            }]);
            toast.success(`${candidate.name} hired successfully!`, { icon: '🎉', duration: 4000 });
        }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Grievance Modal */}
      <GrievanceModal
        isOpen={!!grievanceTarget}
        onClose={() => setGrievanceTarget(null)}
        reporterName="Mamta Cafe"
        reporterRole="business"
        contextLabel={grievanceTarget?.name}
      />

      {/* Chat Hub — only active when a candidate is Approved for Trial */}
      {showChat && (
        <ChatHub 
          currentUserId="business_mamta"
          currentUserName="Mamta Cafe"
          currentUserRole="business"
          visible={showChat}
        />
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4"
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg text-orange-600 dark:text-orange-400">
                <Store size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Mamta Cafe</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Business Dashboard</p>
            </div>
        </div>
        <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('current-staff')} 
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${activeTab === 'current-staff' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <Users size={16} /> Current Staff
            </button>
            <button 
              onClick={() => setActiveTab('post-job')} 
              className={`flex-1 md:flex-none bg-slate-900 dark:bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-indigo-700 transition ml-2`}
            >
              <PlusCircle size={16} /> Post New Job
            </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
      {activeTab === 'dashboard' && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                >
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Jobs</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-slate-100">{mamtaJobs.length}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                >
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Hired Staff</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-slate-100">{currentStaffList.length}</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                >
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pending Invoices</p>
                    <p className="text-4xl font-black text-orange-600 dark:text-orange-400">1</p>
                </motion.div>
            </div>

            {activeProposals.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900 shadow-lg overflow-hidden border-2"
              >
                <div className="p-4 border-b bg-indigo-50 dark:bg-indigo-950 flex justify-between items-center">
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 uppercase tracking-tight"><Zap size={18} className="text-orange-500"/> New Profiles Available!</h3>
                    <span className="text-[10px] font-black bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded-full uppercase tracking-widest">Live Feedback</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeProposals.map(bundle => bundle.candidateIds.map(cid => {
                        const staff = staffList.find(s => s.id === cid);
                        if (!staff) return null;
                        return (
                                <motion.div key={cid} whileHover={{ scale: 1.01 }} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <div className="flex gap-4 items-center">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl border-2 border-slate-50 shadow-sm overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${staff.id}`} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{staff.name}</p>
                                            {staff.isVerified && <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-black uppercase">Verified</span>}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{staff.skill}</p>
                                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                                <Star size={12} fill="currentColor" /> {staff.rating || '4.2'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleHire(bundle.id, staff.id, staff.isVerified)}
                                        className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-black uppercase transition shadow-lg tracking-widest ${staff.isVerified ? 'bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-700' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                                    >
                                        {staff.isVerified ? 'Approve for Trial' : 'Review Profile'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    }))}
                </div>
              </motion.div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <h3 className="font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 uppercase tracking-tighter"><Briefcase size={18} className="text-slate-400"/> Recent Job Postings</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-bold">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-6">Role</th>
                                <th className="p-6">Location &amp; Pin</th>
                                <th className="p-6">Budget</th>
                                <th className="p-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {mamtaJobs.map(job => (
                                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                                    <td className="p-6">
                                        <p className="text-slate-800 dark:text-slate-100 font-black">{job.role}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Posted: {job.postedDate}</p>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                          <MapPin size={14} className="text-slate-300 dark:text-slate-600" />
                                          <span className="uppercase tracking-tight">{job.location.split(',')[0]}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1 ml-5">PIN: {job.pinCode || '400001'}</p>
                                    </td>
                                    <td className="p-6 text-slate-800 dark:text-slate-100">{CURRENCY}{job.salary.toLocaleString()} - {Number(job.salary) + 6000}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${job.status === JobStatus.OPEN ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
      )}

      {activeTab === 'current-staff' && (
        <motion.div
          key="current-staff"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3 uppercase tracking-tighter">
                      <Users size={28} className="text-orange-500" /> Current Staff & Payroll
                    </h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Manage payments, view due dates, or release staff.</p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-950 px-4 py-2 rounded-xl text-xs font-black text-orange-700 dark:text-orange-400 uppercase tracking-widest border border-orange-200 dark:border-orange-900">LIVE SYNC ACTIVE</div>
            </div>
            <div className="divide-y divide-slate-100">
                {currentStaffList.map(staff => (
                    <div key={staff.id} className="overflow-hidden">
                        <div 
                          onClick={() => setExpandedStaffId(expandedStaffId === staff.id ? null : staff.id)}
                          className="p-6 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-black text-xl border-2 border-slate-50 dark:border-slate-600 shadow-sm">
                                  {staff.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{staff.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-widest mt-0.5">
                                      <Building2 size={12} className="text-orange-400" /> {staff.role}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Monthly Salary</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-slate-100">{CURRENCY}{staff.salary.toLocaleString()}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${staff.status === 'Active' || staff.status === 'Hired' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                    {staff.status}
                                </div>
                                {expandedStaffId === staff.id ? <ChevronUp size={24} className="text-slate-400"/> : <ChevronDown size={24} className="text-slate-400"/>}
                            </div>
                        </div>
                        {expandedStaffId === staff.id && (
                          <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-2 duration-300">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fixed Monthly Salary</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{CURRENCY}{staff.salary.toLocaleString()}</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Start Date</p>
                                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{staff.startDate}</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-orange-200 dark:border-orange-900 shadow-sm flex justify-between items-center relative overflow-hidden">
                                    <div className="relative z-10">
                                      <div className="flex items-center gap-1.5 mb-2">
                                        <CalendarDays className="text-orange-500" size={14} />
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Next Payment Due</p>
                                      </div>
                                      <p className="text-xl font-black text-rose-600">{staff.nextPayoutDue || 'TBD'}</p>
                                    </div>
                                    <Clock size={48} className="absolute -right-4 -bottom-4 text-orange-100/50" />
                                </div>
                             </div>

                             <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                                <div className="flex justify-between items-center mb-6">
                                  <h4 className="font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 uppercase tracking-tight">
                                    <Wallet size={20} className="text-indigo-500" /> Pay Salary
                                  </h4>
                                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Integrated Bank Transfer</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                   <div className="space-y-2">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Amount ({CURRENCY})</label>
                                      <input 
                                        type="number" 
                                        className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-xl p-4 font-black text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 transition shadow-sm bg-slate-50 dark:bg-slate-800"
                                        defaultValue={staff.salary - 4} // Example deduction shown in screenshot
                                      />
                                   </div>
                                   <div className="space-y-2 relative">
                                      <div className="absolute right-3 top-0 text-[10px] font-black text-rose-500 uppercase flex items-center gap-1">
                                        <AlertTriangle size={12} /> Deduction Reason
                                      </div>
                                      <input 
                                        className="w-full border-2 border-rose-50 dark:border-rose-900/40 rounded-xl p-4 font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-rose-300 transition shadow-sm bg-rose-50/30 dark:bg-rose-950/20"
                                        placeholder="e.g. Unpaid Leave, Advance Adjustment"
                                      />
                                   </div>
                                </div>
                                <motion.button whileTap={{ scale: 0.97 }} className="mt-8 w-full bg-slate-900 dark:bg-indigo-600 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-sm hover:bg-slate-800 dark:hover:bg-indigo-700 transition shadow-xl">
                                   Process Transfer
                                </motion.button>
                                <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-4 italic">* Salary will be credited to {staff.name}'s verified bank account via IMPS/NEFT.</p>
                             </div>

                             {/* Star Rating Widget */}
                             <div className="mt-6">
                               <StarRatingWidget
                                 staffName={staff.name}
                                 currentRating={staffRatings[staff.id] || 0}
                                 onSubmit={(rating, feedback) => handleRateStaff(staff.id, rating, feedback)}
                               />
                             </div>

                             <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button
                                  onClick={() => setGrievanceTarget({ name: staff.name })}
                                  className="text-[10px] font-black text-rose-500 hover:text-rose-700 transition flex items-center justify-center gap-2 uppercase tracking-widest border-2 border-rose-100 hover:border-rose-300 dark:border-rose-900/50 dark:hover:border-rose-700 px-4 py-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                >
                                  ⚠️ Report Dispute
                                </button>
                                <button className="text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center justify-center gap-2 uppercase tracking-widest border-2 border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-rose-50/30 dark:hover:bg-rose-950/10">
                                   Mark Staff as Left / Resigned
                                </button>
                             </div>
                          </div>
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
      )}

      {activeTab === 'post-job' && (
        <motion.div
          key="post-job"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 bg-slate-900 dark:bg-slate-800 text-white">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Post a New Job</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Find the best Karigars for your business.</p>
            </div>
            <form onSubmit={handlePostJob} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Role *</label>
                        <select 
                            required 
                            className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                            value={newJob.role}
                            onChange={e => {
                              setNewJob({...newJob, role: e.target.value});
                              if (e.target.value !== 'Other') setCustomRole('');
                            }}
                        >
                            <option value="">Select a Role</option>
                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        {newJob.role === 'Other' && (
                          <input
                            autoFocus
                            required
                            className="w-full border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition bg-orange-50/40 dark:bg-orange-950/20 text-slate-800 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-500 mt-3"
                            placeholder="Describe the custom role (e.g. Sushi Chef)"
                            value={customRole}
                            onChange={e => setCustomRole(e.target.value)}
                          />
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location *</label>
                        <input 
                            required 
                            className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                            placeholder="e.g. Mamta Cafe"
                            defaultValue="Mamta Cafe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pin Code *</label>
                        <input 
                            required 
                            className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                            placeholder="e.g. 400053"
                            value={newJob.pinCode}
                            onChange={e => setNewJob({...newJob, pinCode: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Salary (Max Budget) *</label>
                        <input 
                            required 
                            type="number" 
                            className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                            placeholder="e.g. 25000"
                            value={newJob.salary}
                            onChange={e => setNewJob({...newJob, salary: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shift Type *</label>
                        <select 
                            className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                            value={newJob.shiftType}
                            onChange={e => setNewJob({...newJob, shiftType: e.target.value})}
                        >
                            <option>Full-time (12 Hours)</option>
                            <option>Part-time (6 Hours)</option>
                            <option>Contractual</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Joining Timeline *</label>
                        <select 
                            className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                            value={newJob.timeline}
                            onChange={e => setNewJob({...newJob, timeline: e.target.value as any})}
                        >
                            <option value="Immediate">Immediate Joining</option>
                            <option value="Within 1 Week">Within 1 Week</option>
                            <option value="Within 1 Month">Within 1 Month</option>
                        </select>
                    </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-3xl border-2 border-orange-100 dark:border-orange-900/50 flex justify-between items-center shadow-inner">
                    <div className="flex items-center gap-3">
                      <Banknote className="text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-black text-orange-900 dark:text-orange-300 uppercase tracking-widest">Processing Commitment Fee</span>
                    </div>
                    <span className="text-2xl font-black text-orange-900 dark:text-orange-300">{CURRENCY}{INITIAL_PROCESS_FEE}</span>
                </div>

                <motion.button 
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    disabled={isProcessing}
                    className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-black py-6 rounded-[2rem] text-sm uppercase tracking-[0.3em] hover:bg-slate-800 dark:hover:bg-indigo-700 transition shadow-2xl disabled:opacity-50"
                >
                    {isProcessing ? 'Verifying Payment...' : `Post Job & Start Sourcing`}
                </motion.button>
            </form>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};
