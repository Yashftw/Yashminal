/* Tiny Web Audio synth for the retro-PC sounds. Nothing is loaded from disk:
   every hum, beep, seek click and glitch zap is generated on the fly.
   Browsers refuse audio until a user gesture, so `unlock()` must be called from
   a click handler (the boot screen's power button does this). */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let muted = false;
const listeners = new Set<() => void>();

const MASTER_GAIN = 0.55;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER_GAIN;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noise(c: AudioContext): AudioBuffer {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  vol: number,
  when = 0,
  slideTo?: number,
) {
  const c = ensure();
  if (!c || !master) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function burst(dur: number, vol: number, filter: BiquadFilterType, freq: number, q = 1, when = 0) {
  const c = ensure();
  if (!c || !master) return;
  const t = c.currentTime + when;
  const src = c.createBufferSource();
  src.buffer = noise(c);
  const f = c.createBiquadFilter();
  f.type = filter;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t, Math.random());
  src.stop(t + dur + 0.02);
}

export const sfx = {
  unlock() {
    ensure();
  },

  isMuted: () => muted,
  setMuted(m: boolean) {
    muted = m;
    if (master && ctx) master.gain.setTargetAtTime(m ? 0 : MASTER_GAIN, ctx.currentTime, 0.02);
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },

  /** Power-switch thunk plus the relay click. */
  powerOn() {
    tone(70, 0.5, "sine", 0.7, 0, 28);
    burst(0.06, 0.5, "lowpass", 900);
    burst(0.03, 0.4, "highpass", 3000, 1, 0.09);
  },

  /** Mains hum + fan. Returns a function that fades it out. */
  startHum(): () => void {
    const c = ensure();
    if (!c || !master) return () => {};
    const out = c.createGain();
    out.gain.setValueAtTime(0.0001, c.currentTime);
    out.gain.exponentialRampToValueAtTime(1, c.currentTime + 0.8);
    out.connect(master);

    const mk = (f: number, type: OscillatorType, vol: number, lp?: number) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.value = vol;
      if (lp) {
        const filt = c.createBiquadFilter();
        filt.type = "lowpass";
        filt.frequency.value = lp;
        o.connect(filt).connect(g);
      } else o.connect(g);
      g.connect(out);
      o.start();
      return o;
    };
    const oscs = [mk(50, "sawtooth", 0.07, 220), mk(100, "sine", 0.05), mk(150, "triangle", 0.02, 400)];

    const fan = c.createBufferSource();
    fan.buffer = noise(c);
    fan.loop = true;
    const ff = c.createBiquadFilter();
    ff.type = "lowpass";
    ff.frequency.value = 420;
    const fg = c.createGain();
    fg.gain.value = 0.09;
    fan.connect(ff).connect(fg).connect(out);
    fan.start();

    return () => {
      const t = c.currentTime;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      window.setTimeout(() => {
        oscs.forEach((o) => o.stop());
        fan.stop();
      }, 800);
    };
  },

  /** The high-pitched CRT flyback whine as the tube charges. */
  whine(dur = 1.6) {
    tone(11800, dur, "sine", 0.018, 0, 12600);
  },

  staticBurst(dur = 0.9, vol = 0.35) {
    burst(dur, vol, "highpass", 1500, 0.7);
  },

  beep(freq = 1000, dur = 0.14) {
    tone(freq, dur, "square", 0.12);
  },

  /** Hard-drive seek click. */
  seek() {
    const f = 1500 + Math.random() * 1800;
    burst(0.025 + Math.random() * 0.03, 0.35, "bandpass", f, 4);
  },

  /** Window-open glitch zap. */
  zap() {
    burst(0.18, 0.4, "bandpass", 2400, 1.5);
    tone(1500, 0.16, "square", 0.07, 0, 90);
    burst(0.05, 0.3, "highpass", 4000, 1, 0.12);
  },

  close() {
    tone(500, 0.12, "square", 0.07, 0, 120);
    burst(0.07, 0.25, "bandpass", 1200, 2);
  },

  click() {
    burst(0.02, 0.3, "highpass", 2500);
  },

  chime() {
    tone(660, 0.16, "square", 0.1);
    tone(990, 0.28, "square", 0.1, 0.14);
  },

  shutdown() {
    tone(600, 0.7, "sawtooth", 0.1, 0, 40);
    burst(0.5, 0.25, "lowpass", 600);
  },
};
