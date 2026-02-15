'use client';

import { useState, useEffect } from 'react';
import { Music, Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  musicUrl?: string;
  productName: string;
  isGenerating?: boolean;
}

export default function AudioPlayer({ 
  musicUrl,
  productName, 
  isGenerating = false 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRefId = `audio-${productName.replace(/\s+/g, '-')}`;

  useEffect(() => {
    const audio = document.getElementById(audioRefId) as HTMLAudioElement;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    if (isPlaying) {
      audio.play().catch((err) => {
        setError('Could not play audio');
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [isPlaying, audioRefId]);

  if (!musicUrl && !isGenerating) {
    return null;
  }

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="py-6 border-t border-b border-gray-900">
      {isGenerating ? (
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse flex-shrink-0"></div>
          <p className="text-xs text-gray-600 font-light tracking-widest">GENERATING SOUNDTRACK...</p>
        </div>
      ) : musicUrl ? (
        <div className="flex items-center gap-4">
          <audio
            id={audioRefId}
            src={musicUrl}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              setError('Could not load audio');
              setIsPlaying(false);
            }}
          />
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 hover:bg-gray-900/50 transition-colors flex-shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </button>

          <div className="flex-1 flex items-center gap-3">
            <Volume2 className="w-3 h-3 text-gray-600 flex-shrink-0" />
            <div className="flex-1 relative h-px bg-gray-900">
              <div
                className="h-full bg-white transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-gray-600 font-light tracking-widest flex-shrink-0">
            CINEMATIC
          </p>
        </div>
      ) : null}

      {error && (
        <p className="text-xs text-gray-600 font-light mt-2">{error}</p>
      )}
    </div>
  );
}
