/**
 * Web Audio API synthesizer for Emergency Siren, Police Radio Squelch & Haptic Feedback
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private sirenOsc1: OscillatorNode | null = null;
  private sirenOsc2: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenLfo: OscillatorNode | null = null;
  private isSirenPlaying = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play Police / CAD radio dispatch beep (short two-tone tactical chirp)
  playRadioChirp() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Tone 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.08); // E6
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Squelch static burst
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, now + 0.12);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      whiteNoise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      whiteNoise.start(now + 0.12);
      whiteNoise.stop(now + 0.17);
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  }

  // Play Threat Warning Alert (urgent ping)
  playThreatWarning() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.setValueAtTime(990, now + 0.1);
      osc.frequency.setValueAtTime(660, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  }

  // Toggle High-Decibel Emergency Deterrent Siren & Strobe Audio
  toggleSiren(forceState?: boolean): boolean {
    try {
      this.initContext();
      if (!this.ctx) return false;

      const shouldPlay = forceState !== undefined ? forceState : !this.isSirenPlaying;

      if (!shouldPlay && this.isSirenPlaying) {
        if (this.sirenOsc1) {
          this.sirenOsc1.stop();
          this.sirenOsc1.disconnect();
        }
        if (this.sirenOsc2) {
          this.sirenOsc2.stop();
          this.sirenOsc2.disconnect();
        }
        if (this.sirenLfo) {
          this.sirenLfo.stop();
          this.sirenLfo.disconnect();
        }
        this.isSirenPlaying = false;
        return false;
      }

      if (shouldPlay && !this.isSirenPlaying) {
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(750, now);
        osc2.frequency.setValueAtTime(755, now);

        // LFO modulates frequency between 600Hz and 1200Hz
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(1.8, now); // 1.8 Hz sweep
        lfoGain.gain.setValueAtTime(350, now);

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        gain.gain.setValueAtTime(0.3, now);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        lfo.start(now);

        this.sirenOsc1 = osc1;
        this.sirenOsc2 = osc2;
        this.sirenLfo = lfo;
        this.sirenGain = gain;
        this.isSirenPlaying = true;
        return true;
      }
    } catch (e) {
      console.warn('Siren toggle error:', e);
    }
    return false;
  }

  isSirenActive(): boolean {
    return this.isSirenPlaying;
  }

  // Trigger Device Vibration / Haptic
  triggerHaptic(pattern: number[] = [200, 100, 200, 100, 400]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
}

export const soundFx = new AudioSynthesizer();
