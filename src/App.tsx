import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TacticalMap } from './components/TacticalMap';
import { ThreatStatusHUD } from './components/ThreatStatusHUD';
import { EmergencySOSBar } from './components/EmergencySOSBar';
import { PoliceCADConsole } from './components/PoliceCADConsole';
import { FamilyGuardianView } from './components/FamilyGuardianView';
import { EncryptedVaultModal } from './components/EncryptedVaultModal';
import { OfflineMeshModal } from './components/OfflineMeshModal';
import { ScenarioSimulator, ScenarioType } from './components/ScenarioSimulator';
import { DeviceSimulatorBezel } from './components/DeviceSimulatorBezel';
import { NotificationToast, PushAlertMessage } from './components/NotificationToast';
import { PresentationModal } from './components/PresentationModal';
import { 
  Coordinates, 
  TelemetryPoint, 
  UserRole, 
  DeviceViewMode, 
  AIThreatAssessment, 
  PolicePatrolUnit, 
  IncidentReport, 
  EmergencyContact,
  SafeHaven
} from './types/guardian';
import { computeSha256Hash } from './utils/crypto';
import { soundFx } from './utils/soundFx';

// Safe route waypoints (customary route home in Bangalore: MG Road -> Trinity Metro -> Indiranagar 100ft Rd)
const DEFAULT_SAFE_ROUTE: Coordinates[] = [
  { lat: 12.9755, lng: 77.6010, timestamp: Date.now() - 600000 },
  { lat: 12.9738, lng: 77.6085, timestamp: Date.now() - 400000 },
  { lat: 12.9725, lng: 77.6160, timestamp: Date.now() - 200000 },
  { lat: 12.9716, lng: 77.5946, timestamp: Date.now() },
  { lat: 12.9780, lng: 77.6405, timestamp: Date.now() + 200000 }
];

const INITIAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'c1',
    name: 'Ananya Sharma',
    relation: 'Family / Primary Guardian',
    phone: '+91 98860 41221',
    isPrimary: true,
    notifyOnDeviation: true,
    avatarBg: 'bg-indigo-600'
  },
  {
    id: 'c2',
    name: 'Vikram Rao',
    relation: 'Brother / Emergency Escort',
    phone: '+91 98450 30299',
    isPrimary: false,
    notifyOnDeviation: true,
    avatarBg: 'bg-emerald-600'
  },
  {
    id: 'c3',
    name: 'Bengaluru Namma 112 Command Center',
    relation: 'City Police Emergency Dispatch',
    phone: '112 / (080) 2294-2222',
    isPrimary: false,
    notifyOnDeviation: true,
    avatarBg: 'bg-amber-600'
  }
];

const INITIAL_POLICE_UNITS: PolicePatrolUnit[] = [
  {
    unitId: 'HOYSALA-402',
    callSign: 'Namma 112 Hoysala Patrol #4',
    officerName: 'ASI Manjunath & PC Suresh',
    status: 'STANDBY',
    distanceKm: 0.6,
    etaMinutes: 1.8,
    currentLat: 12.9745,
    currentLng: 77.5980,
    vehicleType: 'Cruiser'
  },
  {
    unitId: 'INTERCEPT-109',
    callSign: 'Traffic Rapid Interceptor #9',
    officerName: 'Inspector Raghavendra',
    status: 'STANDBY',
    distanceKm: 1.4,
    etaMinutes: 3.2,
    currentLat: 12.9795,
    currentLng: 77.6040,
    vehicleType: 'Interceptor'
  },
  {
    unitId: 'AIR-WING-2',
    callSign: 'Bengaluru Police Drone Recon Wing',
    officerName: 'Drone Operator Karthik',
    status: 'STANDBY',
    distanceKm: 3.5,
    etaMinutes: 4.5,
    currentLat: 12.9560,
    currentLng: 77.6050,
    vehicleType: 'Air Support'
  }
];

export default function App() {
  // App-level state
  const [userRole, setUserRole] = useState<UserRole>('PROTECTED_USER');
  const [viewMode, setViewMode] = useState<DeviceViewMode>('RESPONSIVE');
  const [themeMode, setThemeMode] = useState<'tactical-dark' | 'emergency-red' | 'high-contrast-light'>('tactical-dark');

  // GPS & Telemetry centered in Bangalore, Karnataka, India
  const [currentLocation, setCurrentLocation] = useState<Coordinates>({
    lat: 12.9716,
    lng: 77.5946,
    speed: 4.2,
    heading: 45,
    altitude: 920,
    accuracy: 4,
    timestamp: Date.now()
  });

  const [telemetry, setTelemetry] = useState<TelemetryPoint>({
    lat: 12.9716,
    lng: 77.5946,
    speed: 4.2,
    heading: 45,
    altitude: 920,
    accuracy: 4,
    timestamp: Date.now(),
    ambientNoiseDb: 48,
    deviceStruggleIndex: 12,
    batteryLevel: 84,
    signalBars: 4,
    heartRateBpm: 74,
    isDeviatedFromSafeRoute: false,
    isInDeadZone: false
  });

  const [safeRoute] = useState<Coordinates[]>(DEFAULT_SAFE_ROUTE);
  const [trajectoryHistory, setTrajectoryHistory] = useState<Coordinates[]>([
    { lat: 12.9755, lng: 77.6010, timestamp: Date.now() - 120000 },
    { lat: 12.9738, lng: 77.6085, timestamp: Date.now() - 60000 },
    { lat: 12.9716, lng: 77.5946, timestamp: Date.now() }
  ]);

  // AI Threat State
  const [assessment, setAssessment] = useState<AIThreatAssessment>({
    threatLevel: 'LOW',
    abductionProbability: 5,
    headline: 'NORMAL: Safe Transit Route in Bengaluru',
    analysisSummary: 'Target is on scheduled pedestrian corridor (MG Road / Trinity Metro). Multi-sensor vitals, velocity (4 km/h), and ambient acoustics remain within safe baseline parameters.',
    threatVectors: [],
    predictedIntercepts: [
      {
        corridorName: 'Outer Ring Road - Koramangala / Silk Board Intercept Alpha',
        lat: 12.9796,
        lng: 77.5886,
        etaMinutes: 3.2,
        riskScore: 35
      }
    ],
    tacticalDirectives: [
      'Maintain continuous encrypted GPS telemetry beacon broadcast.',
      'Log routine safe transit checkpoints along MG Road.',
      'Emergency SOS on 1-tap standby for Namma 112 dispatch.'
    ],
    lawEnforcementCadSummary: '[STANDBY] VICTIM: Jane Doe | LOC: 12.97160°N, 77.59460°E (Bengaluru, KA) | STATUS: NORMAL TRANSIT | ASSIGNED: NAMMA 112 BENGALURU CENTRAL',
    recommendedAction: 'MONITOR'
  });

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [activeSos, setActiveSos] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('SAFE_WALK');
  const [policeUnits, setPoliceUnits] = useState<PolicePatrolUnit[]>(INITIAL_POLICE_UNITS);
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);
  const [alerts, setAlerts] = useState<PushAlertMessage[]>([]);

  // Modals
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [isOfflineMeshOpen, setIsOfflineMeshOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);

  // Simulation Watchers
  const watchIdRef = useRef<number | null>(null);

  // Push notification helper
  const addAlert = useCallback((title: string, body: string, severity: 'CRITICAL' | 'HIGH' | 'INFO', actionLabel?: string, onAction?: () => void) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const newAlert: PushAlertMessage = {
      id: `alert-${Date.now()}-${Math.random()}`,
      title,
      body,
      timestamp: timeStr,
      severity,
      actionLabel,
      onAction
    };

    setAlerts(prev => [...prev, newAlert]);
    soundFx.playThreatWarning();

    // Trigger real browser Notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/favicon.ico' });
      } catch (err) {
        console.warn('Native notification error:', err);
      }
    }
  }, []);

  // Request native notification permissions on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Evaluate Threat with Server Gemini AI
  const evaluateThreat = useCallback(async (
    telemetryData: TelemetryPoint,
    sosTriggered: boolean = false,
    silentDuress: boolean = false
  ) => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/threat-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telemetry: telemetryData,
          safeRouteCoords: safeRoute,
          recentTrajectory: trajectoryHistory,
          victimProfile: { name: 'Jane Doe', age: 24, bloodType: 'O-Negative' },
          activeSosTriggered: sosTriggered,
          silentDuressCode: silentDuress
        })
      });

      const data = await res.json();
      if (data.success && data.assessment) {
        setAssessment(data.assessment);

        // If threat is elevated/critical, trigger push alert
        if (data.assessment.threatLevel === 'CRITICAL') {
          addAlert(
            '🚨 CRITICAL ABDUCTION ALERT',
            data.assessment.headline,
            'CRITICAL',
            'View Police Intercept CAD',
            () => setUserRole('POLICE_DISPATCHER')
          );
        } else if (data.assessment.threatLevel === 'HIGH') {
          addAlert(
            '⚠️ HIGH THREAT: Route Deviation & Distress',
            data.assessment.headline,
            'HIGH'
          );
        }
      }
    } catch (err) {
      console.error('Threat evaluation request failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  }, [safeRoute, trajectoryHistory, addAlert]);

  // Handle Scenario Switching
  const handleSelectScenario = (sc: ScenarioType) => {
    setActiveScenario(sc);

    if (sc === 'SAFE_WALK') {
      const newCoords: Coordinates = { lat: 12.9716, lng: 77.5946, speed: 4.5, heading: 45, timestamp: Date.now() };
      const newTelem: TelemetryPoint = {
        ...newCoords,
        ambientNoiseDb: 48,
        deviceStruggleIndex: 10,
        batteryLevel: 84,
        signalBars: 4,
        heartRateBpm: 76,
        isDeviatedFromSafeRoute: false,
        isInDeadZone: false
      };
      setCurrentLocation(newCoords);
      setTelemetry(newTelem);
      setTrajectoryHistory(DEFAULT_SAFE_ROUTE.slice(0, 4));
      setActiveSos(false);
      soundFx.toggleSiren(false);
      evaluateThreat(newTelem, false, false);
      addAlert('Scenario: Safe Walk Active', 'Normal pedestrian transit along MG Road towards Trinity Metro corridor.', 'INFO');
    } else if (sc === 'AMBUSH_DEVIATION') {
      // Diverged 850m into secluded alleyway in Indiranagar
      const newCoords: Coordinates = { lat: 12.9785, lng: 77.6408, speed: 8.2, heading: 240, timestamp: Date.now() };
      const newTelem: TelemetryPoint = {
        ...newCoords,
        ambientNoiseDb: 88, // Scream / physical struggle dB
        deviceStruggleIndex: 78, // High struggle accelerometer
        batteryLevel: 82,
        signalBars: 2,
        heartRateBpm: 138, // High pulse
        isDeviatedFromSafeRoute: true,
        isInDeadZone: false
      };
      setCurrentLocation(newCoords);
      setTelemetry(newTelem);
      setTrajectoryHistory(prev => [...prev, newCoords]);
      evaluateThreat(newTelem, false, false);
    } else if (sc === 'VEHICULAR_ABDUCTION') {
      // High-speed vehicle abduction (76 km/h) near Silk Board Junction towards Hosur Road
      const newCoords: Coordinates = { lat: 12.9172, lng: 77.6228, speed: 76.5, heading: 175, timestamp: Date.now() };
      const newTelem: TelemetryPoint = {
        ...newCoords,
        ambientNoiseDb: 84,
        deviceStruggleIndex: 92,
        batteryLevel: 80,
        signalBars: 3,
        heartRateBpm: 154,
        isDeviatedFromSafeRoute: true,
        isInDeadZone: false
      };
      setCurrentLocation(newCoords);
      setTelemetry(newTelem);
      setTrajectoryHistory(prev => [...prev, newCoords]);
      setActiveSos(true);
      evaluateThreat(newTelem, true, false);
    } else if (sc === 'CELLULAR_DEADZONE') {
      // 0 bars cellular signal in Bannerghatta forest corridor
      const newCoords: Coordinates = { lat: 12.8005, lng: 77.5770, speed: 32.0, heading: 180, timestamp: Date.now() };
      const newTelem: TelemetryPoint = {
        ...newCoords,
        ambientNoiseDb: 62,
        deviceStruggleIndex: 45,
        batteryLevel: 78,
        signalBars: 0,
        heartRateBpm: 110,
        isDeviatedFromSafeRoute: true,
        isInDeadZone: true
      };
      setCurrentLocation(newCoords);
      setTelemetry(newTelem);
      setTrajectoryHistory(prev => [...prev, newCoords]);
      setIsOfflineMeshOpen(true);
      evaluateThreat(newTelem, false, false);
      addAlert('📡 Bannerghatta Cellular Dead-Zone', 'Switched automatically to offline 140-char satellite mesh beacon.', 'HIGH');
    } else if (sc === 'SILENT_DURESS') {
      handleTriggerSilentDuress('9911');
    } else if (sc === 'REAL_BROWSER_GPS') {
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const realCoords: Coordinates = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              speed: pos.coords.speed ? pos.coords.speed * 3.6 : 4.0,
              heading: pos.coords.heading || 0,
              altitude: pos.coords.altitude || 0,
              accuracy: pos.coords.accuracy,
              timestamp: Date.now()
            };
            const realTelem: TelemetryPoint = {
              ...realCoords,
              ambientNoiseDb: 50,
              deviceStruggleIndex: 15,
              batteryLevel: 85,
              signalBars: 4,
              heartRateBpm: 75,
              isDeviatedFromSafeRoute: false,
              isInDeadZone: false
            };
            setCurrentLocation(realCoords);
            setTelemetry(realTelem);
            evaluateThreat(realTelem, false, false);
            addAlert('🛰️ Live Browser GPS Connected', `Acquired physical coordinates (${realCoords.lat.toFixed(4)}, ${realCoords.lng.toFixed(4)})`, 'INFO');
          },
          err => {
            console.warn('Geolocation error:', err);
            addAlert('GPS Permission Denied', 'Falling back to high-accuracy tactical simulation coordinates.', 'INFO');
          }
        );
      }
    }
  };

  // SOS Trigger Handler
  const handleTriggerSos = async () => {
    setActiveSos(true);
    soundFx.toggleSiren(true);
    soundFx.triggerHaptic([500, 200, 500, 200, 1000]);

    // Update telemetry state
    const urgentTelem: TelemetryPoint = {
      ...telemetry,
      deviceStruggleIndex: 85,
      heartRateBpm: 146,
      isDeviatedFromSafeRoute: true
    };
    setTelemetry(urgentTelem);

    // Call CAD Emergency Dispatch API
    try {
      const res = await fetch('/api/emergency-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          victimProfile: { name: 'Jane Doe', age: 24 },
          telemetry: urgentTelem,
          threatLevel: 'CRITICAL',
          audioEvidenceIncluded: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setPoliceUnits(data.assignedUnits);
        addAlert(
          '🚨 PRIORITY 1 POLICE CAD DISPATCHED',
          `Event #${data.cadEventNumber}: Hoysala 402 & Interceptor 109 responding Code 3 in Bengaluru. ETA 1.8 mins.`,
          'CRITICAL',
          'Open Police Console',
          () => setUserRole('POLICE_DISPATCHER')
        );
      }
    } catch (err) {
      console.warn('Police dispatch call failed:', err);
    }

    evaluateThreat(urgentTelem, true, false);
  };

  // Cancel SOS
  const handleCancelSos = () => {
    setActiveSos(false);
    soundFx.toggleSiren(false);
    addAlert('Emergency SOS Cancelled', 'Safety verified. Standby telemetry restored.', 'INFO');
  };

  // Silent Duress PIN Trigger
  const handleTriggerSilentDuress = async (pin: string) => {
    soundFx.triggerHaptic([50, 50, 50]);
    addAlert('Silent Duress Code Received', 'Covert CAD dispatch activated without on-screen siren.', 'HIGH');

    const duressTelem: TelemetryPoint = {
      ...telemetry,
      heartRateBpm: 130
    };
    setTelemetry(duressTelem);

    try {
      await fetch('/api/emergency-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          victimProfile: { name: 'Jane Doe', age: 24 },
          telemetry: duressTelem,
          threatLevel: 'CRITICAL',
          silentDuressCodeEntered: true
        })
      });
    } catch (e) {
      console.warn(e);
    }

    evaluateThreat(duressTelem, false, true);
  };

  // Deploy Roadblock at Intercept
  const handleDeployRoadblock = (corridorName: string) => {
    soundFx.playRadioChirp();
    addAlert(
      '🚧 Spike Strip Roadblock Deployed',
      `Cruiser Unit 402 establishing perimeter roadblock at ${corridorName}.`,
      'HIGH'
    );
  };

  // Dispatch Backup Police Unit
  const handleDispatchBackupUnit = (unitId: string) => {
    soundFx.playRadioChirp();
    setPoliceUnits(prev =>
      prev.map(u => (u.unitId === unitId ? { ...u, status: 'EN_ROUTE', etaMinutes: Math.max(1, u.etaMinutes - 1) } : u))
    );
    addAlert('Patrol Unit Reassigned', `Unit ${unitId} upgraded to Priority 1 response.`, 'INFO');
  };

  // Audio Snippet Record Completed
  const handleAudioRecorded = (duration: number) => {
    addAlert(
      '🎙️ Audio Evidence Secured',
      `Captured ${duration}s ambient audio snippet. Encrypted with AES-256 and appended to CAD evidence locker.`,
      'INFO'
    );
  };

  // Current incident snapshot for Police CAD console
  const currentIncident: IncidentReport = {
    id: 'inc-991',
    timestamp: Date.now(),
    victimName: 'Jane Doe',
    status: activeSos ? 'ACTIVE_EMERGENCY' : 'STANDBY',
    threatLevel: assessment.threatLevel,
    abductionProbability: assessment.abductionProbability,
    lastKnownCoords: currentLocation,
    telemetrySnapshot: telemetry,
    encryptedHash: '0x8f2a64c01e9d34b971fe203a58e49bc701f456ba3128912e87abcf9012345678',
    cadEventNumber: 'CAD-911-840219',
    assignedUnits: policeUnits,
    audioDistressRecorded: true,
    routeHistory: trajectoryHistory
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      themeMode === 'high-contrast-light'
        ? 'bg-zinc-100 text-zinc-900'
        : themeMode === 'emergency-red'
        ? 'bg-red-950/90 text-white'
        : 'bg-zinc-950 text-zinc-100'
    } flex flex-col font-sans selection:bg-red-500 selection:text-white`}>
      {/* Push Notification Overlay */}
      <NotificationToast
        alerts={alerts}
        onDismiss={id => setAlerts(prev => prev.filter(a => a.id !== id))}
      />

      {/* Top Tactical Navigation Bar */}
      <Navbar
        userRole={userRole}
        onRoleChange={setUserRole}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        themeMode={themeMode}
        onThemeModeChange={setThemeMode}
        threatLevel={assessment.threatLevel}
        activeSos={activeSos}
        gpsActive={true}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenOfflineMesh={() => setIsOfflineMeshOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        unreadAlertCount={alerts.length}
      />

      {/* Main Content Area (Wrapped in Device Simulator Bezel if phone mode selected) */}
      <DeviceSimulatorBezel viewMode={viewMode}>
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-5">
          {/* 1. Scenario Telemetry Simulator Bar (Quick Testing Controls) */}
          <ScenarioSimulator
            activeScenario={activeScenario}
            onSelectScenario={handleSelectScenario}
            isRealGpsAvailable={typeof navigator !== 'undefined' && 'geolocation' in navigator}
          />

          {/* 2. Primary Emergency Action Bar (One-Tap SOS, Silent Duress, Siren, Mic Recorder) */}
          <EmergencySOSBar
            activeSos={activeSos}
            onTriggerSos={handleTriggerSos}
            onCancelSos={handleCancelSos}
            onTriggerPoliceAlert={handleTriggerSos}
            onTriggerSilentDuress={handleTriggerSilentDuress}
            onAudioRecorded={handleAudioRecorded}
          />

          {/* 3. Interactive Tactical GIS Map (Live GPS, Safe Route vs Deviation, Police Converging, Safe Havens) */}
          <TacticalMap
            currentLocation={currentLocation}
            telemetry={telemetry}
            safeRoute={safeRoute}
            trajectoryHistory={trajectoryHistory}
            threatLevel={assessment.threatLevel}
            policeUnits={policeUnits}
            predictedIntercepts={assessment.predictedIntercepts}
            activeSos={activeSos}
            onSelectSafeHaven={haven => {
              addAlert(
                `Safe Haven: ${haven.name}`,
                `Navigating to ${haven.address}. Open 24/7. Phone: ${haven.phone}`,
                'INFO'
              );
            }}
            onLocateMe={coords => {
              setCurrentLocation(coords);
              const updatedTelem: TelemetryPoint = {
                ...telemetry,
                ...coords
              };
              setTelemetry(updatedTelem);
              setTrajectoryHistory(prev => [...prev, coords]);
              evaluateThreat(updatedTelem, activeSos, false);
              addAlert(
                '📍 GPS Acquired: Emergency Grid Mapped',
                `Located at ${coords.lat.toFixed(5)}°N, ${Math.abs(coords.lng).toFixed(5)}°E (Bengaluru, KA). Mapped nearest Namma 112 Police Station, Hoysala Patrol Cars & Level-1 Emergency Hospitals.`,
                'INFO'
              );
            }}
          />

          {/* 4. Real-time Threat Status HUD (Gemini AI Threat Gauge, Multi-Sensors, Vectors Timeline) */}
          <ThreatStatusHUD
            assessment={assessment}
            telemetry={telemetry}
            isEvaluating={isEvaluating}
            onRefreshAssessment={() => evaluateThreat(telemetry, activeSos, false)}
            onTriggerPoliceAlert={handleTriggerSos}
          />

          {/* 5. Role-Specific Dedicated Views */}
          {userRole === 'POLICE_DISPATCHER' && (
            <PoliceCADConsole
              currentIncident={currentIncident}
              policeUnits={policeUnits}
              onDispatchBackupUnit={handleDispatchBackupUnit}
              onDeployRoadblock={handleDeployRoadblock}
              onExportDossier={() => setIsVaultOpen(true)}
            />
          )}

          {userRole === 'FAMILY_GUARDIAN' && (
            <FamilyGuardianView
              victimName="Jane Doe"
              currentLocation={currentLocation}
              telemetry={telemetry}
              threatLevel={assessment.threatLevel}
              assessment={assessment}
              activeSos={activeSos}
              onTriggerRemoteAlarm={() => {
                soundFx.playThreatWarning();
                addAlert('Remote Alarm Triggered', 'Sounding deterrent audio ping on protected user phone.', 'INFO');
              }}
              onCallPolice={handleTriggerSos}
            />
          )}
        </main>
      </DeviceSimulatorBezel>

      {/* E2EE Encrypted Vault Modal */}
      <EncryptedVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        contacts={contacts}
        onAddContact={contact => setContacts(prev => [...prev, contact])}
        onRemoveContact={id => setContacts(prev => prev.filter(c => c.id !== id))}
      />

      {/* Offline Vector Map & Satellite Mesh Modal */}
      <OfflineMeshModal
        isOpen={isOfflineMeshOpen}
        onClose={() => setIsOfflineMeshOpen(false)}
        currentLocation={currentLocation}
        threatLevel={assessment.threatLevel}
      />

      {/* Formal PPT Presentation Modal */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}
