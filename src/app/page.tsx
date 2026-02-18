'use client';

import { useState } from 'react';
import Image from 'next/image';
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
          <div className="space-y-6 mb-12 relative">
            <div className="flex items-start gap-[70px]">
              <h1 className="text-7xl md:text-8xl font-light leading-none tracking-tight">
                Everything{' '}
                <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent font-extralight">
                  has
                </span>
                <br />
                a{' '}
                <span className="text-gray-400">story</span>
              </h1>
              {/* Globe image - next to title */}
              <div className="flex-shrink-0 mt-4 ml-6">
                <Image
                  src="/earth.png"
                  alt="Globe"
                  width={180}
                  height={180}
                  className="grayscale opacity-40"
                  priority
                />
              </div>
            </div>
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

          {/* Features - minimalist */}
          <div className="grid grid-cols-3 gap-6 mt-24 pt-20 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gray-800"></div>

            {/* Upload */}
            <div className="group relative p-8 border border-gray-800 hover:border-gray-700 transition-colors duration-300">
              <div className="space-y-3">
                <h3 className="text-sm tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors">UPLOAD</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">Photo of anything: product, place, creature, moment</p>
              </div>
            </div>

            {/* Understand */}
            <div className="group relative p-8 border border-gray-800 hover:border-gray-700 transition-colors duration-300">
              <div className="space-y-3">
                <h3 className="text-sm tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors">UNDERSTAND</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">AI reveals history, origins, context, significance</p>
              </div>
            </div>

            {/* Discover */}
            <div className="group relative p-8 border border-gray-800 hover:border-gray-700 transition-colors duration-300">
              <div className="space-y-3">
                <h3 className="text-sm tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors">DISCOVER</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">Experience cinematic narrative of the untold story</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
