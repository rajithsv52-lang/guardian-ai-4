import React, { useState } from 'react';
import { 
  RadioTower, 
  Map, 
  Download, 
  Check, 
  Compass, 
  Shield, 
  Smartphone, 
  Share2, 
  Copy, 
  X, 
  HardDrive, 
  Radio,
  CheckCircle2
} from 'lucide-react';
import { OfflineRegion, Coordinates, SafeHaven } from '../types/guardian';
import { INITIAL_OFFLINE_REGIONS, MOCK_SAFE_HAVENS, calculateDistanceMeters, calculateBearing, bearingToCardinal } from '../utils/offlineMap';
import { generateMeshSatellitePacket } from '../utils/crypto';

interface OfflineMeshModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: Coordinates;
  threatLevel: string;
}

export const OfflineMeshModal: React.FC<OfflineMeshModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  threatLevel
}) => {
  const [regions, setRegions] = useState<OfflineRegion[]>(INITIAL_OFFLINE_REGIONS);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedMesh, setCopiedMesh] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadRegion = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setRegions(prev =>
        prev.map(r => (r.id === id ? { ...r, downloaded: true, lastUpdated: 'Just now' } : r))
      );
      setDownloadingId(null);
    }, 1800);
  };

  const meshPacket = generateMeshSatellitePacket(
    currentLocation,
    threatLevel,
    'VICTIM_JANE_DOE_99'
  );

  const handleCopyMesh = () => {
    navigator.clipboard.writeText(meshPacket);
    setCopiedMesh(true);
    setTimeout(() => setCopiedMesh(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <RadioTower className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Offline Maps & Satellite Mesh Beacon
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
                  OFFLINE SURVIVAL READY
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Zero-cellular connectivity toolkit, offline vector caching & 140-char satellite emergency beacon
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs text-zinc-300">
          {/* Section 1: Satellite & SMS 140-Char Emergency Beacon */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  Satellite / SMS Emergency Mesh Packet
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">140-char compact encoding</span>
            </div>

            <p className="text-[11px] text-zinc-300">
              When 4G/5G drops to 0 bars, this micro-payload transmits via direct satellite link (e.g. Apple Emergency SOS / Garmin inReach) or single SMS burst:
            </p>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 flex items-center justify-between gap-3">
              <span className="break-all">{meshPacket}</span>
              <button
                onClick={handleCopyMesh}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1 flex-shrink-0 transition-colors"
              >
                {copiedMesh ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMesh ? 'Copied' : 'Copy Packet'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Downloadable Offline Regional Map Packs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  Pre-Cached Offline Map Regions
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">IndexedDB Storage Synced</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {regions.map(region => (
                <div
                  key={region.id}
                  className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-white text-xs block">{region.name}</span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {region.sizeMb} MB • {region.tileCount} Tiles • {region.safeHavensCount} Safe Havens
                      </span>
                    </div>
                    {region.downloaded ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> CACHED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDownloadRegion(region.id)}
                        disabled={downloadingId === region.id}
                        className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 flex-shrink-0 transition-colors disabled:opacity-50"
                      >
                        <Download className={`w-3.5 h-3.5 ${downloadingId === region.id ? 'animate-bounce' : ''}`} />
                        <span>{downloadingId === region.id ? 'Caching...' : 'Download'}</span>
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Status: {region.downloaded ? `Updated: ${region.lastUpdated}` : 'Not stored offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Offline Safe Haven Distances & Bearings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                Offline Safe Haven Proximity Directory
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MOCK_SAFE_HAVENS.map(haven => {
                const dist = calculateDistanceMeters(
                  currentLocation.lat,
                  currentLocation.lng,
                  haven.lat,
                  haven.lng
                );
                const bearing = calculateBearing(
                  currentLocation.lat,
                  currentLocation.lng,
                  haven.lat,
                  haven.lng
                );
                const cardinal = bearingToCardinal(bearing);

                return (
                  <div
                    key={haven.id}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-zinc-100 block truncate">{haven.name}</span>
                      <span className="text-[10px] text-zinc-400">{haven.address}</span>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono">
                      <span className="font-bold text-emerald-400">{dist}m</span>
                      <span className="text-[10px] text-zinc-400 block">{cardinal} ({bearing}°)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
