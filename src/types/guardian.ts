export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  speed?: number; // km/h
  heading?: number; // degrees
  altitude?: number;
  timestamp: number;
}

export interface TelemetryPoint extends Coordinates {
  ambientNoiseDb: number; // dB (decibels)
  deviceStruggleIndex: number; // 0 to 100 (accelerometer agitation)
  batteryLevel: number; // 0 to 100%
  signalBars: number; // 0 to 4
  heartRateBpm: number; // BPM
  isDeviatedFromSafeRoute: boolean;
  isInDeadZone: boolean;
}

export type ThreatLevel = 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface ThreatVector {
  id: string;
  category: 'ROUTE_DEVIATION' | 'SPEED_ANOMALY' | 'SENSOR_STRUGGLE' | 'GEO_FENCE' | 'AUDIO_DISTRESS' | 'SIGNAL_JAMMING';
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  detectedAt: number;
}

export interface AIThreatAssessment {
  threatLevel: ThreatLevel;
  abductionProbability: number; // 0-100%
  headline: string;
  analysisSummary: string;
  threatVectors: ThreatVector[];
  predictedIntercepts: {
    corridorName: string;
    lat: number;
    lng: number;
    etaMinutes: number;
    riskScore: number;
  }[];
  tacticalDirectives: string[];
  lawEnforcementCadSummary: string;
  recommendedAction: 'MONITOR' | 'NOTIFY_GUARDIANS' | 'TRIGGER_SILENT_DISPATCH' | 'FULL_POLICE_INTERCEPT';
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
  notifyOnDeviation: boolean;
  avatarBg: string;
}

export interface PolicePatrolUnit {
  unitId: string;
  callSign: string;
  officerName: string;
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'STANDBY';
  distanceKm: number;
  etaMinutes: number;
  currentLat: number;
  currentLng: number;
  vehicleType: 'Cruiser' | 'Interceptor' | 'K9 Unit' | 'Air Support';
}

export interface IncidentReport {
  id: string;
  timestamp: number;
  victimName: string;
  status: 'ACTIVE_EMERGENCY' | 'STANDBY' | 'RESOLVED' | 'UNDER_REVIEW';
  threatLevel: ThreatLevel;
  abductionProbability: number;
  lastKnownCoords: Coordinates;
  telemetrySnapshot: TelemetryPoint;
  encryptedHash: string;
  cadEventNumber: string;
  assignedUnits: PolicePatrolUnit[];
  audioDistressRecorded: boolean;
  audioDurationSeconds?: number;
  routeHistory: Coordinates[];
}

export type UserRole = 'PROTECTED_USER' | 'FAMILY_GUARDIAN' | 'POLICE_DISPATCHER';

export type DeviceViewMode = 'RESPONSIVE' | 'IOS_PHONE' | 'ANDROID_PHONE' | 'TACTICAL_DESKTOP';

export interface SafeHaven {
  id: string;
  name: string;
  type: 'POLICE_STATION' | 'HOSPITAL' | 'FIRE_STATION' | 'EMBASSY' | '24_7_STORE';
  lat: number;
  lng: number;
  address: string;
  distanceMeters: number;
  phone: string;
  open24Hours: boolean;
}

export interface OfflineRegion {
  id: string;
  name: string;
  sizeMb: number;
  downloaded: boolean;
  lastUpdated: string;
  tileCount: number;
  safeHavensCount: number;
}
