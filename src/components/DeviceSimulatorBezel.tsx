import React from 'react';
import { DeviceViewMode } from '../types/guardian';

interface DeviceSimulatorBezelProps {
  viewMode: DeviceViewMode;
  children: React.ReactNode;
}

export const DeviceSimulatorBezel: React.FC<DeviceSimulatorBezelProps> = ({
  viewMode,
  children
}) => {
  if (viewMode === 'RESPONSIVE') {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="w-full flex justify-center py-6 px-2 bg-zinc-950/80 min-h-[calc(100vh-60px)]">
      {/* iPhone 16 Pro Bezel Frame */}
      <div className="relative w-full max-w-[430px] rounded-[52px] p-3 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-[0_0_60px_rgba(0,0,0,0.8)] border-4 border-zinc-700 ring-1 ring-white/10">
        {/* Outer buttons (Volume & Action button) */}
        <div className="absolute -left-5 top-28 w-1.5 h-12 bg-zinc-600 rounded-l-md" />
        <div className="absolute -left-5 top-44 w-1.5 h-12 bg-zinc-600 rounded-l-md" />
        <div className="absolute -right-5 top-32 w-1.5 h-16 bg-zinc-600 rounded-r-md" />

        {/* Screen inner wrapper */}
        <div className="relative w-full rounded-[42px] overflow-hidden bg-black flex flex-col border border-zinc-800">
          {/* iOS Dynamic Island */}
          <div className="w-full bg-black pt-3 pb-1 flex items-center justify-between px-7 z-50 select-none">
            <span className="text-[11px] font-semibold text-white font-mono">9:41</span>
            {/* Dynamic Island pill */}
            <div className="h-6 w-28 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-between px-2.5 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[9px] font-mono text-red-400 font-bold">SOS ACTIVE</span>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            </div>
            <div className="flex items-center gap-1 text-[11px] text-white">
              <span>5G</span>
              <span className="w-4 h-2.5 border border-white rounded-sm p-0.5 flex items-center">
                <span className="w-full h-full bg-white rounded-xs"></span>
              </span>
            </div>
          </div>

          {/* Child content inside frame */}
          <div className="w-full max-h-[820px] overflow-y-auto custom-scrollbar">
            {children}
          </div>

          {/* iOS Home Indicator bar */}
          <div className="w-full bg-black py-2 flex justify-center z-50">
            <div className="w-32 h-1 bg-zinc-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
