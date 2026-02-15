'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Journey } from '@/types';

interface JourneyMapProps {
  journey: Journey;
  currentStopIndex: number;
}

export default function JourneyMap({ journey, currentStopIndex }: JourneyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const stops = journey.stops;
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStop, setSelectedStop] = useState<(typeof stops)[0] | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // Initialize map only once

    // Get Mapbox token from environment
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      const errorMsg = 'Mapbox token not configured. Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local';
      console.error(errorMsg);
      setMapError(errorMsg);
      return;
    }

    try {
      mapboxgl.accessToken = token;

      // Calculate bounds for all stops
      const validStops = stops.filter(s => s.location?.lat && s.location?.lng);
      if (validStops.length === 0) {
        setMapError('No valid locations in journey data');
        return;
      }

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [validStops[0].location!.lng, validStops[0].location!.lat],
        zoom: 2,
      });

      map.current.on('load', () => {
        if (!map.current) return;
        setMapLoaded(true);

        // Add markers for each stop
        validStops.forEach((stop, index) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = index === currentStopIndex ? '#ffffff' : index < currentStopIndex ? '#999999' : '#444444';
          el.style.border = '2px solid #ffffff';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.fontSize = '12px';
          el.style.fontWeight = 'bold';
          el.style.color = '#000';
          el.style.cursor = 'pointer';
          el.textContent = String(index + 1);
          
          // Add click handler to show image modal
          el.addEventListener('click', () => {
            setSelectedStop(stop);
          });

          new mapboxgl.Marker(el)
            .setLngLat([stop.location!.lng, stop.location!.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<div style="color: #000; padding: 8px;"><strong>${stop.title}</strong><br/>${stop.location!.name}</div>`)
            )
            .addTo(map.current!);
        });

        // Draw line connecting stops
        if (validStops.length > 1) {
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: validStops.map(s => [s.location!.lng, s.location!.lat]),
              },
            },
          });

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#888',
              'line-width': 2,
              'line-opacity': 0.6,
            },
          });
        }

        // Fit map to show all stops
        if (validStops.length > 1) {
          const bounds = new mapboxgl.LngLatBounds();
          validStops.forEach(stop => {
            bounds.extend([stop.location!.lng, stop.location!.lat]);
          });
          map.current.fitBounds(bounds, { padding: 50 });
        }
      });

      map.current.on('error', () => {
        setMapError('Failed to load Mapbox map. Check your token.');
      });
    } catch (error) {
      console.error('Mapbox initialization error:', error);
      setMapError(`Map initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [stops]);


  // Update marker styles when current stop changes
  useEffect(() => {
    if (!map.current) return;

    const markers = document.querySelectorAll('.marker');
    markers.forEach((marker, index) => {
      const el = marker as HTMLElement;
      if (index === currentStopIndex) {
        el.style.backgroundColor = '#ffffff';
      } else if (index < currentStopIndex) {
        el.style.backgroundColor = '#999999';
      } else {
        el.style.backgroundColor = '#444444';
      }
    });
  }, [currentStopIndex]);

  return (
    <div className="flex flex-col gap-6">
      {/* Mapbox Map */}
      {mapError ? (
        <div className="w-full h-[400px] rounded-lg border border-gray-800 bg-gray-950 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-red-400 text-sm mb-2">⚠️ Map Error</p>
            <p className="text-gray-500 text-xs">{mapError}</p>
          </div>
        </div>
      ) : (
        <div
          ref={mapContainer}
          className="w-full h-[400px] rounded-lg border border-gray-800 bg-gray-950"
          style={{ visibility: mapLoaded ? 'visible' : 'hidden' }}
        />
      )}

      {/* Stop timeline below map - only current stop */}
      <div className="space-y-2">
        {stops
          .filter((_, index) => index === currentStopIndex)
          .map((stop, index) => (
            <div
              key={stop.id}
              className="p-3 text-left transition-all border-l-2 border-l-white pl-4 bg-gray-900/40"
            >
              <div className="text-xs text-gray-600 font-light tracking-widest">
                STEP {currentStopIndex + 1}
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

      {/* Image Modal */}
      {selectedStop && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStop(null)}>
          <div className="relative max-w-2xl w-full bg-gray-900 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setSelectedStop(null)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 p-2 rounded-full transition"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            {selectedStop.imageUrl ? (
              <img
                src={selectedStop.imageUrl}
                alt={selectedStop.title}
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}

            {/* Info overlay */}
            <div className="bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedStop.title}</h3>
              {selectedStop.location && (
                <p className="text-gray-300 mb-3">{selectedStop.location.name}</p>
              )}
              {selectedStop.personName && (
                <p className="text-sm text-gray-400 mb-2">
                  <span className="font-semibold text-white">{selectedStop.personName}</span>
                  {selectedStop.personQuote && `: "${selectedStop.personQuote}"`}
                </p>
              )}
              {selectedStop.description && (
                <p className="text-sm text-gray-400 mt-3">{selectedStop.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
