import { SafeHaven, OfflineRegion } from '../types/guardian';

export const INITIAL_OFFLINE_REGIONS: OfflineRegion[] = [
  {
    id: 'reg_blr_central',
    name: 'Bengaluru Central & MG Road / Indiranagar Sector',
    sizeMb: 38.6,
    downloaded: true,
    lastUpdated: 'Today, 08:30',
    tileCount: 1650,
    safeHavensCount: 22
  },
  {
    id: 'reg_blr_tech_corridor',
    name: 'Outer Ring Road, Koramangala & Electronic City Grid',
    sizeMb: 52.4,
    downloaded: true,
    lastUpdated: 'Yesterday',
    tileCount: 2480,
    safeHavensCount: 17
  },
  {
    id: 'reg_blr_north_airport',
    name: 'Hebbal, Yelahanka & Kempegowda Airport Expressway',
    sizeMb: 44.1,
    downloaded: false,
    lastUpdated: 'Pending download',
    tileCount: 1980,
    safeHavensCount: 14
  },
  {
    id: 'reg_karnataka_western_ghats',
    name: 'Karnataka Highway Perimeter & Low Cellular Corridors',
    sizeMb: 76.5,
    downloaded: false,
    lastUpdated: 'Pending download',
    tileCount: 3400,
    safeHavensCount: 9
  }
];

export const MOCK_SAFE_HAVENS: SafeHaven[] = [
  // --- BENGALURU POLICE STATIONS (Namma 112) ---
  {
    id: 'sh_blr_police_hq',
    name: 'Bengaluru City Police Commissioner HQ (Namma 112 Command)',
    type: 'POLICE_STATION',
    lat: 12.9818,
    lng: 77.5960,
    address: 'Infantry Road, Shivajinagar, Bengaluru, Karnataka 560001',
    distanceMeters: 480,
    phone: '112 / (080) 2294-2222',
    open24Hours: true
  },
  {
    id: 'sh_cubbon_police',
    name: 'Cubbon Park Police Station & Rapid Action Unit',
    type: 'POLICE_STATION',
    lat: 12.9765,
    lng: 77.5985,
    address: 'Kasturba Road, Opp. Cubbon Park, Bengaluru, Karnataka 560001',
    distanceMeters: 620,
    phone: '112 / (080) 2294-2580',
    open24Hours: true
  },
  {
    id: 'sh_ashok_nagar_police',
    name: 'Ashok Nagar Police Station (Brigade / MG Road)',
    type: 'POLICE_STATION',
    lat: 12.9692,
    lng: 77.6045,
    address: 'Commissariat Road, Ashok Nagar, Bengaluru, Karnataka 560025',
    distanceMeters: 850,
    phone: '112 / (080) 2294-2581',
    open24Hours: true
  },
  {
    id: 'sh_indiranagar_police',
    name: 'Indiranagar Police Station',
    type: 'POLICE_STATION',
    lat: 12.9784,
    lng: 77.6408,
    address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    distanceMeters: 3100,
    phone: '112 / (080) 2294-2586',
    open24Hours: true
  },
  {
    id: 'sh_koramangala_police',
    name: 'Koramangala Police Station',
    type: 'POLICE_STATION',
    lat: 12.9345,
    lng: 77.6202,
    address: '80 Feet Rd, 6th Block, Koramangala, Bengaluru, Karnataka 560095',
    distanceMeters: 4200,
    phone: '112 / (080) 2294-2588',
    open24Hours: true
  },
  {
    id: 'sh_jayanagar_police',
    name: 'Jayanagar Police Station',
    type: 'POLICE_STATION',
    lat: 12.9298,
    lng: 77.5834,
    address: '9th Main Rd, 4th Block, Jayanagar, Bengaluru, Karnataka 560011',
    distanceMeters: 4800,
    phone: '112 / (080) 2294-2582',
    open24Hours: true
  },
  {
    id: 'sh_malleshwaram_police',
    name: 'Malleshwaram Police Station',
    type: 'POLICE_STATION',
    lat: 13.0035,
    lng: 77.5695,
    address: 'Margosa Rd, Malleshwaram, Bengaluru, Karnataka 560003',
    distanceMeters: 4500,
    phone: '112 / (080) 2294-2591',
    open24Hours: true
  },
  {
    id: 'sh_whitefield_police',
    name: 'Whitefield Police Station',
    type: 'POLICE_STATION',
    lat: 12.9698,
    lng: 77.7499,
    address: 'Whitefield Main Rd, Bengaluru, Karnataka 560066',
    distanceMeters: 14200,
    phone: '112 / (080) 2294-2595',
    open24Hours: true
  },
  {
    id: 'sh_electronic_city_police',
    name: 'Electronic City Police Station',
    type: 'POLICE_STATION',
    lat: 12.8452,
    lng: 77.6602,
    address: 'Phase 1, Electronic City, Bengaluru, Karnataka 560100',
    distanceMeters: 15400,
    phone: '112 / (080) 2294-2598',
    open24Hours: true
  },
  {
    id: 'sh_yelahanka_police',
    name: 'Yelahanka Police Station',
    type: 'POLICE_STATION',
    lat: 13.1007,
    lng: 77.5963,
    address: 'BBMP Complex, Yelahanka Old Town, Bengaluru, Karnataka 560064',
    distanceMeters: 14500,
    phone: '112 / (080) 2294-2599',
    open24Hours: true
  },

  // --- BENGALURU 24/7 EMERGENCY HOSPITALS (108) ---
  {
    id: 'sh_victoria_hospital',
    name: 'Victoria Hospital & Level-1 Trauma Emergency Center',
    type: 'HOSPITAL',
    lat: 12.9628,
    lng: 77.5750,
    address: 'Fort Road, Near KR Market, Bengaluru, Karnataka 560002',
    distanceMeters: 1400,
    phone: '108 / (080) 2670-1150',
    open24Hours: true
  },
  {
    id: 'sh_bowring_hospital',
    name: 'Bowring & Lady Curzon 24/7 Government Hospital',
    type: 'HOSPITAL',
    lat: 12.9835,
    lng: 77.6045,
    address: 'Lady Curzon Rd, Tasker Town, Shivajinagar, Bengaluru, Karnataka 560001',
    distanceMeters: 1300,
    phone: '108 / (080) 2559-1362',
    open24Hours: true
  },
  {
    id: 'sh_manipal_hospital',
    name: 'Manipal Hospital & Critical Emergency Care',
    type: 'HOSPITAL',
    lat: 12.9585,
    lng: 77.6480,
    address: '98 HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017',
    distanceMeters: 2800,
    phone: '(080) 2502-4444 / 108',
    open24Hours: true
  },
  {
    id: 'sh_st_johns_hospital',
    name: "St. John's Medical College Hospital (Koramangala)",
    type: 'HOSPITAL',
    lat: 12.9324,
    lng: 77.6189,
    address: 'Sarjapur Main Rd, John Nagar, Koramangala, Bengaluru, Karnataka 560034',
    distanceMeters: 4600,
    phone: '(080) 2206-5000 / 108',
    open24Hours: true
  },
  {
    id: 'sh_nimhans_hospital',
    name: 'NIMHANS Neuro & Emergency Trauma Centre',
    type: 'HOSPITAL',
    lat: 12.9388,
    lng: 77.5954,
    address: 'Hosur Rd, Lakkasandra, Bengaluru, Karnataka 560029',
    distanceMeters: 3800,
    phone: '(080) 2699-5000 / 108',
    open24Hours: true
  },
  {
    id: 'sh_fortis_bannerghatta',
    name: 'Fortis Hospital 24/7 Emergency Wing',
    type: 'HOSPITAL',
    lat: 12.8936,
    lng: 77.5975,
    address: 'Bannerghatta Main Rd, Opp. IIM-B, Bengaluru, Karnataka 560076',
    distanceMeters: 8900,
    phone: '(080) 6621-4444 / 108',
    open24Hours: true
  },
  {
    id: 'sh_narayana_health_city',
    name: 'Narayana Institute of Cardiac & Emergency Sciences',
    type: 'HOSPITAL',
    lat: 12.8090,
    lng: 77.6930,
    address: '258/A, Bommasandra Industrial Area, Anekal Taluk, Bengaluru, Karnataka 560099',
    distanceMeters: 19800,
    phone: '(080) 7122-2222 / 108',
    open24Hours: true
  }
];

export interface NearbyEmergencySummary {
  closestPolice: { haven: SafeHaven; distanceMeters: number; bearing: number; cardinal: string } | null;
  closestHospital: { haven: SafeHaven; distanceMeters: number; bearing: number; cardinal: string } | null;
  allNearbyPolice: Array<{ haven: SafeHaven; distanceMeters: number; bearing: number; cardinal: string }>;
  allNearbyHospitals: Array<{ haven: SafeHaven; distanceMeters: number; bearing: number; cardinal: string }>;
}

export function getNearestEmergencyServices(lat: number, lng: number): NearbyEmergencySummary {
  const policeWithDist = MOCK_SAFE_HAVENS
    .filter(h => h.type === 'POLICE_STATION')
    .map(haven => {
      const distanceMeters = calculateDistanceMeters(lat, lng, haven.lat, haven.lng);
      const bearing = calculateBearing(lat, lng, haven.lat, haven.lng);
      const cardinal = bearingToCardinal(bearing);
      return { haven, distanceMeters, bearing, cardinal };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  const hospitalsWithDist = MOCK_SAFE_HAVENS
    .filter(h => h.type === 'HOSPITAL')
    .map(haven => {
      const distanceMeters = calculateDistanceMeters(lat, lng, haven.lat, haven.lng);
      const bearing = calculateBearing(lat, lng, haven.lat, haven.lng);
      const cardinal = bearingToCardinal(bearing);
      return { haven, distanceMeters, bearing, cardinal };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return {
    closestPolice: policeWithDist[0] || null,
    closestHospital: hospitalsWithDist[0] || null,
    allNearbyPolice: policeWithDist,
    allNearbyHospitals: hospitalsWithDist
  };
}

// Calculate Haversine distance in meters
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Calculate bearing degrees from point A to point B (0-360)
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const lambda1 = (lon1 * Math.PI) / 180;
  const lambda2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  const theta = Math.atan2(y, x);
  const bearing = ((theta * 180) / Math.PI + 360) % 360;

  return Math.round(bearing);
}

// Direction compass string (e.g. "NW", "ENE")
export function bearingToCardinal(bearing: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
}
