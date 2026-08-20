import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  PhoneCall, 
  Timer, 
  Lock, 
  AlertTriangle, 
  Check, 
  X, 
  Radio,
  EyeOff,
  Flame,
  Clock
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface EmergencySOSBarProps {
  activeSos: boolean;
  onTriggerSos: () => void;
  onCancelSos: () => void;
  onTriggerPoliceAlert: () => void;
  onTriggerSilentDuress: (pin: string) => void;
  onAudioRecorded: (durationSeconds: number) => void;
}

export const EmergencySOSBar: React.FC<EmergencySOSBarProps> = ({
  activeSos,
  onTriggerSos,
  onCancelSos,
  onTriggerPoliceAlert,
  onTriggerSilentDuress,
  onAudioRecorded
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showDuressModal, setShowDuressModal] = useState<boolean>(false);
  const [duressInput, setDuressInput] = useState<string>('');
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [showFakeCallModal, setShowFakeCallModal] = useState<boolean>(false);
  const [fakeCallActive, setFakeCallActive] = useState<boolean>(false);
  const [fakeCallDuration, setFakeCallDuration] = useState<number>(0);
  const [showSafetyTimerModal, setShowSafetyTimerModal] = useState<boolean>(false);
  const [safetyTimerRemaining, setSafetyTimerRemaining] = useState<number | null>(null); // seconds
  const [safetyTimerTotal, setSafetyTimerTotal] = useState<number>(600); // 10 minutes default

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fakeCallIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle SOS Activation with 5-second abort countdown
  const handleInitiateSOS = () => {
    soundFx.triggerHaptic([300, 100, 300]);
    setCountdown(5);
  };

  // SOS Countdown tick
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      soundFx.playThreatWarning();
      const timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null);
      onTriggerSos();
      soundFx.toggleSiren(true);
      setIsSirenActive(true);
    }
  }, [countdown, onTriggerSos]);

  // Handle Immediate SOS Override
  const handleInstantSOS = () => {
    setCountdown(null);
    onTriggerSos();
    soundFx.toggleSiren(true);
    setIsSirenActive(true);
  };

  // Toggle Siren
  const handleToggleSiren = () => {
    const newState = soundFx.toggleSiren();
    setIsSirenActive(newState);
  };

  // Ambient Audio Recording Simulation
  const handleToggleAudioRecord = () => {
    if (!isRecordingAudio) {
      setIsRecordingAudio(true);
      setRecordingSeconds(0);
      soundFx.triggerHaptic([100]);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setIsRecordingAudio(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      onAudioRecorded(recordingSeconds);
      soundFx.playRadioChirp();
    }
  };

  // Silent Duress PIN Submit
  const handleDuressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duressInput.trim().length >= 4) {
      onTriggerSilentDuress(duressInput.trim());
      setShowDuressModal(false);
      setDuressInput('');
      soundFx.triggerHaptic([50, 50, 50]);
    }
  };

  // Safety Walk Check-in Timer countdown
  useEffect(() => {
    if (safetyTimerRemaining === null) return;

    if (safetyTimerRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setSafetyTimerRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            onTriggerSos(); // Auto trigger SOS when safety timer expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [safetyTimerRemaining, onTriggerSos]);

  // Fake Escort Call timer
  useEffect(() => {
    if (fakeCallActive) {
      fakeCallIntervalRef.current = setInterval(() => {
        setFakeCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (fakeCallIntervalRef.current) clearInterval(fakeCallIntervalRef.current);
      setFakeCallDuration(0);
    }

    return () => {
      if (fakeCallIntervalRef.current) clearInterval(fakeCallIntervalRef.current);
    };
  }, [fakeCallActive]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* SOS Active Emergency Strobe Banner */}
      {activeSos && (
        <div className="w-full bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse border-2 border-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white text-red-600 rounded-xl font-black flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-wide uppercase">
                EMERGENCY SOS ACTIVE • POLICE & GUARDIANS DISPATCHED
              </h3>
              <p className="text-xs font-mono opacity-90">
                Encrypted GPS breadcrumbs, speed telemetry & live ambient recording transmitted to Metro Precinct #1.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSiren}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                isSirenActive ? 'bg-zinc-950 text-white' : 'bg-red-800 text-white'
              }`}
            >
              {isSirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSirenActive ? 'Mute Siren' : 'Loud Siren'}</span>
            </button>

            <button
              id="cancel-sos-btn"
              onClick={onCancelSos}
              className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs border border-white/20 shadow"
            >
              Cancel Alarm (Safe)
            </button>
          </div>
        </div>
      )}

      {/* Countdown Interstitial Modal / Banner */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border-2 border-red-500 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center flex flex-col items-center gap-4 shadow-2xl shadow-red-900/60">
            <div className="w-24 h-24 rounded-full bg-red-600/20 border-4 border-red-500 flex items-center justify-center text-4xl font-black text-red-400 font-mono animate-ping">
              {countdown}
            </div>
            <h2 className="text-2xl font-black text-white">TRIGGERING EMERGENCY SOS</h2>
            <p className="text-xs text-zinc-300">
              Broadcasting 10-99 Abduction Alert & GPS telemetry to 911 Dispatch and all emergency contacts in {countdown}s.
            </p>

            <div className="w-full flex gap-3 mt-2">
              <button
                onClick={() => setCountdown(null)}
                className="flex-1 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm border border-zinc-700"
              >
                Cancel Trigger
              </button>
              <button
                onClick={handleInstantSOS}
                className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-lg shadow-red-700/60 animate-pulse"
              >
                Send NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Emergency Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* 1. Main SOS Button */}
        <button
          id="trigger-sos-btn"
          onClick={activeSos ? onCancelSos : handleInitiateSOS}
          className={`col-span-2 sm:col-span-1 lg:col-span-2 py-4 px-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all shadow-xl ${
            activeSos
              ? 'bg-zinc-900 hover:bg-zinc-850 border-2 border-red-500 text-red-400'
              : 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-700/50 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <div className="p-2 rounded-xl bg-white/20 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-lg font-black tracking-wider uppercase block">
              {activeSos ? 'ABORT SOS' : 'HOLD 1-TAP SOS'}
            </span>
            <span className="text-[10px] opacity-80 block font-normal">
              {activeSos ? 'Deactivate emergency beacon' : 'Instant Police 911 CAD Alert'}
            </span>
          </div>
        </button>

        {/* 2. Silent Duress PIN Trigger */}
        <button
          id="silent-duress-btn"
          onClick={() => setShowDuressModal(true)}
          className="p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 flex flex-col items-center justify-center text-center gap-1.5 transition-all hover:border-amber-500/50 group"
          title="Covertly trigger dispatch without screen indicator"
        >
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
            <EyeOff className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">Silent Duress PIN</span>
          <span className="text-[9px] text-zinc-400">Under Coercion</span>
        </button>

        {/* 3. Loud Deterrent Siren & Strobe */}
        <button
          id="siren-toggle-btn"
          onClick={handleToggleSiren}
          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-1.5 group ${
            isSirenActive
              ? 'bg-red-600 border-white text-white animate-pulse'
              : 'bg-zinc-900/90 hover:bg-zinc-850 border-zinc-800 text-zinc-200 hover:border-red-500/50'
          }`}
        >
          <div className={`p-2 rounded-xl ${isSirenActive ? 'bg-white text-red-600' : 'bg-red-500/10 text-red-400'}`}>
            <Volume2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">{isSirenActive ? 'Stop Siren' : 'Loud Siren'}</span>
          <span className="text-[9px] text-zinc-400">110dB Attacker Alarm</span>
        </button>

        {/* 4. Ambient Audio Recording */}
        <button
          id="ambient-audio-btn"
          onClick={handleToggleAudioRecord}
          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-1.5 group ${
            isRecordingAudio
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-zinc-900/90 hover:bg-zinc-850 border-zinc-800 text-zinc-200 hover:border-rose-500/50'
          }`}
        >
          <div className={`p-2 rounded-xl ${isRecordingAudio ? 'bg-rose-600 text-white' : 'bg-rose-500/10 text-rose-400'}`}>
            {isRecordingAudio ? <Mic className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
          </div>
          <span className="text-xs font-bold">
            {isRecordingAudio ? `Recording (${recordingSeconds}s)` : 'Audio Evidence'}
          </span>
          <span className="text-[9px] text-zinc-400">E2EE Mic Snippet</span>
        </button>

        {/* 5. Fake Incoming Escort Call */}
        <button
          id="fake-call-btn"
          onClick={() => {
            setShowFakeCallModal(true);
            setFakeCallActive(false);
          }}
          className="p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 flex flex-col items-center justify-center text-center gap-1.5 transition-all hover:border-sky-500/50 group"
        >
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20">
            <PhoneCall className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">Fake Call Escort</span>
          <span className="text-[9px] text-zinc-400">Deterrent Call</span>
        </button>

        {/* 6. Dead Man's Switch / Safety Timer */}
        <button
          id="safety-timer-btn"
          onClick={() => setShowSafetyTimerModal(true)}
          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-1.5 group ${
            safetyTimerRemaining !== null && safetyTimerRemaining > 0
              ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200'
              : 'bg-zinc-900/90 hover:bg-zinc-850 border-zinc-800 text-zinc-200 hover:border-indigo-500/50'
          }`}
        >
          <div className={`p-2 rounded-xl ${safetyTimerRemaining !== null ? 'bg-indigo-600 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">
            {safetyTimerRemaining !== null ? formatTime(safetyTimerRemaining) : 'Safety Timer'}
          </span>
          <span className="text-[9px] text-zinc-400">Dead Man Switch</span>
        </button>
      </div>

      {/* Modal: Silent Duress PIN Entry */}
      {showDuressModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Silent Duress PIN</h3>
              </div>
              <button
                onClick={() => setShowDuressModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              If an aggressor forces you to unlock or open your phone, enter your <strong>Silent Duress PIN (e.g. 9911)</strong>. The phone will display a normal decoy screen while secretly broadcasting your GPS to Police CAD.
            </p>

            <form onSubmit={handleDuressSubmit} className="flex flex-col gap-3">
              <input
                type="password"
                maxLength={6}
                value={duressInput}
                onChange={e => setDuressInput(e.target.value)}
                placeholder="Enter 4-6 digit duress code (e.g. 9911)"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white font-mono focus:outline-none focus:border-amber-500"
                autoFocus
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowDuressModal(false)}
                  className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-zinc-950 font-black text-xs shadow-lg shadow-amber-600/40"
                >
                  Confirm Duress PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Fake Incoming Escort Phone Call */}
      {showFakeCallModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center flex flex-col items-center gap-5 shadow-2xl">
            {!fakeCallActive ? (
              <>
                <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-3xl font-black text-sky-400 animate-pulse">
                  👮‍♂️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Officer Davis (Metro PD)</h3>
                  <p className="text-xs text-sky-400 font-mono mt-0.5">Incoming Call • Live Escort Active</p>
                </div>
                <p className="text-xs text-zinc-400">
                  Simulate an official incoming police or guardian phone call to make aggressors aware you are being actively monitored.
                </p>
                <div className="flex gap-4 w-full mt-2">
                  <button
                    onClick={() => setShowFakeCallModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-700/50"
                  >
                    <X className="w-4 h-4" /> Decline
                  </button>
                  <button
                    onClick={() => setFakeCallActive(true)}
                    className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-700/50 animate-bounce"
                  >
                    <PhoneCall className="w-4 h-4" /> Answer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500 flex items-center justify-center text-2xl">
                  📞
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Officer Davis (Metro PD)</h3>
                  <span className="text-xs font-mono text-emerald-400 block mt-1">
                    00:{fakeCallDuration.toString().padStart(2, '0')} • Call Connected
                  </span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-left text-xs text-zinc-300 space-y-1.5 w-full">
                  <p className="text-emerald-400 font-semibold">🎙️ Automated Escort Voice:</p>
                  <p className="italic text-[11px]">
                    "Hello Jane, this is Officer Davis on patrol. We have your live GPS location on 4th and Bryant. Our patrol car is 2 blocks away. Are you approaching the safe zone?"
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFakeCallActive(false);
                    setShowFakeCallModal(false);
                  }}
                  className="w-full py-3 rounded-2xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 rotate-135" /> End Call
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal: Safety Walk Check-In Timer */}
      {showSafetyTimerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                  <Timer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Dead Man's Safety Timer</h3>
              </div>
              <button
                onClick={() => setShowSafetyTimerModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Set a countdown timer for walking through high-risk areas. If you do not check in before the timer expires, <strong>Guardian AI automatically triggers Emergency SOS & Police Dispatch</strong>.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[5, 10, 20].map(mins => (
                <button
                  key={mins}
                  onClick={() => setSafetyTimerTotal(mins * 60)}
                  className={`py-2 rounded-xl text-xs font-semibold border ${
                    safetyTimerTotal === mins * 60
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {safetyTimerRemaining !== null ? (
                <button
                  onClick={() => {
                    setSafetyTimerRemaining(null);
                    setShowSafetyTimerModal(false);
                  }}
                  className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-200 font-bold text-xs"
                >
                  I Am Safe (Disable Timer)
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSafetyTimerRemaining(safetyTimerTotal);
                    setShowSafetyTimerModal(false);
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-700/50"
                >
                  Start Safety Countdown ({safetyTimerTotal / 60}m)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
