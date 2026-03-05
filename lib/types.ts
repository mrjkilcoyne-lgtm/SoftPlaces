export interface SoftPlace {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  type: 'rift' | 'portal' | 'vortex' | 'anomaly';
  energyLevel: number;
  discoveredAt: string;
}
