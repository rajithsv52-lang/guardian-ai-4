import React, { useState } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  Car, 
  MapPin, 
  Volume2, 
  CheckCircle2, 
  AlertOctagon, 
  FileText, 
  Lock, 
  PhoneCall, 
  Send, 
  ExternalLink,
  Flame,
  RadioTower
} from 'lucide-react';
import { PolicePatrolUnit, IncidentReport, Coordinates } from '../types/guardian';
import { soundFx } from '../utils/soundFx';

interface PoliceCADConsoleProps {
  currentIncident: IncidentReport;
  policeUnits: PolicePatrolUnit[];
  onDispatchBackupUnit: (unitId: string) => void;
  onDeployRoadblock: (corridorName: string) => void;
  onExportDossier: () => void;
}

export const PoliceCADConsole: React.FC<PoliceCADConsoleProps> = ({
  currentIncident,
  policeUnits,
  onDispatchBackupUnit,
  onDeployRoadblock,
  onExportDossier
}) => {
  const [radioLog, setRadioLog] = useState<Array<{ id: string; time: string; sender: string; message: string; channel: string }>>([
    {
      id: 'log-1',
      time: '09:41:02',
      sender: 'NAMMA 112 DISPATCH',
      message: '10-99 EMERGENCY: Automated kidnapping trajectory deviation alert triggered for Victim Jane Doe in Bengaluru.',
      channel: 'TAC-1'
    },
    {
      id: 'log-2',
      time: '09:41:15',
      sender: 'HOYSALA-402 (ASI Manjunath)',
      message: 'Copy 112 Control, Hoysala 402 en-route via MG Road / Cubbon Park. ETA 1.8 minutes. Requesting Drone visual.',
      channel: 'TAC-1'
    },
    {
      id: 'log-3',
      time: '09:41:28',
      sender: 'INTERCEPT-109 (Insp. Raghavendra)',
      message: 'Heading south to establish roadblock perimeter at Silk Board / Hosur Expressway junction.',
      channel: 'TAC-1'
    }
  ]);
  const [newRadioMessage, setNewRadioMessage] = useState('');
  const [isBroadcastingRadio, setIsBroadcastingRadio] = useState(false);

  const handleSendRadioBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRadioMessage.trim()) return;

    soundFx.playRadioChirp();
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    setRadioLog(prev => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        time: timeStr,
        sender: 'DISPATCHER (YOU)',
        message: newRadioMessage.trim(),
        channel: 'TAC-1'
      }
    ]);
    setNewRadioMessage('');
  };

  const handleTriggerRadioCallout = () => {
    setIsBroadcastingRadio(true);
    soundFx.playRadioChirp();
    setTimeout(() => {
      setIsBroadcastingRadio(false);
      const now = new Date();
      setRadioLog(prev => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          time: now.toTimeString().split(' ')[0],
          sender: 'CAD AUTO-BROADCAST',
          message: `ALL UNITS: PRIORITY 1 INTERCEPT AUTHORIZED FOR EVENT ${currentIncident.cadEventNumber}. TARGET MOVING @ ${currentIncident.telemetrySnapshot.speed || 0} KM/H.`,
          channel: 'ALL-TAC'
        }
      ]);
    }, 1200);
  };

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 text-zinc-100 shadow-2xl flex flex-col gap-4">
      {/* Header CAD Terminal Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-black">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-white">
                Bengaluru City Police Namma 112 CAD Console
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600 text-white animate-pulse">
                CODE 3 PRIORITY 1
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400">
              Event #{currentIncident.cadEventNumber} • Bengaluru Central Precinct #1 Intercept Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerRadioCallout}
            disabled={isBroadcastingRadio}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isBroadcastingRadio ? 'Broadcasting...' : 'Radio Call-out (10-99)'}</span>
          </button>

          <button
            onClick={onExportDossier}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Export Evidence CAD Dossier</span>
          </button>
        </div>
      </div>

      {/* Incident Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 font-mono text-xs">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Protected Target</span>
          <span className="font-bold text-white text-sm">{currentIncident.victimName} (24 Y/O)</span>
          <span className="text-[11px] text-zinc-400 block">Height: 5'7" • Vehicle: Black Honda Civic</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Last Known GPS Beacon</span>
          <span className="font-bold text-emerald-400">
            {currentIncident.lastKnownCoords.lat.toFixed(5)}°N, {Math.abs(currentIncident.lastKnownCoords.lng).toFixed(5)}°E
          </span>
          <span className="text-[11px] text-zinc-400 block">
            Speed: {currentIncident.telemetrySnapshot.speed || 0} km/h • Heading: {currentIncident.telemetrySnapshot.heading || 0}°
          </span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Abduction Risk Probability</span>
          <span className="font-bold text-red-400 text-sm">
            {currentIncident.abductionProbability}% ({currentIncident.threatLevel})
          </span>
          <span className="text-[11px] text-zinc-400 block">
            Audio Distress: {currentIncident.audioDistressRecorded ? 'Captured (E2EE)' : 'Standby'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Chain of Custody SHA-256</span>
          <span className="text-[10px] text-zinc-300 truncate block font-mono text-emerald-400">
            {currentIncident.encryptedHash.slice(0, 20)}...
          </span>
          <span className="text-[10px] text-zinc-500">Cryptographically Signed</span>
        </div>
      </div>

      {/* Assigned Police Patrol Units */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Car className="w-4 h-4 text-blue-400" />
            Assigned Intercept Patrol Units ({policeUnits.length})
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">Live GPS Telemetry Synced</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {policeUnits.map(unit => (
            <div
              key={unit.unitId}
              className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white">{unit.callSign}</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-blue-900/60 text-blue-300 font-mono rounded">
                      {unit.unitId}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{unit.officerName}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                  unit.status === 'DISPATCHED'
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : unit.status === 'EN_ROUTE'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {unit.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-zinc-800">
                <span className="text-zinc-400">Distance: {unit.distanceKm} km</span>
                <span className="font-bold text-red-400">ETA: {unit.etaMinutes} mins</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Tactical Roadblock Action Buttons */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span className="text-xs font-bold text-zinc-200">Tactical Intercept Commands:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onDeployRoadblock('Northbound Bay Shore Freeway Intercept Point Alpha')}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 flex items-center gap-1"
          >
            Deploy Spike Strip Roadblock Alpha
          </button>
          <button
            onClick={() => onDeployRoadblock('Warehouse Choke Point Beta')}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 flex items-center gap-1"
          >
            Seal Perimeter Choke Point Beta
          </button>
        </div>
      </div>

      {/* Live Radio Chatter Log & Transceiver */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <RadioTower className="w-4 h-4 text-emerald-400" />
            Tactical Police Radio Frequency (TAC-1 SECURE)
          </span>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            LIVE AUDIO STREAM
          </span>
        </div>

        {/* Radio Message History */}
        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 max-h-36 overflow-y-auto space-y-2 font-mono text-xs">
          {radioLog.map(log => (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-[10px] text-zinc-500 flex-shrink-0">[{log.time}]</span>
              <span className="text-[10px] font-bold text-amber-400 flex-shrink-0">{log.sender}:</span>
              <span className="text-zinc-200">{log.message}</span>
            </div>
          ))}
        </div>

        {/* Radio Broadcast Input */}
        <form onSubmit={handleSendRadioBroadcast} className="flex gap-2">
          <input
            type="text"
            value={newRadioMessage}
            onChange={e => setNewRadioMessage(e.target.value)}
            placeholder="Type tactical CAD message or 10-code radio broadcast..."
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit</span>
          </button>
        </form>
      </div>
    </div>
  );
};
