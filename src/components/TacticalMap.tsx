import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  Crosshair, 
  AlertTriangle, 
  Shield, 
  Car, 
  Compass, 
  Radio, 
  Maximize2,
  Minimize2,
  Phone,
  Hospital,
  LocateFixed,
  ChevronDown,
  ChevronUp,
  Loader2,
  MousePointerClick
} from 'lucide-react';
import { Coordinates, TelemetryPoint, PolicePatrolUnit, SafeHaven, ThreatLevel } from '../types/guardian';
import { 
  MOCK_SAFE_HAVENS, 
  calculateDistanceMeters, 
  calculateBearing, 
  bearingToCardinal,
  getNearestEmergencyServices,
  NearbyEmergencySummary
} from '../utils/offlineMap';
import { soundFx } from '../utils/soundFx';

interface TacticalMapProps {
  currentLocation: Coordinates;
  telemetry: TelemetryPoint;
  safeRoute: Coordinates[];
  trajectoryHistory: Coordinates[];
  threatLevel: ThreatLevel;
  policeUnits: PolicePatrolUnit[];
  predictedIntercepts: { corridorName: string; lat: number; lng: number; etaMinutes: number; riskScore: number }[];
  activeSos: boolean;
  onSelectSafeHaven?: (haven: SafeHaven) => void;
  onLocateMe?: (coords: Coordinates) => void;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  currentLocation,
  telemetry,
  safeRoute,
  trajectoryHistory,
  threatLevel,
  policeUnits,
  predictedIntercepts,
  activeSos,
  onSelectSafeHaven,
  onLocateMe
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const victimMarkerRef = useRef<L.Marker | null>(null);
  const victimPulseLayerRef = useRef<L.Circle | null>(null);
  const safeRoutePolylineRef = useRef<L.Polyline | null>(null);
  const trajectoryPolylineRef = useRef<L.Polyline | null>(null);
  const predictedPolylineRef = useRef<L.Polyline | null>(null);
  const policeMarkersRef = useRef<L.Marker[]>([]);
  const havenMarkersRef = useRef<L.Marker[]>([]);
  const policeStationLineRef = useRef<L.Polyline | null>(null);
  const patrolCarLineRef = useRef<L.Polyline | null>(null);
  const hospitalLineRef = useRef<L.Polyline | null>(null);

  const [mapStyle, setMapStyle] = useState<'tactical-dark' | 'satellite' | 'street'>('tactical-dark');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showEmergencyPanel, setShowEmergencyPanel] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'POLICE_STATIONS' | 'POLICE_PATROLS' | 'HOSPITALS'>('ALL');
  const [locateStatus, setLocateStatus] = useState<string | null>(null);

  // Compute nearest emergency services dynamically based on current location without distance cap
  const emergencySummary: NearbyEmergencySummary = useMemo(() => {
    return getNearestEmergencyServices(currentLocation.lat, currentLocation.lng);
  }, [currentLocation.lat, currentLocation.lng]);

  // Compute dynamic patrol units sorted by proximity to current location
  const sortedPatrolUnits = useMemo(() => {
    return [...policeUnits].map(unit => {
      const distanceMeters = calculateDistanceMeters(currentLocation.lat, currentLocation.lng, unit.currentLat, unit.currentLng);
      const bearing = calculateBearing(currentLocation.lat, currentLocation.lng, unit.currentLat, unit.currentLng);
      const cardinal = bearingToCardinal(bearing);
      return {
        ...unit,
        liveDistanceMeters: distanceMeters,
        liveDistanceKm: +(distanceMeters / 1000).toFixed(1),
        bearing,
        cardinal
      };
    }).sort((a, b) => a.liveDistanceMeters - b.liveDistanceMeters);
  }, [policeUnits, currentLocation.lat, currentLocation.lng]);

  const nearestPatrol = sortedPatrolUnits[0] || null;
  const closestPolice = emergencySummary.closestPolice;
  const closestHospital = emergencySummary.closestHospital;

  const totalAssetsCount = emergencySummary.allNearbyPolice.length + 
                           emergencySummary.allNearbyHospitals.length + 
                           sortedPatrolUnits.length;

  // "Locate Me" Real GPS Trigger function
  const executeLocateMe = (targetLat?: number, targetLng?: number) => {
    setIsLocating(true);
    setShowEmergencyPanel(true);
    soundFx.triggerHaptic([50, 50]);

    if (targetLat !== undefined && targetLng !== undefined) {
      // User clicked directly on map location
      setIsLocating(false);
      const accurateCoords: Coordinates = {
        lat: targetLat,
        lng: targetLng,
        speed: 4.0,
        heading: 45,
        altitude: 920,
        accuracy: 5,
        timestamp: Date.now()
      };

      setLocateStatus(`Located at ${targetLat.toFixed(5)}°N, ${targetLng.toFixed(5)}°E. Emergency distances updated.`);
      setTimeout(() => setLocateStatus(null), 4000);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([accurateCoords.lat, accurateCoords.lng], 15, { duration: 1.0 });
      }

      if (onLocateMe) {
        onLocateMe(accurateCoords);
      }
      return;
    }

    // Hardware GPS Geolocation
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setIsLocating(false);
          const accurateCoords: Coordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speed: pos.coords.speed ? pos.coords.speed * 3.6 : 4.0,
            heading: pos.coords.heading || 0,
            altitude: pos.coords.altitude || 920,
            accuracy: Math.round(pos.coords.accuracy || 5),
            timestamp: Date.now()
          };

          setLocateStatus(`Located at accurate GPS position (±${accurateCoords.accuracy}m). Nearby Police & Hospitals updated.`);
          setTimeout(() => setLocateStatus(null), 5000);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([accurateCoords.lat, accurateCoords.lng], 15, { duration: 1.2 });
          }

          if (onLocateMe) {
            onLocateMe(accurateCoords);
          }
        },
        err => {
          setIsLocating(false);
          console.warn('Geolocation lookup issue:', err);
          setLocateStatus('Located at Bengaluru Core. Showing nearby Police & Hospitals.');
          setTimeout(() => setLocateStatus(null), 5000);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([currentLocation.lat, currentLocation.lng], 15, { duration: 1.0 });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsLocating(false);
      setLocateStatus('Hardware Geolocation unavailable. Centered on Bengaluru.');
    }
  };

  // Initialize Leaflet Map focused on Bengaluru, Karnataka, India
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const southWest = L.latLng(11.0, 74.0);
      const northEast = L.latLng(16.0, 79.5);
      const karnatakaBounds = L.latLngBounds(southWest, northEast);

      const map = L.map(mapContainerRef.current, {
        center: [currentLocation.lat, currentLocation.lng],
        zoom: 14,
        minZoom: 9,
        maxZoom: 19,
        maxBounds: karnatakaBounds,
        maxBoundsViscosity: 0.8,
        zoomControl: false,
        attributionControl: false
      });

      const tileUrl =
        mapStyle === 'tactical-dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : mapStyle === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      // "Whenever I click, locate me" - map click listener
      map.on('click', (e: L.LeafletMouseEvent) => {
        executeLocateMe(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when mapStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl =
      mapStyle === 'tactical-dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : mapStyle === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);
  }, [mapStyle]);

  // Update Polylines for Safe Route, Trajectory, and Intercepts
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Draw Scheduled Safe Route
    if (safeRoutePolylineRef.current) {
      map.removeLayer(safeRoutePolylineRef.current);
    }
    if (safeRoute.length > 0) {
      const safePoints = safeRoute.map(pt => [pt.lat, pt.lng] as [number, number]);
      safeRoutePolylineRef.current = L.polyline(safePoints, {
        color: '#10b981',
        weight: 4,
        opacity: 0.75,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);
    }

    // Draw Actual Trajectory
    if (trajectoryPolylineRef.current) {
      map.removeLayer(trajectoryPolylineRef.current);
    }
    if (trajectoryHistory.length > 1) {
      const historyPoints = trajectoryHistory.map(pt => [pt.lat, pt.lng] as [number, number]);
      trajectoryPolylineRef.current = L.polyline(historyPoints, {
        color: threatLevel === 'CRITICAL' ? '#ef4444' : threatLevel === 'HIGH' ? '#f59e0b' : '#3b82f6',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
    }

    // Draw Predicted Escape / Intercept Corridor Vectors
    if (predictedPolylineRef.current) {
      map.removeLayer(predictedPolylineRef.current);
    }
    if (predictedIntercepts.length > 0 && (threatLevel === 'CRITICAL' || threatLevel === 'HIGH')) {
      const interceptPoints = [
        [currentLocation.lat, currentLocation.lng] as [number, number],
        ...predictedIntercepts.map(pt => [pt.lat, pt.lng] as [number, number])
      ];
      predictedPolylineRef.current = L.polyline(interceptPoints, {
        color: '#dc2626',
        weight: 3,
        opacity: 0.85,
        dashArray: '4, 6'
      }).addTo(map);
    }
  }, [safeRoute, trajectoryHistory, predictedIntercepts, threatLevel, currentLocation]);

  // Update Direct Navigation Route Lines to Closest Police Station, Patrol Car, and Hospital
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clean old lines
    if (policeStationLineRef.current) {
      map.removeLayer(policeStationLineRef.current);
      policeStationLineRef.current = null;
    }
    if (patrolCarLineRef.current) {
      map.removeLayer(patrolCarLineRef.current);
      patrolCarLineRef.current = null;
    }
    if (hospitalLineRef.current) {
      map.removeLayer(hospitalLineRef.current);
      hospitalLineRef.current = null;
    }

    // Line to Closest Police Station
    if (closestPolice) {
      policeStationLineRef.current = L.polyline(
        [
          [currentLocation.lat, currentLocation.lng],
          [closestPolice.haven.lat, closestPolice.haven.lng]
        ],
        {
          color: '#3b82f6',
          weight: 2.5,
          opacity: 0.8,
          dashArray: '6, 6'
        }
      ).addTo(map);
    }

    // Line to Nearest Patrol Car
    if (nearestPatrol) {
      patrolCarLineRef.current = L.polyline(
        [
          [currentLocation.lat, currentLocation.lng],
          [nearestPatrol.currentLat, nearestPatrol.currentLng]
        ],
        {
          color: '#06b6d4',
          weight: 2,
          opacity: 0.8,
          dashArray: '4, 4'
        }
      ).addTo(map);
    }

    // Line to Closest Hospital
    if (closestHospital) {
      hospitalLineRef.current = L.polyline(
        [
          [currentLocation.lat, currentLocation.lng],
          [closestHospital.haven.lat, closestHospital.haven.lng]
        ],
        {
          color: '#10b981',
          weight: 2.5,
          opacity: 0.8,
          dashArray: '6, 6'
        }
      ).addTo(map);
    }
  }, [currentLocation, closestPolice, nearestPatrol, closestHospital]);

  // Update Victim Marker and Pulse Halo
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const victimHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <div class="absolute w-14 h-14 rounded-full ${
          threatLevel === 'CRITICAL' || activeSos
            ? 'bg-red-500/40 animate-ping'
            : threatLevel === 'HIGH'
            ? 'bg-amber-500/40 animate-ping'
            : 'bg-emerald-500/30 animate-pulse'
        }"></div>
        <div class="w-8 h-8 rounded-full border-2 ${
          threatLevel === 'CRITICAL' || activeSos
            ? 'bg-red-600 border-white shadow-lg shadow-red-500'
            : threatLevel === 'HIGH'
            ? 'bg-amber-500 border-white shadow-lg shadow-amber-500'
            : 'bg-emerald-500 border-white shadow-lg shadow-emerald-500'
        } flex items-center justify-center text-white text-xs font-black shadow-md">
          <svg class="w-4 h-4 transform ${telemetry.heading ? `rotate-[${telemetry.heading}deg]` : ''}" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
        </div>
      </div>
    `;

    const victimIcon = L.divIcon({
      html: victimHtml,
      className: 'custom-victim-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (!victimMarkerRef.current) {
      victimMarkerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
        icon: victimIcon,
        zIndexOffset: 1000
      }).addTo(map);
    } else {
      victimMarkerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
      victimMarkerRef.current.setIcon(victimIcon);
    }

    if (!victimPulseLayerRef.current) {
      victimPulseLayerRef.current = L.circle([currentLocation.lat, currentLocation.lng], {
        radius: telemetry.isDeviatedFromSafeRoute ? 120 : (currentLocation.accuracy || 25),
        color: threatLevel === 'CRITICAL' ? '#ef4444' : '#10b981',
        fillColor: threatLevel === 'CRITICAL' ? '#ef4444' : '#10b981',
        fillOpacity: 0.14,
        weight: 1.5
      }).addTo(map);
    } else {
      victimPulseLayerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
      victimPulseLayerRef.current.setRadius(telemetry.isDeviatedFromSafeRoute ? 120 : (currentLocation.accuracy || 25));
      victimPulseLayerRef.current.setStyle({
        color: threatLevel === 'CRITICAL' ? '#ef4444' : '#10b981',
        fillColor: threatLevel === 'CRITICAL' ? '#ef4444' : '#10b981'
      });
    }
  }, [currentLocation, telemetry, threatLevel, activeSos]);

  // Update Police Patrol Unit Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    policeMarkersRef.current.forEach(m => map.removeLayer(m));
    policeMarkersRef.current = [];

    if (activeFilter === 'HOSPITALS' || activeFilter === 'POLICE_STATIONS') return;

    sortedPatrolUnits.forEach(unit => {
      const isAir = unit.vehicleType === 'Air Support';
      const unitHtml = `
        <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <div class="w-8 h-8 rounded-xl ${isAir ? 'bg-sky-500' : 'bg-blue-600'} border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs transform group-hover:scale-110 transition-transform">
            ${isAir ? '🚁' : '🚓'}
          </div>
          <span class="mt-0.5 px-1.5 py-0.5 bg-zinc-950/95 text-blue-300 font-mono text-[9px] font-bold rounded-md border border-blue-500/50 whitespace-nowrap shadow-md">
            ${unit.unitId} • ${unit.liveDistanceMeters < 1000 ? `${unit.liveDistanceMeters}m` : `${unit.liveDistanceKm}km`}
          </span>
        </div>
      `;

      const unitIcon = L.divIcon({
        html: unitHtml,
        className: 'custom-police-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([unit.currentLat, unit.currentLng], { icon: unitIcon, zIndexOffset: 900 })
        .addTo(map)
        .bindPopup(`
          <div class="text-xs p-2 text-zinc-900 font-sans max-w-[230px]">
            <div class="flex items-center justify-between mb-1">
              <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white font-mono">
                PATROL CAR
              </span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${
                unit.status === 'DISPATCHED' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
              }">${unit.status}</span>
            </div>
            <strong class="text-zinc-900 block text-xs font-bold">${unit.callSign}</strong>
            <p class="text-zinc-600 text-[11px]">Officer: ${unit.officerName}</p>
            <div class="mt-2 pt-1.5 border-t border-zinc-200 flex items-center justify-between font-mono text-[11px]">
              <span>Distance: <strong>${unit.liveDistanceMeters < 1000 ? `${unit.liveDistanceMeters}m` : `${unit.liveDistanceKm} km`}</strong></span>
              <span class="text-red-600 font-bold">ETA: ${unit.etaMinutes}m</span>
            </div>
            <a href="tel:112" class="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 shadow transition-colors">
              📞 Dispatch / Call 112
            </a>
          </div>
        `);

      policeMarkersRef.current.push(marker);
    });
  }, [sortedPatrolUnits, activeFilter]);

  // Update Safe Havens Markers (Police Stations & Hospitals)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    havenMarkersRef.current.forEach(m => map.removeLayer(m));
    havenMarkersRef.current = [];

    if (activeFilter === 'POLICE_PATROLS') return;

    const filteredHavens = [
      ...(activeFilter === 'HOSPITALS' ? [] : emergencySummary.allNearbyPolice),
      ...(activeFilter === 'POLICE_STATIONS' ? [] : emergencySummary.allNearbyHospitals)
    ];

    filteredHavens.forEach(({ haven, distanceMeters, bearing, cardinal }) => {
      const isPolice = haven.type === 'POLICE_STATION';
      const iconEmoji = isPolice ? '🛡️' : '🏥';
      const badgeBg = isPolice ? 'bg-blue-600 border-blue-300' : 'bg-emerald-600 border-emerald-300';
      const tagText = isPolice ? 'POLICE 112' : 'HOSPITAL 108';

      const havenHtml = `
        <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
          <div class="w-8 h-8 rounded-full ${badgeBg} border-2 shadow-lg flex items-center justify-center text-sm text-white transform group-hover:scale-110 transition-transform">
            ${iconEmoji}
          </div>
          <span class="mt-0.5 px-1.5 py-0.5 bg-zinc-950/95 text-white font-sans text-[9px] font-bold rounded-md border border-zinc-700 whitespace-nowrap shadow">
            ${distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters/1000).toFixed(1)}km`} (${cardinal})
          </span>
        </div>
      `;

      const havenIcon = L.divIcon({
        html: havenHtml,
        className: 'custom-haven-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([haven.lat, haven.lng], { icon: havenIcon })
        .addTo(map)
        .bindPopup(`
          <div class="text-xs p-2 text-zinc-900 font-sans max-w-[240px]">
            <div class="flex items-center justify-between mb-1">
              <span class="px-1.5 py-0.5 rounded text-[9px] font-bold text-white ${isPolice ? 'bg-blue-600' : 'bg-emerald-600'}">
                ${tagText}
              </span>
              <span class="text-[10px] text-emerald-700 font-bold">24/7 EMERGENCY</span>
            </div>
            <strong class="text-zinc-900 block text-xs font-bold leading-tight">${haven.name}</strong>
            <p class="text-zinc-600 text-[11px] mt-1">${haven.address}</p>
            <div class="mt-2 pt-1.5 border-t border-zinc-200 flex items-center justify-between font-mono text-[11px]">
              <span>Distance: <strong>${distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters/1000).toFixed(1)} km`}</strong></span>
              <span class="text-blue-700 font-bold">(${cardinal} • ${bearing}°)</span>
            </div>
            <a href="tel:${haven.phone.split('/')[0].trim()}" class="mt-2 w-full py-1 bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-colors shadow">
              📞 Call ${haven.phone}
            </a>
          </div>
        `);

      marker.on('click', () => {
        if (onSelectSafeHaven) onSelectSafeHaven(haven);
      });

      havenMarkersRef.current.push(marker);
    });
  }, [emergencySummary, activeFilter, onSelectSafeHaven]);

  // Recenter map on current coordinates
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([currentLocation.lat, currentLocation.lng], 15, { duration: 1 });
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300 flex flex-col ${
      isExpanded ? 'fixed inset-3 sm:inset-6 z-50 rounded-2xl' : 'h-[420px] sm:h-[480px] lg:h-[520px]'
    }`}>
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full bg-zinc-950 cursor-crosshair" />

      {/* Top Banner: Locate Status Toast */}
      {locateStatus && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[450] bg-zinc-950/95 border border-emerald-500/80 text-emerald-300 text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fade-in font-mono">
          <LocateFixed className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" />
          <span className="font-bold">{locateStatus}</span>
        </div>
      )}

      {/* Live GPS Telemetry HUD Overlay (Top-Left) */}
      <div className="absolute top-3 left-3 z-[400] flex flex-col gap-2 pointer-events-none max-w-[290px] sm:max-w-none">
        <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-2 sm:p-2.5 rounded-xl text-zinc-100 shadow-xl pointer-events-auto flex items-center gap-2 sm:gap-3">
          <div className={`w-3 h-3 rounded-full ${
            threatLevel === 'CRITICAL' ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'
          }`} />
          <div>
            <div className="text-[9px] sm:text-[10px] uppercase font-mono text-zinc-400 font-bold flex items-center gap-1.5">
              <span>Bengaluru GPS Beacon</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono font-bold flex items-center gap-1">
                <MousePointerClick className="w-2.5 h-2.5 text-emerald-400" />
                CLICK MAP TO LOCATE
              </span>
            </div>
            <div className="font-mono text-xs font-bold text-zinc-100">
              {currentLocation.lat.toFixed(5)}°N, {Math.abs(currentLocation.lng).toFixed(5)}°E
            </div>
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <div>
            <div className="text-[9px] sm:text-[10px] uppercase font-mono text-zinc-400 font-bold">Speed</div>
            <div className={`font-mono text-xs font-bold ${
              (telemetry.speed || 0) > 40 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {Math.round(telemetry.speed || 0)} km/h
            </div>
          </div>
        </div>

        {/* Route Deviation Banner if Diverged */}
        {telemetry.isDeviatedFromSafeRoute && (
          <div className="bg-red-950/95 border border-red-500/80 p-2 rounded-xl text-red-100 shadow-xl pointer-events-auto flex items-center gap-2 animate-bounce">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-xs font-bold">Deviation: 850m off MG Road safe corridor</span>
          </div>
        )}
      </div>

      {/* Primary "LOCATE ME" Button & Quick Controls (Top-Right Floating) */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2">
        {/* Prominent LOCATE ME Button */}
        <button
          onClick={() => executeLocateMe()}
          disabled={isLocating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-950/60 border border-emerald-300/40 transition-all transform active:scale-95 disabled:opacity-50"
          title="Click to acquire your accurate GPS position and immediately map nearby police stations, patrol cars & hospitals"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <LocateFixed className="w-4 h-4 text-emerald-200 animate-pulse" />
          )}
          <span className="whitespace-nowrap tracking-wide">{isLocating ? 'Locating...' : 'Locate Me'}</span>
        </button>

        {/* Control toolbar */}
        <div className="flex items-center gap-1 bg-zinc-950/90 backdrop-blur-md p-1 rounded-xl border border-zinc-800 shadow-xl">
          <button
            onClick={handleRecenter}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Recenter on GPS Target"
          >
            <Crosshair className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={() => {
              if (mapStyle === 'tactical-dark') setMapStyle('satellite');
              else if (mapStyle === 'satellite') setMapStyle('street');
              else setMapStyle('tactical-dark');
            }}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            title={`Switch Map Layer (Current: ${mapStyle})`}
          >
            <Layers className="w-4 h-4 text-sky-400" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            title={isExpanded ? 'Minimize Map' : 'Expand Map View'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Bottom Emergency Services: Police Stations, Patrol Cars & Hospitals */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] flex flex-col gap-2 pointer-events-none">
        {/* Toggle Bar for Emergency Filter Tabs */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-1 rounded-xl shadow-xl overflow-x-auto">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors ${
                activeFilter === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Nearby ({totalAssetsCount})
            </button>
            <button
              onClick={() => setActiveFilter('POLICE_STATIONS')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 whitespace-nowrap transition-colors ${
                activeFilter === 'POLICE_STATIONS' ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-blue-950/50'
              }`}
            >
              <Shield className="w-3 h-3" /> Police Stations ({emergencySummary.allNearbyPolice.length})
            </button>
            <button
              onClick={() => setActiveFilter('POLICE_PATROLS')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 whitespace-nowrap transition-colors ${
                activeFilter === 'POLICE_PATROLS' ? 'bg-cyan-600 text-white' : 'text-cyan-400 hover:bg-cyan-950/50'
              }`}
            >
              <Car className="w-3 h-3" /> Patrol Cars ({sortedPatrolUnits.length})
            </button>
            <button
              onClick={() => setActiveFilter('HOSPITALS')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 whitespace-nowrap transition-colors ${
                activeFilter === 'HOSPITALS' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-emerald-950/50'
              }`}
            >
              <Hospital className="w-3 h-3" /> Hospitals ({emergencySummary.allNearbyHospitals.length})
            </button>
          </div>

          <button
            onClick={() => setShowEmergencyPanel(!showEmergencyPanel)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800 text-zinc-300 hover:text-white text-[11px] font-bold shadow-xl"
          >
            <span>{showEmergencyPanel ? 'Hide Grid' : 'Show Emergency Grid'}</span>
            {showEmergencyPanel ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Emergency Quick-Access Cards: 3 Column Responsive Grid */}
        {showEmergencyPanel && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pointer-events-auto">
            {/* 1. Closest Police Station */}
            {closestPolice && (
              <div className="bg-zinc-950/95 backdrop-blur-md border border-blue-500/40 p-2.5 rounded-xl shadow-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/40 flex-shrink-0 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase font-mono px-1 py-0.2 bg-blue-950 text-blue-300 rounded font-bold border border-blue-800">
                        Station (112)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {closestPolice.distanceMeters < 1000 
                          ? `${closestPolice.distanceMeters}m` 
                          : `${(closestPolice.distanceMeters/1000).toFixed(1)}km`} ({closestPolice.cardinal})
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white truncate mt-0.5">
                      {closestPolice.haven.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {closestPolice.haven.address}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${closestPolice.haven.phone.split('/')[0].trim()}`}
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call 112</span>
                </a>
              </div>
            )}

            {/* 2. Closest Police Patrol Unit (Hoysala) */}
            {nearestPatrol && (
              <div className="bg-zinc-950/95 backdrop-blur-md border border-cyan-500/40 p-2.5 rounded-xl shadow-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-2 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 flex-shrink-0 flex items-center justify-center">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase font-mono px-1 py-0.2 bg-cyan-950 text-cyan-300 rounded font-bold border border-cyan-800">
                        Patrol Unit
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">
                        {nearestPatrol.liveDistanceMeters < 1000 
                          ? `${nearestPatrol.liveDistanceMeters}m` 
                          : `${nearestPatrol.liveDistanceKm}km`} ({nearestPatrol.cardinal})
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white truncate mt-0.5">
                      {nearestPatrol.callSign}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      Officer: {nearestPatrol.officerName} • ETA: <span className="text-amber-400 font-bold">{nearestPatrol.etaMinutes}m</span>
                    </div>
                  </div>
                </div>

                <a
                  href="tel:112"
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md"
                >
                  <Radio className="w-3 h-3" />
                  <span>Radio</span>
                </a>
              </div>
            )}

            {/* 3. Closest Hospital */}
            {closestHospital && (
              <div className="bg-zinc-950/95 backdrop-blur-md border border-emerald-500/40 p-2.5 rounded-xl shadow-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex-shrink-0 flex items-center justify-center">
                    <Hospital className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase font-mono px-1 py-0.2 bg-emerald-950 text-emerald-300 rounded font-bold border border-emerald-800">
                        Hospital (108)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {closestHospital.distanceMeters < 1000 
                          ? `${closestHospital.distanceMeters}m` 
                          : `${(closestHospital.distanceMeters/1000).toFixed(1)}km`} ({closestHospital.cardinal})
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white truncate mt-0.5">
                      {closestHospital.haven.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {closestHospital.haven.address}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${closestHospital.haven.phone.split('/')[0].trim()}`}
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call 108</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
