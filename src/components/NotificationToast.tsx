import React from 'react';
import { ShieldAlert, BellRing, X, ExternalLink, Radio } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

export interface PushAlertMessage {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'INFO';
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationToastProps {
  alerts: PushAlertMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  alerts,
  onDismiss
}) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {alerts.slice(-3).map(alert => (
        <div
          key={alert.id}
          className={`pointer-events-auto rounded-2xl p-3.5 shadow-2xl border transition-all duration-300 transform translate-y-0 backdrop-blur-md flex items-start gap-3 ${
            alert.severity === 'CRITICAL'
              ? 'bg-red-950/95 border-red-500 text-white shadow-red-950/60 animate-bounce'
              : alert.severity === 'HIGH'
              ? 'bg-amber-950/95 border-amber-500 text-white shadow-amber-950/40'
              : 'bg-zinc-900/95 border-zinc-700 text-zinc-100 shadow-black/50'
          }`}
        >
          <div className={`p-2 rounded-xl flex-shrink-0 ${
            alert.severity === 'CRITICAL'
              ? 'bg-red-600 text-white animate-pulse'
              : alert.severity === 'HIGH'
              ? 'bg-amber-500 text-zinc-950'
              : 'bg-zinc-800 text-sky-400'
          }`}>
            <BellRing className="w-4 h-4" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs leading-snug">{alert.title}</span>
              <span className="text-[10px] font-mono opacity-70">{alert.timestamp}</span>
            </div>
            <p className="text-[11px] opacity-90 mt-1 leading-tight">{alert.body}</p>

            {alert.actionLabel && (
              <button
                onClick={() => {
                  if (alert.onAction) alert.onAction();
                  onDismiss(alert.id);
                }}
                className="mt-2 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center gap-1"
              >
                <span>{alert.actionLabel}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => onDismiss(alert.id)}
            className="text-white/60 hover:text-white p-1 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
