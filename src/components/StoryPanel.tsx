'use client';

import { JourneyStop } from '@/types';

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
    <div className="flex flex-col h-full">
      {/* Stop header */}
      <div className="mb-8">
        <p className="text-xs text-gray-600 font-light tracking-widest mb-3">
          LOCATION {currentIndex + 1}
        </p>
        <h2 className="text-4xl font-light mb-2">{stop.title}</h2>
        {stop.location && (
          <p className="text-sm text-gray-400 font-light">{stop.location.name}</p>
        )}
      </div>

      {/* Stop image */}
      {stop.imageUrl && (
        <div className="mb-8 -mx-6 px-6 overflow-hidden rounded-lg">
          <img
            src={stop.imageUrl}
            alt={stop.title}
            className="w-full h-48 object-cover grayscale opacity-80 hover:opacity-100 transition-opacity duration-300"
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-900 mb-8"></div>

      {/* Person storytelling */}
      {stop.personName && (
        <div className="mb-10">
          <p className="text-xs text-gray-600 font-light tracking-widest mb-3">FEATURED</p>
          <h3 className="text-xl font-light mb-3">{stop.personName}</h3>
          {stop.personQuote && (
            <p className="text-sm font-light text-gray-300 italic leading-relaxed">
              "{stop.personQuote}"
            </p>
          )}
        </div>
      )}

      {/* Story content */}
      <div className="flex-1 mb-10">
        <p className="text-sm font-light text-gray-400 leading-relaxed">
          {stop.story}
        </p>
      </div>

      {/* Economic impact */}
      {stop.economicImpact && (
        <div className="mb-10 py-6 border-t border-b border-gray-900">
          <p className="text-xs text-gray-600 font-light tracking-widest mb-3">IMPACT</p>
          <p className="text-sm font-light leading-relaxed">{stop.economicImpact}</p>
        </div>
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
    </div>
  );
}
