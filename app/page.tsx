'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import { SoftPlace } from '@/lib/types';
import { GoogleGenAI, Type } from '@google/genai';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

const INITIAL_PLACES: SoftPlace[] = [
  {
    id: '1',
    name: 'Cardiff Rift',
    description: 'A spatial-temporal rift running through Cardiff. Highly active, frequently deposits flotsam and jetsam from across time and space.',
    lat: 51.4644,
    lng: -3.1636,
    type: 'rift',
    energyLevel: 95,
    discoveredAt: '1869-12-24'
  },
  {
    id: '2',
    name: 'Stonehenge Anomaly',
    description: 'Ancient transmission array masquerading as a stone circle. The Pandorica was once hidden beneath it.',
    lat: 51.1789,
    lng: -1.8262,
    type: 'anomaly',
    energyLevel: 72,
    discoveredAt: '102 AD'
  },
  {
    id: '3',
    name: 'Sedona Vortex',
    description: 'A concentration of spiritual and temporal energy. Often used by Time Lords for quiet contemplation and minor TARDIS refueling.',
    lat: 34.8697,
    lng: -111.7610,
    type: 'vortex',
    energyLevel: 64,
    discoveredAt: 'Unknown'
  },
  {
    id: '4',
    name: 'Bermuda Triangle Gateway',
    description: 'A malfunctioning transmat beam from a crashed Silurian ship. Causes localized magnetic anomalies and temporal shifts.',
    lat: 25.0000,
    lng: -71.0000,
    type: 'portal',
    energyLevel: 88,
    discoveredAt: '1492-10-11'
  }
];

export default function Home() {
  const [places, setPlaces] = useState<SoftPlace[]>(INITIAL_PLACES);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasLocatedUser, setHasLocatedUser] = useState(false);

  useEffect(() => {
    if (hasLocatedUser) return;
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setHasLocatedUser(true);
          const { latitude, longitude } = position.coords;
          
          try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
            
            const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: `Generate a new, fictional or mythological "soft place" on Earth where time and space are thin, located near these coordinates: ${latitude}, ${longitude}. It should fit the vibe of Doctor Who, mythology, or sci-fi anomalies. Make it creative and atmospheric.`,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: 'Name of the anomaly' },
                    description: { type: Type.STRING, description: 'A 2-3 sentence atmospheric description' },
                    lat: { type: Type.NUMBER, description: 'Latitude close to the provided coordinates' },
                    lng: { type: Type.NUMBER, description: 'Longitude close to the provided coordinates' },
                    type: { type: Type.STRING, description: 'Must be one of: rift, portal, vortex, anomaly' },
                    energyLevel: { type: Type.NUMBER, description: 'Energy level from 1 to 100' },
                    discoveredAt: { type: Type.STRING, description: 'Date or era of discovery' }
                  },
                  required: ['name', 'description', 'lat', 'lng', 'type', 'energyLevel', 'discoveredAt']
                }
              }
            });

            if (!response.text) return;

            const newPlaceData = JSON.parse(response.text);
            
            const newPlace: SoftPlace = {
              id: 'user-local-' + Math.random().toString(36).substring(7),
              ...newPlaceData,
              type: ['rift', 'portal', 'vortex', 'anomaly'].includes(newPlaceData.type) ? newPlaceData.type : 'anomaly'
            };

            setPlaces(prev => [newPlace, ...prev]);
            setActivePlaceId(newPlace.id);
          } catch (error) {
            console.error('Failed to generate local anomaly:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setHasLocatedUser(true); // Prevent infinite retries
        }
      );
    } else {
      setHasLocatedUser(true);
    }
  }, [hasLocatedUser]);

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: 'Generate a new, fictional or mythological "soft place" on Earth where time and space are thin. It should fit the vibe of Doctor Who, mythology, or sci-fi anomalies. Provide realistic coordinates (lat/lng) somewhere on Earth. Make it creative and atmospheric.',
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Name of the anomaly' },
              description: { type: Type.STRING, description: 'A 2-3 sentence atmospheric description' },
              lat: { type: Type.NUMBER, description: 'Latitude (-90 to 90)' },
              lng: { type: Type.NUMBER, description: 'Longitude (-180 to 180)' },
              type: { type: Type.STRING, description: 'Must be one of: rift, portal, vortex, anomaly' },
              energyLevel: { type: Type.NUMBER, description: 'Energy level from 1 to 100' },
              discoveredAt: { type: Type.STRING, description: 'Date or era of discovery' }
            },
            required: ['name', 'description', 'lat', 'lng', 'type', 'energyLevel', 'discoveredAt']
          }
        }
      });

      if (!response.text) throw new Error("No response text");

      const newPlaceData = JSON.parse(response.text);
      
      const newPlace: SoftPlace = {
        id: Math.random().toString(36).substring(7),
        ...newPlaceData,
        // Ensure type is valid
        type: ['rift', 'portal', 'vortex', 'anomaly'].includes(newPlaceData.type) ? newPlaceData.type : 'anomaly'
      };

      setPlaces(prev => [newPlace, ...prev]);
      setActivePlaceId(newPlace.id);
    } catch (error) {
      console.error('Failed to scan for anomalies:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row h-screen w-full bg-slate-950 overflow-hidden">
      <Sidebar
        places={places}
        activePlaceId={activePlaceId}
        onPlaceSelect={setActivePlaceId}
        onScan={handleScan}
        isScanning={isScanning}
      />
      <div className="flex-1 relative h-full">
        <Map
          places={places}
          activePlaceId={activePlaceId}
          onPlaceSelect={setActivePlaceId}
        />
        
        {/* Overlay gradient for atmospheric effect */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)] z-[400]" />
      </div>
    </main>
  );
}
