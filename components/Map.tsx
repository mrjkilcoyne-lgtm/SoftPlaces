'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SoftPlace } from '@/lib/types';

export default function Map({
  places,
  activePlaceId,
  onPlaceSelect,
}: {
  places: SoftPlace[];
  activePlaceId: string | null;
  onPlaceSelect: (id: string) => void;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([20, 0], 3);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clear old markers not in places
    const currentIds = places.map((p) => p.id);
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentIds.includes(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    places.forEach((place) => {
      if (!markersRef.current[place.id]) {
        const isRift = place.type === 'rift';
        const colorClass = isRift ? 'bg-indigo-500' : place.type === 'portal' ? 'bg-emerald-400' : place.type === 'vortex' ? 'bg-amber-500' : 'bg-rose-500';
        const shadowClass = isRift ? 'shadow-[0_0_15px_3px_rgba(99,102,241,0.8)]' : place.type === 'portal' ? 'shadow-[0_0_15px_3px_rgba(52,211,153,0.8)]' : place.type === 'vortex' ? 'shadow-[0_0_15px_3px_rgba(245,158,11,0.8)]' : 'shadow-[0_0_15px_3px_rgba(244,63,94,0.8)]';
        
        const iconHtml = `
          <div class="relative flex items-center justify-center w-8 h-8">
            <div class="absolute inset-0 rounded-full ${colorClass} opacity-20 animate-ping" style="animation-duration: ${3 - (place.energyLevel / 50)}s"></div>
            <div class="relative w-3 h-3 rounded-full ${colorClass} ${shadowClass} border border-white/50"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'bg-transparent',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([place.lat, place.lng], { icon })
          .addTo(map)
          .on('click', () => onPlaceSelect(place.id));

        markersRef.current[place.id] = marker;
      }
    });
  }, [places, onPlaceSelect]);

  // Handle active place change
  useEffect(() => {
    if (!mapRef.current || !activePlaceId) return;
    const place = places.find((p) => p.id === activePlaceId);
    if (place) {
      mapRef.current.flyTo([place.lat, place.lng], 10, {
        duration: 2.5,
        easeLinearity: 0.25,
      });
    }
  }, [activePlaceId, places]);

  return <div ref={containerRef} className="w-full h-full bg-slate-950" />;
}
