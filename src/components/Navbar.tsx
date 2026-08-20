import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Radio, 
  MapPin, 
  Smartphone, 
  Monitor, 
  Sun, 
  Moon, 
  Flame, 
  Activity, 
  UserCheck, 
  RadioTower, 
  BellRing,
  Presentation
} from 'lucide-react';
import { UserRole, DeviceViewMode, ThreatLevel } from '../types/guardian';

interface NavbarProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  viewMode: DeviceViewMode;
  onViewModeChange: (mode: DeviceViewMode) => void;
  themeMode: 'tactical-dark' | 'emergency-red' | 'high-contrast-light';
  onThemeModeChange: (theme: 'tactical-dark' | 'emergency-red' | 'high-contrast-light') => void;
  threatLevel: ThreatLevel;
  activeSos: boolean;
  gpsActive: boolean;
  onOpenVault: () => void;
  onOpenOfflineMesh: () => void;
  onOpenPresentation?: () => void;
  unreadAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  onRoleChange,
  viewMode,
  onViewModeChange,
  themeMode,
  onThemeModeChange,
  threatLevel,
  activeSos,
  gpsActive,
  onOpenVault,
  onOpenOfflineMesh,
  onOpenPresentation,
  unreadAlertCount
}) => {
  return (
    <header className={`w-full border-b transition-colors duration-300 ${
      activeSos
        ? 'bg-red-950/95 border-red-600 text-white shadow-lg shadow-red-900/40 animate-pulse'
        : themeMode === 'high-contrast-light'
        ? 'bg-white border-zinc-300 text-zinc-900 shadow-sm'
        : 'bg-zinc-950/90 border-zinc-800 text-zinc-100 backdrop-blur-md'
    } sticky top-0 z-40 px-4 py-2.5`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Live Telemetry Badge */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center font-black ${
            activeSos 
              ? 'bg-red-600 text-white animate-bounce' 
              : threatLevel === 'CRITICAL'
              ? 'bg-red-600/90 text-white animate-pulse'
              : threatLevel === 'HIGH'
              ? 'bg-amber-500 text-zinc-950'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base sm:text-lg uppercase flex items-center gap-1.5">
                Guardian<span className="text-red-500">AI</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                threatLevel === 'CRITICAL'
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                  : threatLevel === 'HIGH'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : threatLevel === 'ELEVATED'
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                  : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
              }`}>
                {threatLevel} THREAT
              </span>
            </div>
            <p className="text-[11px] opacity-70 flex items-center gap-2 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {gpsActive ? 'GPS ACTIVE (37.7749°N, 122.4194°W)' : 'GPS STANDBY'}
              <span className="hidden sm:inline">• E2EE 256-BIT</span>
            </p>
          </div>
        </div>

        {/* Center Quick Role Selector */}
        <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            id="role-protected-user-btn"
            onClick={() => onRoleChange('PROTECTED_USER')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              userRole === 'PROTECTED_USER'
                ? 'bg-red-600 text-white shadow font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Victim / User</span>
          </button>

          <button
            id="role-guardian-btn"
            onClick={() => onRoleChange('FAMILY_GUARDIAN')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              userRole === 'FAMILY_GUARDIAN'
                ? 'bg-blue-600 text-white shadow font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Family Guardian</span>
          </button>

          <button
            id="role-dispatcher-btn"
            onClick={() => onRoleChange('POLICE_DISPATCHER')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              userRole === 'POLICE_DISPATCHER'
                ? 'bg-amber-600 text-white shadow font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Police Dispatcher</span>
          </button>
        </div>

        {/* Right Tools & View Controls */}
        <div className="flex items-center gap-2">
          {/* Feature PPT Presentation Deck Button */}
          {onOpenPresentation && (
            <button
              id="open-presentation-btn"
              onClick={onOpenPresentation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 shadow-md shadow-emerald-950/60 transition-all transform active:scale-95"
              title="Open Formal Feature Presentation (PPT Deck with Visuals)"
            >
              <Presentation className="w-3.5 h-3.5 text-emerald-100" />
              <span>Features PPT</span>
            </button>
          )}

          {/* E2EE Vault Button */}
          <button
            id="open-vault-btn"
            onClick={onOpenVault}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
            title="End-to-End Encrypted Vault & Evidence Chain"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">E2EE Vault</span>
          </button>

          {/* Offline Mesh & Map Cache */}
          <button
            id="open-offline-mesh-btn"
            onClick={onOpenOfflineMesh}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
            title="Offline Vector Maps & Mesh Satellite Packet"
          >
            <RadioTower className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Offline & Mesh</span>
          </button>

          {/* Hardware View Simulator Toggle */}
          <div className="hidden lg:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => onViewModeChange('RESPONSIVE')}
              className={`p-1.5 rounded ${viewMode === 'RESPONSIVE' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
              title="Full Screen View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('IOS_PHONE')}
              className={`p-1.5 rounded ${viewMode === 'IOS_PHONE' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
              title="iPhone 16 Mockup Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* High Contrast Theme Switcher */}
          <button
            id="theme-toggle-btn"
            onClick={() => {
              if (themeMode === 'tactical-dark') onThemeModeChange('emergency-red');
              else if (themeMode === 'emergency-red') onThemeModeChange('high-contrast-light');
              else onThemeModeChange('tactical-dark');
            }}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs flex items-center gap-1"
            title="Toggle High-Contrast Modes"
          >
            {themeMode === 'tactical-dark' && <Moon className="w-4 h-4 text-indigo-400" />}
            {themeMode === 'emergency-red' && <Flame className="w-4 h-4 text-red-500" />}
            {themeMode === 'high-contrast-light' && <Sun className="w-4 h-4 text-amber-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};
