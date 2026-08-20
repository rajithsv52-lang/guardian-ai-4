import React from 'react';
import { 
  Play, 
  Footprints, 
  AlertTriangle, 
  Car, 
  WifiOff, 
  Lock, 
  MapPin, 
  Sparkles,
  Zap
} from 'lucide-react';

export type ScenarioType = 
  | 'SAFE_WALK' 
  | 'AMBUSH_DEVIATION' 
  | 'VEHICULAR_ABDUCTION' 
  | 'CELLULAR_DEADZONE' 
  | 'SILENT_DURESS'
  | 'REAL_BROWSER_GPS';

interface ScenarioSimulatorProps {
  activeScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
  isRealGpsAvailable: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  activeScenario,
  onSelectScenario,
  isRealGpsAvailable
}) => {
  const scenarios: Array<{
    id: ScenarioType;
    title: string;
    description: string;
    icon: React.ReactNode;
    tag: string;
    threatClass: string;
  }> = [
    {
      id: 'SAFE_WALK',
      title: '1. Safe Walk (MG Road / Brigade)',
      description: 'Pedestrian pace (4 km/h), on-route to Trinity Metro station, normal acoustic vitals.',
      icon: <Footprints className="w-4 h-4 text-emerald-400" />,
      tag: 'LOW RISK',
      threatClass: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
    },
    {
      id: 'AMBUSH_DEVIATION',
      title: '2. Alley Ambush (Indiranagar 100ft)',
      description: 'Diverged into dark lane, 88 dB scream signature, struggle accelerometer spike (78/100).',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      tag: 'HIGH RISK',
      threatClass: 'bg-amber-950/40 border-amber-800/60 text-amber-300'
    },
    {
      id: 'VEHICULAR_ABDUCTION',
      title: '3. Forced Car Abduction (Silk Board)',
      description: 'Sudden 76 km/h vehicle speed pickup heading towards Hosur Expressway highway.',
      icon: <Car className="w-4 h-4 text-red-400" />,
      tag: 'CRITICAL',
      threatClass: 'bg-red-950/50 border-red-800/80 text-red-300'
    },
    {
      id: 'CELLULAR_DEADZONE',
      title: '4. Cellular Deadzone (Bannerghatta)',
      description: 'Signal drops to 0 bars, switches immediately to offline 140-char satellite mesh.',
      icon: <WifiOff className="w-4 h-4 text-sky-400" />,
      tag: 'OFFLINE MESH',
      threatClass: 'bg-sky-950/40 border-sky-800/60 text-sky-300'
    },
    {
      id: 'SILENT_DURESS',
      title: '5. Silent Duress PIN (9911)',
      description: 'Coerced unlock triggers stealth Namma 112 CAD dispatch without siren alert.',
      icon: <Lock className="w-4 h-4 text-purple-400" />,
      tag: 'COVERT 112',
      threatClass: 'bg-purple-950/40 border-purple-800/60 text-purple-300'
    },
    {
      id: 'REAL_BROWSER_GPS',
      title: '6. Live Device GPS (Real-Time)',
      description: 'Streams actual physical coordinates from your device via HTML5 Geolocation API.',
      icon: <MapPin className="w-4 h-4 text-teal-400" />,
      tag: 'HARDWARE GPS',
      threatClass: 'bg-teal-950/40 border-teal-800/60 text-teal-300'
    }
  ];

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Bangalore Threat Scenario Simulator
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">
          Instant test simulation for Gemini AI threat assessment & Bengaluru Police 112 triggers
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {scenarios.map(sc => {
          const isSelected = activeScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-zinc-900 border-zinc-400 shadow-md ring-1 ring-white/20'
                  : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-800 flex items-center justify-center">
                    {sc.icon}
                  </div>
                  <span className="font-bold text-xs text-white">{sc.title}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${sc.threatClass}`}>
                  {sc.tag}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">{sc.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
