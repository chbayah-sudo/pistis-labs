'use client';

import { useMemo } from 'react';
import { Journey } from '@/types';

interface JourneyMapProps {
  journey: Journey;
  currentStopIndex: number;
}

export default function JourneyMap({ journey, currentStopIndex }: JourneyMapProps) {
  // Create a simple SVG-based map visualization
  const stops = journey.stops;
  const minLat = Math.min(...stops.map((s) => s.location?.lat || 0));
  const maxLat = Math.max(...stops.map((s) => s.location?.lat || 0));
  const minLng = Math.min(...stops.map((s) => s.location?.lng || 0));
  const maxLng = Math.max(...stops.map((s) => s.location?.lng || 0));

  const padding = 40;
  const width = 600;
  const height = 400;

  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;

  const scaleX = (lng: number) => padding + ((lng - minLng) / lngRange) * (width - 2 * padding);
  const scaleY = (lat: number) => height - padding - ((lat - minLat) / latRange) * (height - 2 * padding);

  return (
    <div className="flex flex-col gap-6">
      {/* SVG Map */}
      <svg
        width="100%"
        height="400"
        viewBox={`0 0 ${width} ${height}`}
        className="border border-gray-900 bg-gray-950/50"
      >
        {/* Path connecting stops */}
        <path
          d={`M ${stops.map((stop, i) => {
            const x = scaleX(stop.location?.lng || 0);
            const y = scaleY(stop.location?.lat || 0);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}`}
          stroke="#666666"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Stops */}
        {stops.map((stop, i) => {
          const x = scaleX(stop.location?.lng || 0);
          const y = scaleY(stop.location?.lat || 0);
          const isCurrent = i === currentStopIndex;

          return (
            <g key={stop.id}>
              {/* Pulses for current stop */}
              {isCurrent && (
                <>
                  <circle
                    cx={x}
                    cy={y}
                    r="20"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                    opacity="0.4"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    opacity="0.2"
                  />
                </>
              )}

              {/* Main circle */}
              <circle
                cx={x}
                cy={y}
                r="5"
                fill={isCurrent ? '#ffffff' : i < currentStopIndex ? '#999999' : '#444444'}
              />

              {/* Stop number label */}
              <text
                x={x}
                y={y + 20}
                textAnchor="middle"
                fill="#888888"
                fontSize="9"
                fontFamily="system-ui"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Stop timeline below map */}
      <div className="space-y-2">
        {stops.map((stop, index) => (
          <div
            key={stop.id}
            className={`p-3 text-left transition-all border-l-2 pl-4 ${
              index === currentStopIndex
                ? 'border-l-white bg-gray-900/40'
                : 'border-l-gray-900'
            }`}
          >
            <div className="text-xs text-gray-600 font-light tracking-widest">
              STEP {index + 1}
            </div>
            <div className="font-light text-sm text-white">{stop.title}</div>
            {stop.location && (
              <div className="text-xs text-gray-500 font-light mt-1">
                {stop.location.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
