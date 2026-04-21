export interface Alert {
  id: number;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  location: string;
  message: string;
  timestamp: string;
}

export interface Zone {
  id: number;
  name: string;
  lat: number;
  lng: number;
  risk_level: 'High' | 'Medium' | 'Low';
  last_scan: string;
}

export interface AnalysisResult {
  coords: { lat: number; lng: number };
  metrics: {
    floodRisk: number;
    droughtRisk: number;
    pollutionRisk: number;
    soilMoisture: string;
    waterLevel: string;
    tempAnomaly: string;
  };
  timestamp: string;
  satellite: string;
}
