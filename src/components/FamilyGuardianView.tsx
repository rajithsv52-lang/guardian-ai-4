import React from 'react';
import { 
  UserCheck, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  Bell, 
  Activity, 
  Battery, 
  Wifi, 
  Clock, 
  Navigation,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Coordinates, TelemetryPoint, ThreatLevel, AIThreatAssessment } from '../types/guardian';

interface FamilyGuardianViewProps {
  victimName: string;
  currentLocation: Coordinates;
  telemetry: TelemetryPoint;
  threatLevel: ThreatLevel;
  assessment: AIThreatAssessment;
  activeSos: boolean;
  onTriggerRemoteAlarm: () => void;
  onCallPolice: () => void;
}

export const FamilyGuardianView: React.FC<FamilyGuardianViewProps> = ({
  victimName,
  currentLocation,
  telemetry,
  threatLevel,
  assessment,
  activeSos,
  onTriggerRemoteAlarm,
  onCallPolice
}) => {
  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 text-zinc-100 shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-white">
                Family & Guardian Live Escort Portal
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                ACTIVE MONITORING
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Monitoring protected user: <strong className="text-white">{victimName}</strong> • Real-time GPS & Vital Stream
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCallPolice}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-700/40 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Direct Namma 112 Police Dispatch</span>
          </button>
        </div>
      </div>

      {/* Status Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Safety Route Status</span>
          <div className="flex items-center gap-2 mt-1">
            {telemetry.isDeviatedFromSafeRoute ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400">Route Deviation Detected</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">On Designated Safe Route</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 font-mono">
            {telemetry.isDeviatedFromSafeRoute ? 'Diverged 850m from safe path' : 'MG Road - Trinity Metro Transit Corridor'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Estimated Arrival / Transit</span>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-white">ETA to Home: 8 mins</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 font-mono">
            Speed: {Math.round(telemetry.speed || 0)} km/h • Heading: {Math.round(telemetry.heading || 0)}°
          </span>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Loved One's Phone Vitals</span>
          <div className="flex items-center justify-between text-xs font-mono mt-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <Battery className="w-3.5 h-3.5" /> {telemetry.batteryLevel}%
            </span>
            <span className="flex items-center gap-1 text-sky-400">
              <Wifi className="w-3.5 h-3.5" /> {telemetry.signalBars}/4 Bars
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <Activity className="w-3.5 h-3.5" /> {telemetry.heartRateBpm} BPM
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 font-mono">Hardware Lock Secured</span>
        </div>
      </div>

      {/* Emergency Action Controls for Guardians */}
      <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-bold text-xs text-white block">Remote Guardian Assist Actions</span>
          <p className="text-[11px] text-zinc-400">Trigger deterrent or establish live phone audio escort</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onTriggerRemoteAlarm}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Sound Remote Deterrent Ping</span>
          </button>

          <a
            href="tel:112"
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white flex items-center gap-1.5 shadow"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Namma 112 with GPS Payload</span>
          </a>
        </div>
      </div>
    </div>
  );
};
