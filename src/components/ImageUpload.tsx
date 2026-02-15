import { useRef, useState, useEffect } from 'react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  loading: boolean;
}

export default function ImageUpload({ onUpload, loading }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingText, setLoadingText] = useState('REVEALING STORIES');

  useEffect(() => {
    if (!loading) {
      setLoadingText('REVEALING STORIES');
      return;
    }

    const messages = [
      'REVEALING STORIES',
      'TRACING ORIGINS',
      'UNCOVERING HUMANITY',
      'WEAVING NARRATIVES',
      'FINDING CONNECTIONS',
      'MAPPING JOURNEYS'
    ];
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, [loading]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />

      <button
        onClick={handleClick}
        disabled={loading}
        className="group relative px-12 py-5 bg-white text-black rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Content */}
        <div className="relative flex items-center justify-center gap-3 font-light tracking-wide text-sm">
          {loading ? (
            <>
              <img 
                src="/earth.png" 
                alt="Spinning Earth" 
                className="w-6 h-6 animate-spin"
                style={{ animationDuration: '6s' }}
              />
              <span>{loadingText}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>UPLOAD IMAGE</span>
            </>
          )}
        </div>

        {/* Border on hover */}
        <div className="absolute inset-0 border border-black rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </button>

      <div className="absolute left-0 right-0 flex flex-col items-center mt-16">
        <p className="text-xs text-gray-500 font-light text-center tracking-wide">
          {loading ? 'This may take up to 60 seconds...' : 'JPG, PNG, or WEBP • Up to 10MB'}
        </p>
      </div>
    </div>
  );
}
