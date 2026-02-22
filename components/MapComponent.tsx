import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapMarker, getNearbyOpportunities, LocationCoordinates } from '../services/api';

interface MapComponentProps {
  center?: LocationCoordinates;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  center = { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' },
  markers = [],
  onMarkerClick 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [nearbyMarkers, setNearbyMarkers] = useState<MapMarker[]>(markers);

  useEffect(() => {
    // Simulate loading nearby opportunities
    const loadNearby = async () => {
      setIsLoading(true);
      try {
        const nearby = await getNearbyOpportunities(center);
        setNearbyMarkers([...markers, ...nearby]);
      } finally {
        setIsLoading(false);
      }
    };
    loadNearby();
  }, [center]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-xl">
      {/* Simulated Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #94a3b8 1px, transparent 1px),
              linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <Navigation size={20} />
        </motion.button>
      </div>

      {/* Center Marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-4 bg-indigo-500/20 dark:bg-indigo-400/20 rounded-full"
            />
            <div className="relative bg-indigo-600 dark:bg-indigo-500 text-white p-4 rounded-full shadow-2xl">
              <MapPin size={28} fill="currentColor" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Nearby Markers */}
      {!isLoading && nearbyMarkers.map((marker, index) => {
        const angle = (index * 360) / nearbyMarkers.length;
        const radius = 120;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={marker.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="absolute top-1/2 left-1/2 z-10"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
            }}
          >
            <motion.button
              whileHover={{ scale: 1.2, zIndex: 30 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMarkerClick?.(marker)}
              className="relative group"
            >
              {/* Marker */}
              <div className={`
                w-8 h-8 rounded-full shadow-lg flex items-center justify-center
                ${marker.type === 'job' ? 'bg-emerald-500 dark:bg-emerald-600' : 
                  marker.type === 'candidate' ? 'bg-blue-500 dark:bg-blue-600' : 
                  'bg-orange-500 dark:bg-orange-600'}
              `}>
                <MapPin size={16} className="text-white" fill="currentColor" />
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                <div className="bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap shadow-xl border border-slate-700">
                  <p className="font-black uppercase tracking-wide">{marker.title}</p>
                  {marker.description && (
                    <p className="text-slate-300 dark:text-slate-400 text-[10px] mt-0.5">{marker.description}</p>
                  )}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
                </div>
              </div>
            </motion.button>
          </motion.div>
        );
      })}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="text-center">
            <Loader className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-2" size={32} />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Loading Map...</p>
          </div>
        </div>
      )}

      {/* Map Info Label */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 z-10">
        <p className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <MapPin size={14} className="text-indigo-600 dark:text-indigo-400" />
          {center.address}
        </p>
      </div>

      {/* Simulated Map Brand */}
      <div className="absolute bottom-4 right-4 text-xs text-slate-400 dark:text-slate-600 font-bold z-10">
        Interactive Map View
      </div>
    </div>
  );
};
