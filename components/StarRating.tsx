import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  label?: string;
  showValue?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 20,
  label,
  showValue = true,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayValue = hovered !== null ? hovered : value;

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">
          {label}
        </span>
      )}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <motion.button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(null)}
            whileTap={!readOnly ? { scale: 1.3 } : {}}
            className={`focus:outline-none transition-transform ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={star <= displayValue ? '#f59e0b' : 'none'}
              stroke={star <= displayValue ? '#f59e0b' : '#d1d5db'}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </motion.button>
        ))}
      </div>
      {showValue && value > 0 && (
        <span className="text-xs font-black text-amber-600 ml-1">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

interface StarRatingWidgetProps {
  staffName: string;
  currentRating?: number;
  onSubmit: (rating: number, feedback: string) => void;
}

const FEEDBACK_OPTIONS: Record<number, string[]> = {
  1: ['Very Poor Performance', 'Unprofessional', 'Frequent Absence'],
  2: ['Below Average', 'Needs Improvement', 'Late Often'],
  3: ['Satisfactory', 'Average Work', 'Punctual'],
  4: ['Good Performance', 'Reliable', 'Team Player'],
  5: ['Excellent', 'Highly Recommended', 'Outstanding'],
};

export const StarRatingWidget: React.FC<StarRatingWidgetProps> = ({
  staffName,
  currentRating = 0,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(currentRating);
  const [selectedFeedback, setSelectedFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, selectedFeedback);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-2xl p-4 flex items-center gap-3"
      >
        <span className="text-2xl">⭐</span>
        <div>
          <p className="font-black text-amber-900 dark:text-amber-300 text-sm uppercase tracking-tight">
            Rating Submitted!
          </p>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">
            {rating}/5 for {staffName}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-amber-100 dark:border-amber-900 p-5 space-y-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
          Rate {staffName}
        </p>
        <StarRating value={rating} onChange={setRating} size={22} showValue={false} />
      </div>

      {rating > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2 overflow-hidden"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Quick Feedback
          </p>
          <div className="flex flex-wrap gap-2">
            {(FEEDBACK_OPTIONS[rating] || []).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedFeedback(selectedFeedback === option ? '' : option)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition ${
                  selectedFeedback === option
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-amber-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={rating === 0}
        whileTap={{ scale: 0.96 }}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white disabled:text-slate-400 font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition shadow-sm disabled:shadow-none"
      >
        Submit Rating
      </motion.button>
    </motion.div>
  );
};
