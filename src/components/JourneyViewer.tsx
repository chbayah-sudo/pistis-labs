'use client';

import { useState, useEffect } from 'react';
import { Journey } from '@/types';
import JourneyMap from './JourneyMap';
import StoryPanel from './StoryPanel';
import AudioPlayer from './AudioPlayer';

interface JourneyViewerProps {
  journey: Journey;
  onBack: () => void;
}

export default function JourneyViewer({ journey, onBack }: JourneyViewerProps) {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [musicUrl, setMusicUrl] = useState<string | undefined>(journey.musicUrl);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(!journey.musicUrl);

  useEffect(() => {
    if (!musicUrl && isGeneratingMusic) {
      generateMusic();
    }
  }, []);

  const generateMusic = async () => {
    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: journey.product,
          narrative: journey.narrative,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.musicUrl) {
          setMusicUrl(data.musicUrl);
        }
      }
    } catch (error) {
      console.error('Failed to generate music:', error);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const currentStop = journey.stops?.[currentStopIndex];

  // Safety check: if no stops or invalid data, show error
  if (!journey.stops || journey.stops.length === 0 || !currentStop) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4 text-lg">Unable to load journey data</p>
          <p className="text-gray-500 mb-6 text-sm">The AI response may have been malformed. Please try again.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation header */}
      <div className="sticky top-0 z-40 border-b border-gray-900 backdrop-blur-sm bg-black/50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs font-light tracking-widest text-gray-500 hover:text-white transition-colors uppercase"
          >
            ← BACK
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-600 font-light tracking-widest">STOP {currentStopIndex + 1} OF {journey.stops.length}</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero section */}
        <div className="grid grid-cols-3 gap-16 mb-20">
          <div className="col-span-2">
            <div className="mb-8">
              <h1 className="text-6xl font-light leading-tight mb-4">
                The Story of{' '}
                <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
                  {journey.product}
                </span>
              </h1>
              <p className="text-lg text-gray-400 font-light leading-relaxed max-w-2xl">
                {journey.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 py-8 border-t border-gray-900 border-b">
              <div>
                <p className="text-xs text-gray-600 font-light tracking-widest mb-2">CHAPTERS</p>
                <p className="text-2xl font-light">{journey.stops.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-light tracking-widest mb-2">TYPE</p>
                <p className="text-2xl font-light capitalize">{journey.productCategory}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-light tracking-widest mb-2">SUBJECTS</p>
                <p className="text-2xl font-light">{journey.stops.filter(s => s.personName).length}</p>
              </div>
            </div>
          </div>

          {/* Product image */}
          <div className="overflow-hidden rounded-lg">
            {journey.imageUrl ? (
              <img
                src={journey.imageUrl}
                alt={journey.product}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&h=800&fit=crop&q=80';
                }}
              />
            ) : (
              <div className="w-full h-96 bg-gray-800 flex items-center justify-center text-gray-500">
                Loading image...
              </div>
            )}
          </div>
        </div>

        {/* Audio player */}
        <div className="mb-20">
          <AudioPlayer 
            musicUrl={musicUrl} 
            productName={journey.product}
            isGenerating={isGeneratingMusic}
          />
        </div>

        {/* Main journey section */}
        <div className="grid grid-cols-3 gap-12 mb-20">
          {/* Map */}
          <div className="col-span-2">
            <JourneyMap journey={journey} currentStopIndex={currentStopIndex} />
          </div>

          {/* Story panel */}
          <div className="overflow-y-auto max-h-[600px] pr-4">
            <StoryPanel
              stop={currentStop}
              currentIndex={currentStopIndex}
              totalStops={journey.stops.length}
              onNext={() => setCurrentStopIndex(Math.min(currentStopIndex + 1, journey.stops.length - 1))}
              onPrev={() => setCurrentStopIndex(Math.max(currentStopIndex - 1, 0))}
            />
          </div>
        </div>

        {/* Timeline - editorial style */}
        <div className="py-20 border-t border-gray-900">
          <h2 className="text-4xl font-light mb-12">The Chapters</h2>
          <div className="space-y-6">
            {journey.stops.map((stop, index) => (
              <button
                key={stop.id}
                onClick={() => setCurrentStopIndex(index)}
                className={`w-full text-left group transition-all duration-300 ${
                  index === currentStopIndex ? 'border-l-2 border-white pl-6' : 'border-l-2 border-gray-900 pl-6 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-light tracking-widest mb-1">CHAPTER {index + 1}</p>
                    <h3 className={`text-xl font-light transition-colors ${index === currentStopIndex ? 'text-white' : 'text-gray-600 group-hover:text-white'}`}>
                      {stop.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-light mt-2">
                      {stop.location?.name}
                    </p>
                  </div>
                  {stop.personName && (
                    <div className="text-right">
                      <p className="text-xs text-gray-600 font-light tracking-widest mb-1">KEY FIGURE</p>
                      <p className="text-sm font-light">{stop.personName}</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Closing statement */}
        <div className="py-20 border-t border-gray-900 text-center">
          <p className="text-xl font-light text-gray-400 max-w-2xl mx-auto leading-relaxed">
            "{journey.narrative}"
          </p>
          <p className="text-xs text-gray-600 font-light tracking-widest mt-12 uppercase">
            Every story deserves to be discovered
          </p>
        </div>
      </div>
    </div>
  );
}
