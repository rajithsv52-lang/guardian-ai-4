import React from 'react';
import { 
  AlertOctagon, 
  BrainCircuit, 
  Activity, 
  Volume2, 
  Wifi, 
  BatteryMedium, 
  HeartPulse, 
  Radio, 
  Compass, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { AIThreatAssessment, TelemetryPoint, ThreatLevel } from '../types/guardian';

interface ThreatStatusHUDProps {
  assessment: AIThreatAssessment;
  telemetry: TelemetryPoint;
  isEvaluating: boolean;
  onRefreshAssessment: () => void;
  onTriggerPoliceAlert: () => void;
}

export const ThreatStatusHUD: React.FC<ThreatStatusHUDProps> = ({
  assessment,
  telemetry,
  isEvaluating,
  onRefreshAssessment,
  onTriggerPoliceAlert
}) => {
  const getThreatColor = (level: ThreatLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          badge: 'bg-red-500 text-white',
          border: 'border-red-600',
          bg: 'bg-red-950/40',
          glow: 'shadow-red-900/40',
          text: 'text-red-400'
        };
      case 'HIGH':
        return {
          badge: 'bg-amber-500 text-zinc-950',
          border: 'border-amber-500/80',
          bg: 'bg-amber-950/30',
          glow: 'shadow-amber-900/30',
          text: 'text-amber-400'
        };
      case 'ELEVATED':
        return {
          badge: 'bg-yellow-500 text-zinc-950',
          border: 'border-yellow-500/60',
          bg: 'bg-yellow-950/20',
          glow: 'shadow-yellow-900/20',
          text: 'text-yellow-400'
        };
      default:
        return {
          badge: 'bg-emerald-500 text-zinc-950',
          border: 'border-emerald-500/50',
          bg: 'bg-emerald-950/20',
          glow: 'shadow-emerald-900/20',
          text: 'text-emerald-400'
        };
    }
  };

  const threatColor = getThreatColor(assessment.threatLevel);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Banner Threat Score Card */}
      <div className={`w-full rounded-2xl border ${threatColor.border} ${threatColor.bg} p-4 sm:p-5 shadow-xl transition-all duration-300 relative overflow-hidden backdrop-blur-md`}>
        {/* Subtle grid background accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Probability Gauge & Threat Severity */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Circular Abduction Probability Gauge */}
            <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-zinc-800 fill-none"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={`fill-none transition-all duration-1000 ${
                    assessment.abductionProbability >= 75
                      ? 'stroke-red-500'
                      : assessment.abductionProbability >= 45
                      ? 'stroke-amber-500'
                      : assessment.abductionProbability >= 20
                      ? 'stroke-yellow-500'
                      : 'stroke-emerald-400'
                  }`}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - assessment.abductionProbability / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                  {assessment.abductionProbability}%
                </span>
                <span className="text-[9px] uppercase font-bold text-zinc-400">Risk Prob</span>
              </div>
            </div>

            {/* Assessment Text & Headline */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${threatColor.badge}`}>
                  {assessment.threatLevel} THREAT
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                  Gemini 3.7 Flash Engine
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                {assessment.headline}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                {assessment.analysisSummary}
              </p>
            </div>
          </div>

          {/* Action & Re-eval Trigger */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
            <button
              id="refresh-ai-threat-btn"
              onClick={onRefreshAssessment}
              disabled={isEvaluating}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isEvaluating ? 'animate-spin' : ''}`} />
              <span>{isEvaluating ? 'Evaluating Telemetry...' : 'Re-evaluate AI'}</span>
            </button>

            {assessment.threatLevel === 'CRITICAL' && (
              <button
                id="hud-trigger-police-btn"
                onClick={onTriggerPoliceAlert}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-700/50 animate-pulse transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Trigger Police Intercept</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Live Multi-Sensor Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Struggle / Accelerometer */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
            <span>Struggle Index</span>
            <Activity className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold font-mono ${
              telemetry.deviceStruggleIndex > 60 ? 'text-red-400' : 'text-zinc-100'
            }`}>
              {telemetry.deviceStruggleIndex}
            </span>
            <span className="text-[10px] text-zinc-500">/ 100</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full ${telemetry.deviceStruggleIndex > 60 ? 'bg-red-500' : 'bg-emerald-400'}`}
              style={{ width: `${telemetry.deviceStruggleIndex}%` }}
            />
          </div>
        </div>

        {/* Ambient Acoustic dB */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
            <span>Acoustic Distress</span>
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold font-mono ${
              telemetry.ambientNoiseDb > 80 ? 'text-red-400 animate-pulse' : 'text-zinc-100'
            }`}>
              {telemetry.ambientNoiseDb}
            </span>
            <span className="text-[10px] text-zinc-500">dB</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full ${telemetry.ambientNoiseDb > 80 ? 'bg-red-500' : 'bg-amber-400'}`}
              style={{ width: `${Math.min(telemetry.ambientNoiseDb, 100)}%` }}
            />
          </div>
        </div>

        {/* Speed / Transit Mode */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
            <span>Velocity</span>
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold font-mono ${
              (telemetry.speed || 0) > 45 ? 'text-red-400' : 'text-zinc-100'
            }`}>
              {Math.round(telemetry.speed || 0)}
            </span>
            <span className="text-[10px] text-zinc-500">km/h</span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-2 block truncate">
            {(telemetry.speed || 0) > 40 ? '🚗 Forced Vehicle Motion' : '🚶 Pedestrian Transit'}
          </span>
        </div>

        {/* Heart Rate Vitals */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
            <span>Biometric Pulse</span>
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold font-mono ${
              telemetry.heartRateBpm > 120 ? 'text-rose-400 animate-pulse' : 'text-zinc-100'
            }`}>
              {telemetry.heartRateBpm}
            </span>
            <span className="text-[10px] text-zinc-500">BPM</span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-2 block truncate">
            {telemetry.heartRateBpm > 120 ? '⚠️ High Adrenaline Spike' : 'Normal Resting Vital'}
          </span>
        </div>

        {/* Cellular & Dead-Zone */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
            <span>Cellular Link</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold font-mono ${
              telemetry.signalBars <= 1 ? 'text-amber-400' : 'text-zinc-100'
            }`}>
              {telemetry.signalBars} / 4
            </span>
            <span className="text-[10px] text-zinc-500">Bars</span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-2 block truncate">
            {telemetry.isInDeadZone ? '📡 Satellite Mesh Active' : 'LTE / 5G Encrypted'}
          </span>
        </div>

        {/* Battery & Tamper Status */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
            <span>Device Battery</span>
            <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-zinc-100">
              {telemetry.batteryLevel}%
            </span>
            <span className="text-[10px] text-zinc-500">Opt.</span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-2 block truncate">
            Hardware Tamper Lock ON
          </span>
        </div>
      </div>

      {/* Threat Vectors Breakdown & Tactical Directives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Threat Vectors */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              Detected Threat Vectors ({assessment.threatVectors.length})
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">Real-time sensor feed</span>
          </div>

          <div className="flex flex-col gap-2">
            {assessment.threatVectors.length === 0 ? (
              <div className="text-xs text-zinc-500 italic py-3 text-center flex items-center justify-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                No anomalous threat signatures detected in telemetry stream.
              </div>
            ) : (
              assessment.threatVectors.map(vec => (
                <div
                  key={vec.id}
                  className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                    vec.severity === 'CRITICAL'
                      ? 'bg-red-950/30 border-red-800/80 text-red-200'
                      : vec.severity === 'HIGH'
                      ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                      : 'bg-zinc-800/60 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 mt-0.5 ${
                    vec.severity === 'CRITICAL'
                      ? 'bg-red-600 text-white'
                      : vec.severity === 'HIGH'
                      ? 'bg-amber-600 text-white'
                      : 'bg-zinc-700 text-zinc-200'
                  }`}>
                    {vec.severity}
                  </span>
                  <div>
                    <span className="font-bold text-zinc-100 block">{vec.category.replace('_', ' ')}</span>
                    <p className="text-[11px] opacity-90 leading-tight mt-0.5">{vec.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tactical Directives & Predictive Intercept Corridors */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-400" />
                Predictive Intercept Corridors
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">Law enforcement vector</span>
            </div>

            <div className="flex flex-col gap-2">
              {assessment.predictedIntercepts.map((intercept, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800 text-xs flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-zinc-200 text-xs">{intercept.corridorName}</div>
                    <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                      GPS: {intercept.lat.toFixed(4)}°N, {intercept.lng.toFixed(4)}°W
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-black text-red-400 font-mono">ETA {intercept.etaMinutes}m</span>
                    <div className="text-[9px] text-zinc-500 font-mono">Risk {intercept.riskScore}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Directives Bullet List */}
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Tactical Directives</div>
            <ul className="text-[11px] text-zinc-300 space-y-1 list-disc list-inside">
              {assessment.tacticalDirectives.map((directive, idx) => (
                <li key={idx} className="leading-tight">{directive}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
