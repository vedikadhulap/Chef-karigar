import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  count = 1
}) => {
  const baseClasses = 'bg-slate-200 dark:bg-slate-800 animate-pulse';
  
  const variantClasses = {
    text: 'rounded-lg h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl'
  };

  const skeletonStyle = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '4rem')
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={skeletonStyle}
    />
  ));

  return count > 1 ? <div className="space-y-3">{skeletons}</div> : skeletons[0];
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" width="80%" height="12px" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <motion.div
          key={`row-${rowIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rowIndex * 0.05 }}
          className="grid gap-4 py-4 border-b border-slate-100 dark:border-slate-800"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

interface SkeletonCardProps {
  count?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <Skeleton variant="circular" width={56} height={56} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" height="16px" />
              <Skeleton variant="text" width="40%" height="12px" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton variant="rectangular" width={100} height={36} className="rounded-xl" />
            <Skeleton variant="rectangular" width={100} height={36} className="rounded-xl" />
          </div>
        </motion.div>
      ))}
    </>
  );
};
