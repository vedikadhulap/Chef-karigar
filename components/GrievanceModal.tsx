import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Send, CheckCircle, FileText, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export type DisputeType = 'Payment Delay' | 'Misconduct' | 'Contract Breach' | 'Wrong Placement' | 'Harassment' | 'Other';

interface GrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  reporterName: string;
  reporterRole: 'business' | 'staff';
  contextLabel?: string; // e.g. staff name or business name
}

const DISPUTE_TYPES: DisputeType[] = [
  'Payment Delay',
  'Misconduct',
  'Contract Breach',
  'Wrong Placement',
  'Harassment',
  'Other',
];

const DISPUTE_ICONS: Record<DisputeType, string> = {
  'Payment Delay': '💰',
  'Misconduct': '⚠️',
  'Contract Breach': '📄',
  'Wrong Placement': '🔀',
  'Harassment': '🛑',
  'Other': '📋',
};

export const GrievanceModal: React.FC<GrievanceModalProps> = ({
  isOpen,
  onClose,
  reporterName,
  reporterRole,
  contextLabel,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [selectedType, setSelectedType] = useState<DisputeType | null>(null);
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setStep('form');
    setSelectedType(null);
    setDescription('');
    setUrgency('Medium');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      toast.error('Please select a dispute type.', { icon: '⚠️' });
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSubmitting(false);
    setStep('success');
    toast.success('Dispute report submitted to Agency HR.', { icon: '🛡️', duration: 4000 });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800"
            initial={{ scale: 0.88, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-rose-600 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase tracking-tight">Report a Dispute</h3>
                  <p className="text-rose-200 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                    Handled confidentially by Agency HR
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="hover:bg-white/20 p-2 rounded-xl transition"
              >
                <X size={20} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {step === 'form' ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="p-8 space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Context info */}
                  <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 rounded-2xl p-4 flex items-center gap-3">
                    <AlertTriangle size={18} className="text-rose-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-rose-800 dark:text-rose-300 uppercase tracking-widest">
                        Reporter: {reporterName}
                      </p>
                      {contextLabel && (
                        <p className="text-[10px] text-rose-500 font-bold mt-0.5 uppercase">
                          Regarding: {contextLabel}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dispute Type */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Dispute Type *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {DISPUTE_TYPES.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedType(type)}
                          className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center gap-1.5 ${
                            selectedType === type
                              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                              : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-base">{DISPUTE_ICONS[type]}</span>
                          <span className="text-[9px] font-black uppercase tracking-tight leading-tight">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Urgency */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Urgency Level
                    </label>
                    <div className="flex gap-3">
                      {(['Low', 'Medium', 'High'] as const).map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setUrgency(level)}
                          className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-black uppercase tracking-widest transition ${
                            urgency === level
                              ? level === 'High'
                                ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                : level === 'Medium'
                                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                : 'border-slate-400 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                              : 'border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          {level === 'High' ? '🔴' : level === 'Medium' ? '🟡' : '🟢'} {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe the issue clearly. Include dates, names, and specific incidents."
                      className="w-full border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 outline-none focus:border-rose-400 transition resize-none placeholder:text-slate-300"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Evidence note */}
                  <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                    <FileText size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                      Evidence upload (photos, audio) — available in the Agency HR portal after submission.
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-rose-600 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-sm hover:bg-rose-700 transition shadow-xl shadow-rose-100 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock size={18} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Submit Dispute to HR
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className="p-12 text-center space-y-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
                  >
                    <CheckCircle size={40} className="text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">
                      Dispute Filed!
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-2 leading-relaxed">
                      Your report has been sent to Agency HR. A ticket ID has been generated and you will be contacted within 24 hours.
                    </p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900">
                    <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                      Ticket: GRV-{Math.floor(Math.random() * 90000) + 10000} • {selectedType}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full bg-slate-900 dark:bg-slate-700 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-sm hover:bg-slate-800 transition"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
