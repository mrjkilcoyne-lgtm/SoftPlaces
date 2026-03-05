'use client';

import { SoftPlace } from '@/lib/types';
import { motion } from 'motion/react';
import { MapPin, Zap, Clock, Search, Loader2, Compass, Activity } from 'lucide-react';

export default function Sidebar({
  places,
  activePlaceId,
  onPlaceSelect,
  onScan,
  isScanning,
}: {
  places: SoftPlace[];
  activePlaceId: string | null;
  onPlaceSelect: (id: string) => void;
  onScan: () => void;
  isScanning: boolean;
}) {
  return (
    <div className="w-full md:w-96 h-full flex flex-col glass-panel z-10 relative">
      <div className="p-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <Compass className="w-6 h-6 text-sky-400" />
          <h1 className="text-2xl font-display font-semibold tracking-tight text-white">
            The Doctor&apos;s Orders
          </h1>
        </div>
        <p className="text-sm text-slate-400 font-sans">
          Directory of soft places through time and space.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {places.map((place) => {
          const isActive = place.id === activePlaceId;
          return (
            <motion.button
              key={place.id}
              onClick={() => onPlaceSelect(place.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'bg-sky-500/10 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-medium ${isActive ? 'text-sky-300' : 'text-slate-200'}`}>
                  {place.name}
                </h3>
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded-full">
                  {place.type}
                </span>
              </div>
              
              <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                {place.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{place.lat.toFixed(2)}, {place.lng.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span className={place.energyLevel > 80 ? 'text-rose-400' : 'text-emerald-400'}>
                    {place.energyLevel}%
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 shrink-0 bg-slate-900/80">
        <button
          onClick={onScan}
          disabled={isScanning}
          className="w-full relative group overflow-hidden rounded-xl bg-slate-800 border border-slate-700 p-4 transition-all hover:border-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-2">
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                <span className="font-mono text-sm text-sky-400 tracking-widest uppercase">Scanning Matrix...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 text-sky-400" />
                <span className="font-mono text-sm text-slate-300 tracking-widest uppercase group-hover:text-sky-300 transition-colors">
                  Scan for Anomalies
                </span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
