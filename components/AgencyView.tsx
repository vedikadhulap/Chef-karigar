
import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Users, Search, MapPin, Building2, PhoneCall, X, UserPlus, ShieldCheck, 
  Utensils, Home, CheckCircle2, ArrowRight, Calculator, ClipboardList, 
  Edit2, History, Clock, UserCheck, Filter, Phone, BarChart2, TrendingUp, 
  PieChart, DollarSign, AlertCircle, Calendar, CheckCircle, XCircle, 
  BellRing, Smartphone, Briefcase, ChevronUp, ChevronDown, BadgeCheck,
  Target, Rocket, Handshake, Headphones, Layers, TrendingDown,
  UserX, FileCheck, Landmark, Receipt, Sparkles, Zap
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { motion } from 'framer-motion';
import { CURRENCY, MOCK_TRANSACTIONS, MOCK_MATCH_BUNDLES } from '../constants';
import { StaffMember, AgencyRole, Job, MatchBundle, EditRecord, Transaction } from '../types';
import { calculateMatchScore, getMatchColor } from '../services/api';
import { SkeletonTable } from './Skeleton';

interface AgencyViewProps {
    role: AgencyRole;
    jobs: Job[];
    staffList: StaffMember[];
    setStaffList: (list: StaffMember[]) => void;
}

const RESPONSE_OPTIONS = [
    "Will call again",
    "Call back later",
    "Call tomorrow",
    "Interested",
    "Not interested",
    "Hired elsewhere",
    "Will contact soon",
    "Has referrals"
];

export const AgencyView: React.FC<AgencyViewProps> = ({ role, jobs, staffList, setStaffList }) => {
  const [matchBundles, setMatchBundles] = useState<MatchBundle[]>(MOCK_MATCH_BUNDLES);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Ghosting alert: warn if any MatchBundle has been in 'Interviewing' for > 24 hours
  useEffect(() => {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    matchBundles
      .filter(b => b.status === 'Interviewing')
      .forEach(b => {
        const created = new Date(b.dateCreated).getTime();
        if (now - created > TWENTY_FOUR_HOURS) {
          toast.error(
            `⚠️ Ghosting Alert: ${b.businessName} (${b.role}) has been in Interviewing for over 24 hours. Follow up now!`,
            { id: `ghost-${b.id}`, duration: 8000 }
          );
        }
      });
  }, [matchBundles]);

  const pushToSales = (bundle: MatchBundle) => {
      setMatchBundles(prev => [bundle, ...prev]);
  };

  const updateBundleStatus = (id: string, newStatus: MatchBundle['status']) => {
      setMatchBundles(prev => prev.map(b => b.id === id ? { ...b, status: newStatus, lastActionBy: 'Admin Sales/Ops' } : b));
  };

  return (
      <div className="space-y-6">
          {role === 'SUPPORT' && (
              <SupportDashboard 
                staffList={staffList} 
                setStaffList={setStaffList} 
                jobs={jobs} 
                onPushToSales={pushToSales} 
                matchBundles={matchBundles} 
              />
          )}
          {role === 'SALES' && (
              <SalesDashboard 
                matchBundles={matchBundles} 
                staffList={staffList}
                updateBundleStatus={updateBundleStatus}
                jobs={jobs}
              />
          )}
          {role === 'FINANCE' && (
              <FinanceDashboard 
                staffList={staffList} 
                transactions={transactions}
                matchBundles={matchBundles}
              />
          )}
      </div>
  );
};

const SupportDashboard: React.FC<{
    staffList: StaffMember[], 
    setStaffList: (l: StaffMember[]) => void, 
    jobs: Job[], 
    onPushToSales: (b: MatchBundle) => void, 
    matchBundles: MatchBundle[]
}> = ({ staffList, setStaffList, jobs, onPushToSales, matchBundles }) => {
    const [activeTab, setActiveTab] = useState<'staff' | 'business' | 'add-staff'>('staff');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [editingStaff, setEditingStaff] = useState<{ id: string, field: 'name' | 'skill', value: string } | null>(null);
    const [selectedJobForMatch, setSelectedJobForMatch] = useState<Job | null>(null);
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
    
    const [newStaffForm, setNewStaffForm] = useState({
        name: '', phone: '', skill: '', location: '', refereeName: '', refereePhone: ''
    });

    const alreadyMatchedIds = useMemo(() => matchBundles.flatMap(b => b.candidateIds), [matchBundles]);

    const filteredStaff = useMemo(() => {
        return staffList.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.phone?.includes(searchTerm);
            const matchesRole = !roleFilter || s.skill === roleFilter;
            const matchesStatus = !statusFilter || (statusFilter === 'LOOKING' ? s.currentLocation === 'Looking for work' : s.currentLocation !== 'Looking for work');
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [staffList, searchTerm, roleFilter, statusFilter]);

    const sortedJobs = useMemo(() => {
        const priorityMap: Record<string, number> = {
            'Immediate': 1,
            'Within 1 Week': 2,
            'Within 1 Month': 3
        };
        return [...jobs].sort((a, b) => (priorityMap[a.timeline] || 4) - (priorityMap[b.timeline] || 4));
    }, [jobs]);

    const handleUpdateStaff = (staffId: string, field: 'name' | 'skill', newValue: string) => {
        const updatedList = staffList.map(s => {
            if (s.id === staffId) {
                const edit: EditRecord = {
                    field,
                    oldValue: s[field] as string,
                    newValue,
                    changedBy: 'Support Agent',
                    date: new Date().toLocaleString()
                };
                return {
                    ...s,
                    [field]: newValue,
                    editHistory: [edit, ...(s.editHistory || [])]
                };
            }
            return s;
        });
        setStaffList(updatedList);
        setEditingStaff(null);
    };

    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntry: StaffMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: newStaffForm.name,
            phone: newStaffForm.phone,
            skill: newStaffForm.skill,
            currentLocation: newStaffForm.location || 'Looking for work',
            referredBy: newStaffForm.refereeName || 'Admin Entry',
            referredByPhone: newStaffForm.refereePhone || '',
            isVerified: false,
            isSkillVerified: false,
            experienceYears: 0,
            contractMonths: 0,
            serviceCommissionTotal: 0,
            status: 'Unverified',
            dateAdded: new Date().toISOString().split('T')[0],
            rating: 0,
            callLog: { lastContactedBy: 'System', contactedDate: new Date().toLocaleDateString(), response: 'New Entry' },
            editHistory: []
        };
        setStaffList([newEntry, ...staffList]);
        setNewStaffForm({ name: '', phone: '', skill: '', location: '', refereeName: '', refereePhone: '' });
        setActiveTab('staff');
    };

    const handleMatchSubmit = () => {
        if (!selectedJobForMatch) return;
        const bundle: MatchBundle = {
            id: Math.random().toString(36).substr(2, 9),
            jobId: selectedJobForMatch.id,
            businessName: selectedJobForMatch.location.split(',')[0].trim(),
            role: selectedJobForMatch.role,
            salary: selectedJobForMatch.salary,
            candidateIds: selectedCandidates,
            status: 'New',
            dateCreated: new Date().toISOString().split('T')[0]
        };
        onPushToSales(bundle);
        setSelectedJobForMatch(null);
        setSelectedCandidates([]);
    };

    return (
        <div className="space-y-6">
            {/* Audit & Edit Modal */}
            {editingStaff && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                            <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Audit Field: {editingStaff.field}</h3>
                            <button onClick={() => setEditingStaff(null)}><X size={20}/></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">New Entry</label>
                                <input 
                                    className="w-full border-2 border-indigo-100 dark:border-indigo-800 rounded-2xl p-4 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 outline-none font-bold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    value={editingStaff.value}
                                    onChange={e => setEditingStaff({...editingStaff, value: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <History size={14} className="text-indigo-500"/> Audit History
                                </h4>
                                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {(staffList.find(s => s.id === editingStaff.id)?.editHistory || [])
                                        .filter(h => h.field === editingStaff.field)
                                        .map((h, i) => (
                                        <div key={i} className="text-[10px] bg-indigo-50/50 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900">
                                            <div className="flex justify-between font-black text-indigo-700 dark:text-indigo-400 mb-1">
                                                <span>{h.date}</span>
                                                <span>BY: {h.changedBy}</span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400">From <span className="line-through text-slate-400 dark:text-slate-500">{h.oldValue}</span> to <span className="font-black text-slate-800 dark:text-slate-200">"{h.newValue}"</span></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleUpdateStaff(editingStaff.id, editingStaff.field, editingStaff.value)}
                                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition shadow-xl uppercase tracking-widest text-xs"
                            >
                                Update & Log Transaction
                            </motion.button>
                        </div>
                    </div>
                </div>
            )}

            {/* Match Modal */}
            {selectedJobForMatch && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="bg-orange-50 dark:bg-orange-950 p-6 border-b border-orange-100 dark:border-orange-900 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-orange-900 dark:text-orange-200 text-xl tracking-tighter flex items-center gap-2">
                                    <Zap className="text-orange-500" size={24} />
                                    AI-Powered Match: {selectedJobForMatch.role}
                                </h3>
                                <p className="text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-widest">{selectedJobForMatch.location.split(',')[0]}</p>
                            </div>
                            <button onClick={() => setSelectedJobForMatch(null)} className="hover:bg-orange-100 dark:hover:bg-orange-900 p-2 rounded-lg transition"><X size={24}/></button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 space-y-2">
                            {staffList
                                .filter(s => s.skill === selectedJobForMatch.role && !alreadyMatchedIds.includes(s.id))
                                .map(staff => {
                                    const matchScore = calculateMatchScore(staff, selectedJobForMatch);
                                    const colorName = getMatchColor(matchScore.totalScore);
                                    return (
                                        <motion.div 
                                            key={staff.id} 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            whileHover={{ scale: 1.02 }}
                                            className={`p-4 cursor-pointer transition rounded-2xl border-2 ${
                                                selectedCandidates.includes(staff.id) 
                                                    ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-600 dark:border-indigo-500' 
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent'
                                            }`} 
                                            onClick={() => setSelectedCandidates(prev => prev.includes(staff.id) ? prev.filter(id => id !== staff.id) : [...prev, staff.id])}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={`font-black text-sm ${staff.isVerified ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                            {staff.name} {staff.isVerified && <CheckCircle size={14} className="inline ml-1"/>}
                                                        </div>
                                                        <motion.span 
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                                                                matchScore.totalScore >= 85
                                                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                                                    : matchScore.totalScore >= 50
                                                                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                                            }`}
                                                        >
                                                            {matchScore.totalScore}% Match
                                                        </motion.span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">{staff.phone} • {staff.currentLocation}</div>
                                                    <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-blue-600 dark:text-blue-400">Skill: {matchScore.breakdown.skillScore}%</span>
                                                        <span className="text-emerald-600 dark:text-emerald-400">Location: {matchScore.breakdown.locationScore}%</span>
                                                        <span className="text-orange-600 dark:text-orange-400">Exp: {matchScore.breakdown.experienceScore}%</span>
                                                    </div>
                                                </div>
                                                {selectedCandidates.includes(staff.id) && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                    >
                                                        <CheckCircle2 size={24} className="text-indigo-600 dark:text-indigo-400" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                            <p className="text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{selectedCandidates.length} Candidates Selected</p>
                            <motion.button whileTap={{ scale: 0.95 }} onClick={handleMatchSubmit} className="bg-slate-900 dark:bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase hover:bg-slate-800 dark:hover:bg-indigo-700 transition shadow-xl tracking-widest disabled:opacity-50" disabled={selectedCandidates.length === 0}>
                                Push to Sales/Operations Team
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Support Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6"
            >
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase">Support console</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 uppercase tracking-widest font-black">Expert Recruitment & Database Management</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                    <button onClick={() => setActiveTab('staff')} className={`px-8 py-3.5 text-xs font-black rounded-xl transition ${activeTab === 'staff' ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>STAFF REPORTING</button>
                    <button onClick={() => setActiveTab('business')} className={`px-8 py-3.5 text-xs font-black rounded-xl transition ${activeTab === 'business' ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>BUSINESS PARTNERS</button>
                    <button onClick={() => setActiveTab('add-staff')} className={`px-8 py-3.5 text-xs font-black rounded-xl transition ${activeTab === 'add-staff' ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>ADD NEW DATA</button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
            {activeTab === 'staff' && (
                <motion.div
                  key="staff"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-[11px] border-collapse min-w-[1400px]">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-6">STAFF DETAILS & MOBILE</th>
                                <th className="p-6">SKILL VERIFIED</th>
                                <th className="p-6">STATUS & LOCATION</th>
                                <th className="p-6 text-center">CONTACT REPORT</th>
                                <th className="p-6">RESPONSE RECEIVED</th>
                                <th className="p-6">REFEREE NAME</th>
                                <th className="p-6 text-right">DATE ADDED</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
                            {filteredStaff.map(staff => (
                                <tr key={staff.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition group">
                                    <td className="p-6">
                                        <div className={`font-black uppercase tracking-tight ${staff.isVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {staff.name} {staff.isVerified && <CheckCircle size={14} className="inline ml-1"/>}
                                        </div>
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black mt-1 flex items-center gap-1.5 uppercase tracking-widest">
                                            <Phone size={10} className="text-slate-300 dark:text-slate-600"/> {staff.phone}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${staff.isSkillVerified || staff.isVerified ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                            {staff.skill}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-slate-800 dark:text-slate-200 uppercase tracking-tighter font-black">
                                          {staff.currentLocation === 'Looking for work' ? 'Looking for Job' : 'Working at Location'}
                                        </div>
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                          <MapPin size={10} className="text-slate-300 dark:text-slate-600" /> {staff.currentLocation === 'Looking for work' ? 'Unknown' : staff.currentLocation}
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="p-2 bg-rose-50 text-rose-500 rounded-full">
                                              <PhoneCall size={16} />
                                            </div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                              {staff.callLog?.lastContactedBy || 'No Agent'}
                                            </div>
                                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                              {staff.callLog?.contactedDate === 'Never' ? 'Never' : 'Yesterday'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <select 
                                            className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px] font-black outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 w-full uppercase tracking-widest"
                                            value={staff.callLog?.response || ""}
                                            onChange={e => {
                                                const updated = staffList.map(s => s.id === staff.id ? { 
                                                    ...s, 
                                                    callLog: { ...s.callLog, response: e.target.value, lastContactedBy: 'Support Agent', contactedDate: new Date().toLocaleDateString() } 
                                                } : s);
                                                setStaffList(updated);
                                            }}
                                        >
                                            <option value="">Select Response</option>
                                            {RESPONSE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase">
                                                {(staff.referredBy || 'S').charAt(0)}
                                            </div>
                                            <span className="text-slate-800 dark:text-slate-200 uppercase tracking-tighter font-black">{staff.referredBy || 'SYSTEM'}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right text-slate-400 dark:text-slate-500 font-black tracking-widest uppercase">{staff.dateAdded || '2023-10-01'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}

            {/* Business Partners / Job Requests tab */}
            {activeTab === 'business' && (
                <motion.div
                  key="business"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8"
                >
                  <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 mb-6 text-slate-900 dark:text-slate-100">
                    <Sparkles className="text-orange-500" /> Active Job Requests
                  </h3>
                  <div className="space-y-4">
                    {sortedJobs.map(job => (
                      <motion.div
                        key={job.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center hover:border-indigo-500 dark:hover:border-indigo-400 transition cursor-default"
                      >
                         <div>
                            <div className="font-black text-slate-800 dark:text-slate-100 text-lg uppercase tracking-tight">{job.role}</div>
                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                               <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                               <span className="flex items-center gap-1"><Clock size={12}/> {job.timeline}</span>
                            </div>
                         </div>
                         <motion.button
                           whileTap={{ scale: 0.95 }}
                           onClick={() => setSelectedJobForMatch(job)}
                           className="bg-slate-900 dark:bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-indigo-700 transition"
                         >
                           Source Staff
                         </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
            )}

            {activeTab === 'add-staff' && (
                <motion.div
                  key="add-staff"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
                >
                  <div className="p-8 bg-emerald-700 dark:bg-emerald-800 text-white">
                    <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3"><UserPlus size={28}/> Add New Staff / Entry</h2>
                    <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mt-2">Log a new candidate directly into the database</p>
                  </div>
                  <form onSubmit={handleAddStaff} className="p-10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name *</label>
                        <input required className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition" placeholder="e.g. Rahul Kumar" value={newStaffForm.name} onChange={e => setNewStaffForm({...newStaffForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number *</label>
                        <input required type="tel" className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition" placeholder="10-digit number" value={newStaffForm.phone} onChange={e => setNewStaffForm({...newStaffForm, phone: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill / Role *</label>
                        <select required className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition" value={newStaffForm.skill} onChange={e => setNewStaffForm({...newStaffForm, skill: e.target.value})}>
                          <option value="">Select Role</option>
                          {['Continental Chef','Tandoor Chef','Indian Chef','North Indian Chef','Waiter','Kitchen Helper','Chat Maker'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Location</label>
                        <input className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition" placeholder="City / area" value={newStaffForm.location} onChange={e => setNewStaffForm({...newStaffForm, location: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referee Name</label>
                        <input className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition" placeholder="Who referred this candidate?" value={newStaffForm.refereeName} onChange={e => setNewStaffForm({...newStaffForm, refereeName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referee Mobile</label>
                        <input type="tel" className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition" placeholder="optional" value={newStaffForm.refereePhone} onChange={e => setNewStaffForm({...newStaffForm, refereePhone: e.target.value})} />
                      </div>
                    </div>
                    <motion.button type="submit" whileTap={{ scale: 0.97 }} className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-sm hover:bg-emerald-700 transition shadow-xl flex items-center justify-center gap-3">
                      <UserPlus size={20} /> Add to Database
                    </motion.button>
                  </form>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// SALES DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const BUNDLE_STATUS_META: Record<MatchBundle['status'], { color: string; dark: string; label: string }> = {
  New:          { color: 'bg-blue-100 text-blue-700 border-blue-200',           dark: 'dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',       label: 'New' },
  Pitched:      { color: 'bg-amber-100 text-amber-700 border-amber-200',        dark: 'dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',     label: 'Pitched' },
  Interviewing: { color: 'bg-orange-100 text-orange-700 border-orange-200',     dark: 'dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800',  label: 'Interviewing' },
  Closed:       { color: 'bg-emerald-100 text-emerald-700 border-emerald-200',  dark: 'dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800', label: 'Closed ✓' },
  Cancelled:    { color: 'bg-slate-100 text-slate-500 border-slate-200',        dark: 'dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',     label: 'Cancelled' },
};

const NEXT_STATUS: Partial<Record<MatchBundle['status'], MatchBundle['status']>> = {
  New: 'Pitched',
  Pitched: 'Interviewing',
  Interviewing: 'Closed',
};

const SalesDashboard: React.FC<{
  matchBundles: MatchBundle[];
  staffList: StaffMember[];
  updateBundleStatus: (id: string, status: MatchBundle['status']) => void;
  jobs: Job[];
}> = ({ matchBundles, staffList, updateBundleStatus, jobs }) => {
  const [activeFilter, setActiveFilter] = useState<MatchBundle['status'] | 'All'>('All');

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: matchBundles.length };
    matchBundles.forEach(b => { c[b.status] = (c[b.status] || 0) + 1; });
    return c;
  }, [matchBundles]);

  const filtered = useMemo(() =>
    activeFilter === 'All' ? matchBundles : matchBundles.filter(b => b.status === activeFilter),
    [matchBundles, activeFilter]
  );

  const ghosted = matchBundles.filter(b => {
    if (b.status !== 'Interviewing') return false;
    return Date.now() - new Date(b.dateCreated).getTime() > 24 * 60 * 60 * 1000;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase">Sales Pipeline</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 uppercase tracking-widest font-black">Match bundles · Placement pipeline · Ghosting alerts</p>
        </div>
        <div className="flex items-center gap-3">
          {ghosted.length > 0 && (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest"
            >
              <AlertCircle size={14} className="animate-pulse" />
              {ghosted.length} Ghosting Alert{ghosted.length > 1 ? 's' : ''}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(['All', 'New', 'Pitched', 'Interviewing', 'Closed'] as const).map((s, i) => {
          const meta = s !== 'All' ? BUNDLE_STATUS_META[s] : null;
          return (
            <motion.button key={s} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(s)}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                activeFilter === s
                  ? 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white shadow-xl'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{s}</p>
              <p className="text-3xl font-black">{counts[s] || 0}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Bundle cards */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-16 text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest text-sm"
            >
              No bundles in "{activeFilter}" stage
            </motion.div>
          )}
          {filtered.map((bundle, idx) => {
            const candidates = bundle.candidateIds.map(id => staffList.find(s => s.id === id)).filter(Boolean) as StaffMember[];
            const meta = BUNDLE_STATUS_META[bundle.status];
            const isGhosted = bundle.status === 'Interviewing' && Date.now() - new Date(bundle.dateCreated).getTime() > 24 * 60 * 60 * 1000;
            const nextStatus = NEXT_STATUS[bundle.status];
            return (
              <motion.div key={bundle.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.04 }}
                whileHover={{ scale: 1.005 }}
                className={`bg-white dark:bg-slate-900 rounded-3xl border-2 shadow-sm overflow-hidden transition-all ${
                  isGhosted ? 'border-rose-400 dark:border-rose-700' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {isGhosted && (
                  <div className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 flex items-center gap-2">
                    <AlertCircle size={12} className="animate-pulse" /> Ghosting Alert — No response for 24h+ · Follow up immediately
                  </div>
                )}
                <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-black text-slate-900 dark:text-slate-100 text-lg uppercase tracking-tight">{bundle.role}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${meta.color} ${meta.dark}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Building2 size={11}/>{bundle.businessName}</span>
                      <span className="flex items-center gap-1"><DollarSign size={11}/>₹{bundle.salary.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Calendar size={11}/>{bundle.dateCreated}</span>
                    </div>
                    {/* Candidates micro-list */}
                    {candidates.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {candidates.map(c => (
                          <div key={c.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${
                            c.isVerified
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}>
                            {c.isVerified && <BadgeCheck size={11}/>}{c.name} · {c.skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {nextStatus && (
                      <motion.button whileTap={{ scale: 0.95 }}
                        onClick={() => updateBundleStatus(bundle.id, nextStatus)}
                        className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-indigo-700 transition flex items-center gap-2"
                      >
                        <ArrowRight size={14}/> Move to {nextStatus}
                      </motion.button>
                    )}
                    {bundle.status !== 'Cancelled' && bundle.status !== 'Closed' && (
                      <motion.button whileTap={{ scale: 0.95 }}
                        onClick={() => updateBundleStatus(bundle.id, 'Cancelled')}
                        className="border border-rose-200 dark:border-rose-800 text-rose-500 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                      >
                        <XCircle size={14}/>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FINANCE DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const CHART_COLORS: Record<Transaction['type'], string> = {
  Commission: '#6366f1', Fee: '#f59e0b', Refund: '#ef4444', Payout: '#10b981'
};

const FinanceDashboard: React.FC<{
  staffList: StaffMember[];
  transactions: Transaction[];
  matchBundles: MatchBundle[];
}> = ({ staffList, transactions, matchBundles }) => {
  const totalRevenue    = transactions.filter(t => t.status === 'Success' && t.type !== 'Payout' && t.type !== 'Refund').reduce((s, t) => s + t.amount, 0);
  const pendingPayouts  = transactions.filter(t => t.status === 'Pending').reduce((s, t) => s + t.amount, 0);
  const closedBundles   = matchBundles.filter(b => b.status === 'Closed').length;
  const totalCommission = transactions.filter(t => t.type === 'Commission' && t.status === 'Success').reduce((s, t) => s + t.amount, 0);

  const chartData = useMemo(() => {
    const byDate: Record<string, number> = {};
    transactions.filter(t => t.status === 'Success').forEach(t => {
      byDate[t.date] = (byDate[t.date] || 0) + (t.type === 'Payout' || t.type === 'Refund' ? -t.amount : t.amount);
    });
    return Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, amount]) => ({ date, amount }));
  }, [transactions]);

  const kpis = [
    { label: 'Total Revenue',     value: `₹${totalRevenue.toLocaleString()}`,     icon: TrendingUp,  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950' },
    { label: 'Net Commission',    value: `₹${totalCommission.toLocaleString()}`,   icon: Receipt,     color: 'text-indigo-600 dark:text-indigo-400',   bg: 'bg-indigo-50 dark:bg-indigo-950' },
    { label: 'Pending Payouts',   value: `₹${pendingPayouts.toLocaleString()}`,    icon: Clock,       color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-950' },
    { label: 'Active Placements', value: String(closedBundles),                    icon: Handshake,   color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-950' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase">Finance Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 uppercase tracking-widest font-black">Revenue · Commissions · Payouts · P&amp;L</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4"
          >
            <div className={`p-3 rounded-2xl ${kpi.bg} flex-shrink-0`}>
              <kpi.icon size={20} className={kpi.color} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8"
      >
        <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter text-xl mb-6 flex items-center gap-2">
          <BarChart2 size={22} className="text-indigo-500"/> Net Cash Flow
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8', textTransform: 'uppercase' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Amount']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', fontWeight: 700, fontSize: 12 }}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? '#6366f1' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Transaction Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
          <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter flex items-center gap-2">
            <Landmark size={18} className="text-indigo-500"/> Transaction Ledger
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold min-w-[700px]">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-5">TXN ID</th>
                <th className="p-5">Type</th>
                <th className="p-5">Description</th>
                <th className="p-5">Date</th>
                <th className="p-5 text-right">Amount</th>
                <th className="p-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((txn, i) => (
                <motion.tr key={txn.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <td className="p-5 text-slate-400 dark:text-slate-500 font-black tracking-widest">{txn.id}</td>
                  <td className="p-5">
                    <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                      style={{ color: CHART_COLORS[txn.type], borderColor: CHART_COLORS[txn.type] + '44', backgroundColor: CHART_COLORS[txn.type] + '11' }}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="p-5 text-slate-700 dark:text-slate-300">{txn.description}</td>
                  <td className="p-5 text-slate-400 dark:text-slate-500 tracking-widest">{txn.date}</td>
                  <td className={`p-5 text-right font-black text-base ${txn.type === 'Payout' || txn.type === 'Refund' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {txn.type === 'Payout' || txn.type === 'Refund' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      txn.status === 'Success'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Summary footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{transactions.length} transactions</span>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Balance</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{(totalRevenue - pendingPayouts).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Staff commission summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
          <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter flex items-center gap-2">
            <Users size={18} className="text-indigo-500"/> Staff Commission Tracker
          </h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {staffList.filter(s => s.serviceCommissionTotal > 0).map((s, i) => (
            <motion.div key={s.id} whileHover={{ backgroundColor: 'rgba(248,250,252,0.5)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
              className="p-5 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-black text-indigo-700 dark:text-indigo-400">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-slate-800 dark:text-slate-100 text-sm uppercase tracking-tight">{s.name}</p>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.skill} · Contract: {s.contractMonths}m</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Service Commission</p>
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{s.serviceCommissionTotal.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
