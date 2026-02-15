'use client';

import { JourneyStop } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryPanelProps {
  stop: JourneyStop;
  currentIndex: number;
  totalStops: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function StoryPanel({
  stop,
  currentIndex,
  totalStops,
  onNext,
  onPrev,
}: StoryPanelProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stop.id}
        className="flex flex-col h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
      {/* Stop header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs text-gray-600 font-light tracking-widest mb-3">
          LOCATION {currentIndex + 1}
        </p>
        <h2 className="text-4xl font-light mb-2">{stop.title}</h2>
        {stop.location && (
          <p className="text-sm text-gray-400 font-light">{stop.location.name}</p>
        )}
      </motion.div>

      {/* Stop image */}
      {stop.imageUrl && (
        <motion.div
          className="mb-8 -mx-6 px-6 overflow-hidden rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <img
            src={stop.imageUrl}
            alt={stop.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </motion.div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-900 mb-8"></div>

      {/* Person storytelling */}
      {stop.personName && (
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs text-gray-600 font-light tracking-widest mb-3">FEATURED</p>
          <h3 className="text-xl font-light mb-3">{stop.personName}</h3>
          {stop.personQuote && (
            <p className="text-sm font-light text-gray-300 italic leading-relaxed">
              "{stop.personQuote}"
            </p>
          )}
        </motion.div>
      )}

      {/* Story content */}
      <motion.div
        className="flex-1 mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="text-sm font-light text-gray-400 leading-relaxed">
          {stop.story}
        </p>
      </motion.div>

      {/* Economic impact */}
      {stop.economicImpact && (
        <motion.div
          className="mb-10 py-6 border-t border-b border-gray-900"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-xs text-gray-600 font-light tracking-widest mb-3">IMPACT</p>
          <p className="text-sm font-light leading-relaxed">{stop.economicImpact}</p>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-900">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="text-xs font-light tracking-widest text-gray-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors uppercase"
        >
          ← PREV
        </button>

        <p className="text-xs text-gray-600 font-light">{currentIndex + 1} / {totalStops}</p>

        <button
          onClick={onNext}
          disabled={currentIndex === totalStops - 1}
          className="text-xs font-light tracking-widest text-gray-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors uppercase"
        >
          NEXT →
        </button>
      </div>
    </motion.div>
    </AnimatePresence>
  );
}
