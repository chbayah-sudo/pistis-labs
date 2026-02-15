'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import JourneyViewer from '@/components/JourneyViewer';
import { Journey } from '@/types';

export default function Home() {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Create an AbortController with a 2-minute timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`Failed to analyze image (${response.status})`);
      }

      const data = await response.json();
      if (!data.product) {
        throw new Error('Invalid response format');
      }
      setJourney(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Analysis took too long. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (journey) {
    return <JourneyViewer journey={journey} onBack={() => setJourney(null)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        {/* Organic shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-3xl animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 rounded-full bg-gradient-to-tl from-emerald-500/10 to-transparent blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/5 to-transparent blur-3xl animate-pulse" style={{animationDuration: '7s'}}></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-6">
        {/* Header section */}
        <div className="w-full max-w-4xl mb-16">
          {/* Subtitle - minimalist */}
          <div className="mb-8">
            <p className="text-xs tracking-widest text-gray-500 uppercase font-light">
            </p>
          </div>

          {/* Main heading - artistic */}
          <div className="space-y-6 mb-12">
            <h1 className="text-7xl md:text-8xl font-light leading-none tracking-tight">
              Everything{' '}
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent font-extralight">
                has
              </span>
              <br />
              a{' '}
              <span className="text-gray-400">story</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl font-light leading-relaxed">
              Upload any image. Discover its untold story. A product's supply chain, a place's history, a species' evolution, a moment's context. Every photograph reveals something profound.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-12"></div>

          {/* Upload area - premium minimalist */}
          <div className="mb-16">
            <ImageUpload onUpload={handleImageUpload} loading={loading} />
          </div>

          {/* Error message */}
          {error && (
            <div className="backdrop-blur-sm bg-red-950/30 border border-red-700/50 rounded-lg p-4 text-red-200 text-sm font-light mb-8">
              {error}
            </div>
          )}

          {/* Features grid - artistic layout */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-900">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-light tracking-wide">UPLOAD</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">Photo of anything: product, place, creature, moment</p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-light tracking-wide">UNDERSTAND</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">AI reveals history, origins, context, significance</p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <h3 className="text-sm font-light tracking-wide">DISCOVER</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">Experience cinematic narrative of the untold story</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - minimal */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20">
        <p className="text-xs text-gray-600 font-light tracking-widest">
          TREEHACKS 2026 • UNIVERSAL STORY DISCOVERY
        </p>
      </div>
    </div>
  );
}
