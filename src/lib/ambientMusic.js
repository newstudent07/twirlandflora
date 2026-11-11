/**
 * AmbientGardenEngine
 *
 * Pure Web Audio API multi-track generative music engine crafted for Twirl & Flora.
 * Features four distinct, zero-dependency botanical soundscapes with lookahead
 * Web Audio scheduling, smooth session cross-fades, warm hall convolution reverb,
 * stereo tape delay, and gentle dynamic mastering:
 *   1. Atelier Waltz       — Expressive 3/4 French-inspired solo felt piano waltz
 *   2. Petal Lo-Fi         — Warm Rhodes chords, brushed chillhop beat & subtle vinyl warmth
 *   3. Sunlit Bossa        — Nylon-string acoustic bossa nova guitar, cabasa & singing flute
 *   4. Rainy Conservatory  — Gentle botanical rainfall bed, lush pads & glass harp arpeggios
 */

export const MUSIC_TRACKS = [
  {
    id: 'waltz',
    title: 'Atelier Waltz',
    subtitle: 'Solo Felt Piano',
    stepDuration: 0.35,
  },
  {
    id: 'lofi',
    title: 'Petal Lo-Fi',
    subtitle: 'Warm Keys & Beat',
    stepDuration: 0.202,
  },
  {
    id: 'bossa',
    title: 'Sunlit Bossa',
    subtitle: 'Nylon Acoustic',
    stepDuration: 0.147,
  },
  {
    id: 'rainy',
    title: 'Rainy Conservatory',
    subtitle: 'Rain & Glass Harp',
    stepDuration: 0.42,
  },
];

export const DEFAULT_TRACK_ID = MUSIC_TRACKS[0].id;

const TRACK_MAP = new Map(MUSIC_TRACKS.map((track) => [track.id, track]));

// ============================================================================
// 1. Atelier Waltz Data (Em9 -> Cmaj9 -> Am9 -> D9 -> Gmaj7 -> Cmaj7 -> F#m7b5 -> B7)
// ============================================================================
const WALTZ_CHORDS = [
  { bass: 82.41, notes: [196.0, 246.94, 293.66, 369.99] }, // Em9
  { bass: 130.81, notes: [196.0, 246.94, 293.66, 329.63] }, // Cmaj9
  { bass: 110.0, notes: [196.0, 246.94, 261.63, 329.63] }, // Am9
  {
    bass: 146.83,
    notes: [196.0, 220.0, 261.63, 329.63],
    resolveNotes: [185.0, 220.0, 261.63, 329.63], // D9sus4 -> D9
  },
  { bass: 98.0, notes: [185.0, 246.94, 293.66] }, // Gmaj7
  { bass: 130.81, notes: [196.0, 246.94, 329.63] }, // Cmaj7
  { bass: 92.5, notes: [164.81, 220.0, 261.63] }, // F#m7b5
  { bass: 123.47, notes: [185.0, 220.0, 311.13] }, // B7
];

// 16 bars × 6 eighth-notes = 96 steps (Phrase A + Phrase B)
const WALTZ_MELODY = [
  // Phrase A (bars 0..7)
  [493.88, null, 659.25, 739.99, 783.99, null],
  [739.99, null, 659.25, null, 587.33, null],
  [523.25, null, 587.33, null, 659.25, 493.88],
  [440.0, null, 392.0, null, 369.99, null],
  [493.88, null, 587.33, null, 783.99, 739.99],
  [659.25, null, 587.33, null, 523.25, 493.88],
  [440.0, null, 523.25, null, 659.25, null],
  [622.25, null, null, null, 493.88, 587.33],
  // Phrase B (bars 8..15)
  [783.99, null, 739.99, null, 659.25, 587.33],
  [659.25, null, 587.33, null, 493.88, null],
  [523.25, null, 659.25, 739.99, 783.99, null],
  [739.99, null, 587.33, null, 440.0, null],
  [493.88, null, 587.33, 659.25, 739.99, null],
  [659.25, null, 587.33, null, 523.25, 440.0],
  [392.0, 440.0, 493.88, null, 523.25, null],
  [493.88, null, 369.99, null, null, null],
];

// ============================================================================
// 2. Petal Lo-Fi Data (Bm9 -> Em9 -> Amaj9 -> F#m7 / F#7)
// ============================================================================
const LOFI_CHORDS = [
  { bass: 61.74, notes: [220.0, 277.18, 293.66, 369.99] }, // Bm9
  { bass: 82.41, notes: [196.0, 246.94, 293.66, 369.99] }, // Em9
  { bass: 55.0, notes: [207.65, 246.94, 277.18, 329.63] }, // Amaj9
  {
    bass: 92.5,
    notes: [164.81, 220.0, 277.18, 329.63], // F#m7
    turnaroundNotes: [164.81, 233.08, 277.18, 329.63], // F#7
  },
];

// Sparse sleepy Rhodes melody hits across 8 bars (stepInBar -> freq)
const LOFI_MELODY_MAP = {
  0: { 2: 554.37, 6: 493.88, 12: 440.0 },
  1: { 0: 369.99, 10: 440.0, 14: 493.88 },
  2: { 0: 554.37, 6: 659.25, 12: 554.37 },
  3: { 2: 493.88, 8: 440.0 },
  4: { 2: 739.99, 6: 659.25, 10: 554.37, 14: 493.88 },
  5: { 2: 440.0, 8: 493.88, 12: 554.37 },
  6: { 0: 659.25, 6: 554.37, 12: 493.88 },
  7: { 0: 440.0, 6: 369.99, 12: 415.3 },
};

// ============================================================================
// 3. Sunlit Bossa Data (Fmaj7 -> G13 -> Gm7 -> C9)
// ============================================================================
const BOSSA_CHORDS = [
  { rootBass: 87.31, altBass: 130.81, notes: [220.0, 261.63, 329.63, 392.0] }, // Fmaj7
  { rootBass: 98.0, altBass: 146.83, notes: [246.94, 293.66, 329.63, 349.23] }, // G13
  { rootBass: 98.0, altBass: 146.83, notes: [233.08, 293.66, 349.23, 440.0] }, // Gm7
  { rootBass: 130.81, altBass: 98.0, notes: [233.08, 293.66, 329.63, 392.0] }, // C9
];

const BOSSA_CLAVE_STEPS = new Set([0, 3, 6, 10, 12]);

// Singing warm flute melody across 8 bars (stepInBar -> { freq, dur })
const BOSSA_MELODY_MAP = {
  0: { 2: { f: 440.0, d: 0.45 }, 6: { f: 523.25, d: 0.45 }, 10: { f: 587.33, d: 0.72 } },
  1: { 0: { f: 523.25, d: 0.55 }, 6: { f: 493.88, d: 0.45 }, 12: { f: 440.0, d: 0.6 } },
  2: { 2: { f: 466.16, d: 0.45 }, 6: { f: 440.0, d: 0.45 }, 10: { f: 392.0, d: 0.7 } },
  3: { 0: { f: 349.23, d: 0.78 }, 10: { f: 392.0, d: 0.42 }, 14: { f: 440.0, d: 0.38 } },
  4: { 2: { f: 523.25, d: 0.48 }, 6: { f: 587.33, d: 0.48 }, 10: { f: 659.25, d: 0.8 } },
  5: { 2: { f: 587.33, d: 0.52 }, 8: { f: 523.25, d: 0.45 }, 12: { f: 493.88, d: 0.52 } },
  6: { 0: { f: 466.16, d: 0.55 }, 6: { f: 440.0, d: 0.45 }, 10: { f: 392.0, d: 0.58 } },
  7: { 0: { f: 349.23, d: 1.05 } },
};

// ============================================================================
// 4. Rainy Conservatory Data (Ebmaj9 -> Cm11 -> Abmaj9 -> Bb13sus4)
// ============================================================================
const RAINY_CHORDS = [
  {
    pad: [155.56, 233.08, 293.66, 349.23, 392.0], // Ebmaj9
    arp: [311.13, 392.0, 466.16, 587.33, 698.46, 783.99],
  },
  {
    pad: [130.81, 196.0, 233.08, 293.66, 349.23], // Cm11
    arp: [261.63, 311.13, 392.0, 466.16, 587.33, 698.46],
  },
  {
    pad: [103.83, 207.65, 246.94, 311.13, 392.0], // Abmaj9 (enharmonic warm voicing)
    arp: [311.13, 392.0, 466.16, 523.25, 622.25, 783.99],
  },
  {
    pad: [116.54, 174.61, 233.08, 311.13, 349.23], // Bb13sus4
    arp: [293.66, 349.23, 466.16, 523.25, 622.25, 698.46],
  },
];

// Normalize Abmaj9 pad third strictly to C4 (261.63) for pure Abmaj9 warmth
RAINY_CHORDS[2].pad = [103.83, 207.65, 261.63, 311.13, 392.0];

const RAINY_ARP_PATTERN = [0, 2, 4, 5, 3, 2, 1, 3, 4, 5, 3, 1];

// ============================================================================
// Buffer Helpers
// ============================================================================
function createHallImpulseResponse(ctx, durationSeconds = 2.8) {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * durationSeconds);
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const preDelaySamples = Math.floor(sampleRate * 0.028);

  for (let ch = 0; ch < 2; ch += 1) {
    const channelData = impulse.getChannelData(ch);
    let lp1 = 0;
    let lp2 = 0;
    const damp = 0.72;

    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      lp1 = lp1 * damp + white * (1 - damp);
      lp2 = lp2 * damp + lp1 * (1 - damp);

      const t = i / sampleRate;
      const preFade = i < preDelaySamples ? Math.pow(i / preDelaySamples, 2) : 1;
      const decay = Math.pow(1 - i / length, 2.3) * Math.exp(-t * 1.45);

      channelData[i] = lp2 * preFade * decay * 0.56;
    }
  }

  return impulse;
}

function createPinkNoiseBuffer(ctx, durationSeconds = 4) {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(2, length, sampleRate);

  for (let ch = 0; ch < 2; ch += 1) {
    const out = buffer.getChannelData(ch);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;

    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      const sample = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
      b6 = white * 0.115926;
      out[i] = Math.max(-1, Math.min(1, sample));
    }

    // Crossfade last 250ms into start for seamless looping
    const fadeSamples = Math.floor(sampleRate * 0.25);
    for (let i = 0; i < fadeSamples; i += 1) {
      const alpha = i / fadeSamples;
      const tailIdx = length - fadeSamples + i;
      out[i] = out[i] * alpha + out[tailIdx] * (1 - alpha);
    }
  }

  return buffer;
}

// ============================================================================
// Engine Implementation
// ============================================================================
export class AmbientGardenEngine {
  constructor(initialVolume = 0.65, initialTrackId = DEFAULT_TRACK_ID) {
    this.ctx = null;
    this.masterGain = null;
    this.dryBus = null;
    this.reverbSend = null;
    this.delaySend = null;
    this.pinkNoiseBuffer = null;

    this.volume = Math.min(1, Math.max(0, initialVolume));
    this.trackId = TRACK_MAP.has(initialTrackId) ? initialTrackId : DEFAULT_TRACK_ID;
    this.isPlaying = false;
    this.isDestroyed = false;

    this.session = null;
    this.sessionCounter = 0;
    this.schedulerTimer = null;
    this.suspendTimer = null;
    this.cleanupTimers = new Set();

    this.stepIndex = 0;
    this.nextStepTime = 0;
  }

  ensureContext() {
    if (this.ctx || this.isDestroyed) return this.ctx;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    this.ctx = ctx;
    this.pinkNoiseBuffer = createPinkNoiseBuffer(ctx, 4);

    // Master chain: warm filter -> high-shelf tame -> compressor -> masterGain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-16, ctx.currentTime);
    compressor.knee.setValueAtTime(16, ctx.currentTime);
    compressor.ratio.setValueAtTime(3, ctx.currentTime);
    compressor.attack.setValueAtTime(0.015, ctx.currentTime);
    compressor.release.setValueAtTime(0.25, ctx.currentTime);
    compressor.connect(masterGain);

    const warmHighShelf = ctx.createBiquadFilter();
    warmHighShelf.type = 'highshelf';
    warmHighShelf.frequency.setValueAtTime(3400, ctx.currentTime);
    warmHighShelf.gain.setValueAtTime(-3.5, ctx.currentTime);
    warmHighShelf.connect(compressor);

    const warmMasterFilter = ctx.createBiquadFilter();
    warmMasterFilter.type = 'lowpass';
    warmMasterFilter.frequency.setValueAtTime(4200, ctx.currentTime);
    warmMasterFilter.Q.setValueAtTime(0.55, ctx.currentTime);
    warmMasterFilter.connect(warmHighShelf);

    const dryBus = ctx.createGain();
    dryBus.gain.setValueAtTime(0.76, ctx.currentTime);
    dryBus.connect(warmMasterFilter);

    // 2.8s Warm Hall Reverb
    const reverbSend = ctx.createGain();
    reverbSend.gain.setValueAtTime(0.46, ctx.currentTime);

    const convolver = ctx.createConvolver();
    convolver.buffer = createHallImpulseResponse(ctx, 2.8);

    const reverbReturn = ctx.createGain();
    reverbReturn.gain.setValueAtTime(0.48, ctx.currentTime);

    reverbSend.connect(convolver);
    convolver.connect(reverbReturn);
    reverbReturn.connect(warmMasterFilter);

    // Warm Stereo Tape Echo
    const delaySend = ctx.createGain();
    delaySend.gain.setValueAtTime(0.22, ctx.currentTime);

    const delayL = ctx.createDelay(1.5);
    delayL.delayTime.setValueAtTime(0.36, ctx.currentTime);
    const delayR = ctx.createDelay(1.5);
    delayR.delayTime.setValueAtTime(0.54, ctx.currentTime);

    const delayFilterL = ctx.createBiquadFilter();
    delayFilterL.type = 'lowpass';
    delayFilterL.frequency.setValueAtTime(1150, ctx.currentTime);

    const delayFilterR = ctx.createBiquadFilter();
    delayFilterR.type = 'lowpass';
    delayFilterR.frequency.setValueAtTime(980, ctx.currentTime);

    const feedbackL = ctx.createGain();
    feedbackL.gain.setValueAtTime(0.22, ctx.currentTime);
    const feedbackR = ctx.createGain();
    feedbackR.gain.setValueAtTime(0.2, ctx.currentTime);

    const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    delaySend.connect(delayL);
    delayL.connect(delayFilterL);
    delayFilterL.connect(feedbackL);
    feedbackL.connect(delayR);
    delayR.connect(delayFilterR);
    delayFilterR.connect(feedbackR);
    feedbackR.connect(delayL);

    if (panL && panR) {
      panL.pan.setValueAtTime(-0.34, ctx.currentTime);
      panR.pan.setValueAtTime(0.34, ctx.currentTime);
      delayFilterL.connect(panL);
      delayFilterR.connect(panR);
      panL.connect(warmMasterFilter);
      panR.connect(warmMasterFilter);
      panL.connect(reverbSend);
      panR.connect(reverbSend);
    } else {
      delayFilterL.connect(warmMasterFilter);
      delayFilterR.connect(warmMasterFilter);
      delayFilterL.connect(reverbSend);
      delayFilterR.connect(reverbSend);
    }

    this.masterGain = masterGain;
    this.dryBus = dryBus;
    this.reverbSend = reverbSend;
    this.delaySend = delaySend;

    return ctx;
  }

  getTrackId() {
    return this.trackId;
  }

  getState() {
    if (!this.ctx) return 'idle';
    return this.ctx.state;
  }

  async start() {
    if (this.isDestroyed) return false;

    const ctx = this.ensureContext();
    if (!ctx) return false;

    if (this.suspendTimer) {
      clearTimeout(this.suspendTimer);
      this.suspendTimer = null;
    }

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }

    if (ctx.state !== 'running') {
      return false;
    }

    const now = ctx.currentTime;
    const target = Math.max(0.0001, this.volume * 0.52);
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
    this.masterGain.gain.linearRampToValueAtTime(target, now + 0.9);

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.beginSession();
      this.startScheduler();
    }

    return true;
  }

  pause() {
    if (!this.ctx) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = false;
    this.stopScheduler();

    if (this.session) {
      this.endSession(this.session, 0.35);
      this.session = null;
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.45);

    if (this.suspendTimer) {
      clearTimeout(this.suspendTimer);
    }

    const ctxRef = this.ctx;
    this.suspendTimer = setTimeout(() => {
      this.suspendTimer = null;
      if (!this.isPlaying && ctxRef && ctxRef.state === 'running') {
        ctxRef.suspend().catch(() => {});
      }
    }, 520);
  }

  setVolume(nextVolume) {
    const clamped = Math.min(1, Math.max(0, nextVolume));
    this.volume = clamped;

    if (this.ctx && this.masterGain && this.isPlaying) {
      const now = this.ctx.currentTime;
      const target = Math.max(0.0001, clamped * 0.52);
      this.masterGain.gain.setTargetAtTime(target, now, 0.08);
    }
  }

  async setTrack(nextTrackId, { autoStart = false } = {}) {
    if (!TRACK_MAP.has(nextTrackId) || this.isDestroyed) return false;

    const changed = this.trackId !== nextTrackId;
    this.trackId = nextTrackId;

    if (!changed && (!autoStart || this.isPlaying)) {
      return this.isPlaying;
    }

    if (this.isPlaying && this.ctx && this.ctx.state === 'running') {
      if (this.session) {
        this.endSession(this.session, 0.28);
        this.session = null;
      }
      this.beginSession();
      this.tickScheduler();
      return true;
    }

    if (autoStart) {
      return this.start();
    }

    return false;
  }

  // --------------------------------------------------------------------------
  // Session Lifecycle & Lookahead Scheduler
  // --------------------------------------------------------------------------
  beginSession() {
    if (!this.ctx || !this.dryBus) return null;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    this.sessionCounter += 1;

    const dryGain = ctx.createGain();
    dryGain.gain.setValueAtTime(0.0001, now);
    dryGain.gain.linearRampToValueAtTime(1.0, now + 0.45);
    dryGain.connect(this.dryBus);

    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.0001, now);
    reverbGain.gain.linearRampToValueAtTime(1.0, now + 0.45);
    reverbGain.connect(this.reverbSend);

    const delayGain = ctx.createGain();
    delayGain.gain.setValueAtTime(0.0001, now);
    delayGain.gain.linearRampToValueAtTime(1.0, now + 0.45);
    delayGain.connect(this.delaySend);

    const session = {
      id: this.sessionCounter,
      trackId: this.trackId,
      dryOut: dryGain,
      reverbOut: reverbGain,
      delayOut: delayGain,
      continuousNodes: [],
      disposed: false,
    };

    this.session = session;
    this.stepIndex = 0;
    this.nextStepTime = now + 0.05;

    if (this.trackId === 'lofi') {
      this.startLofiVinylBed(session);
    } else if (this.trackId === 'rainy') {
      this.startConservatoryRainBed(session);
    }

    return session;
  }

  endSession(session, fadeSeconds = 0.3) {
    if (!session || session.disposed || !this.ctx) return;
    session.disposed = true;

    const now = this.ctx.currentTime;
    [session.dryOut, session.reverbOut, session.delayOut].forEach((node) => {
      node.gain.cancelScheduledValues(now);
      node.gain.setValueAtTime(Math.max(0.0001, node.gain.value), now);
      node.gain.linearRampToValueAtTime(0.0001, now + fadeSeconds);
    });

    const cleanupMs = Math.ceil((fadeSeconds + 0.08) * 1000);
    const timer = setTimeout(() => {
      this.cleanupTimers.delete(timer);
      session.continuousNodes.forEach((node) => {
        try {
          if (typeof node.stop === 'function') node.stop();
        } catch {
          // Ignore already-stopped nodes
        }
        try {
          node.disconnect();
        } catch {
          // Ignore disconnect errors
        }
      });
      try {
        session.dryOut.disconnect();
        session.reverbOut.disconnect();
        session.delayOut.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    }, cleanupMs);

    this.cleanupTimers.add(timer);
  }

  startScheduler() {
    this.stopScheduler();
    this.tickScheduler();
    this.schedulerTimer = setInterval(() => {
      this.tickScheduler();
    }, 45);
  }

  stopScheduler() {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  tickScheduler() {
    if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running' || !this.session) {
      return;
    }

    const ctx = this.ctx;
    const lookahead = 0.24;

    // Resync cleanly if the browser tab was backgrounded/throttled
    if (this.nextStepTime < ctx.currentTime - 0.15) {
      this.nextStepTime = ctx.currentTime + 0.04;
    }

    const track = TRACK_MAP.get(this.session.trackId) || MUSIC_TRACKS[0];

    while (this.nextStepTime < ctx.currentTime + lookahead) {
      this.scheduleStep(this.session, this.stepIndex, this.nextStepTime);
      this.nextStepTime += track.stepDuration;
      this.stepIndex += 1;
    }
  }

  scheduleStep(session, step, baseTime) {
    switch (session.trackId) {
      case 'waltz':
        this.scheduleWaltzStep(session, step, baseTime);
        break;
      case 'lofi':
        this.scheduleLofiStep(session, step, baseTime);
        break;
      case 'bossa':
        this.scheduleBossaStep(session, step, baseTime);
        break;
      case 'rainy':
        this.scheduleRainyStep(session, step, baseTime);
        break;
      default:
        break;
    }
  }

  // --------------------------------------------------------------------------
  // Track 1: Atelier Waltz (3/4 Solo Felt Piano)
  // --------------------------------------------------------------------------
  scheduleWaltzStep(session, step, time) {
    const totalBars = WALTZ_MELODY.length;
    const bar = Math.floor(step / 6) % totalBars;
    const beatStep = step % 6;
    const chord = WALTZ_CHORDS[bar % WALTZ_CHORDS.length];

    // Subtle human rubato & warmth
    const microShift = (Math.random() - 0.5) * 0.008;
    const t = Math.max(time, time + microShift);

    // Beat 1: Left-hand resonant bass root
    if (beatStep === 0) {
      this.playFeltPianoNote(session, chord.bass, t, 1.85, 0.11, -0.25);
    }

    // Beats 2 & 3: Gentle rolled waltz chord accompaniment
    if (beatStep === 2 || beatStep === 4) {
      const notes = beatStep === 4 && chord.resolveNotes ? chord.resolveNotes : chord.notes;
      const velScale = beatStep === 2 ? 0.048 : 0.036;
      notes.forEach((freq, idx) => {
        const strumTime = t + idx * 0.016;
        const pan = -0.18 + idx * 0.12;
        this.playFeltPianoNote(session, freq, strumTime, 0.95, velScale, pan);
      });
    }

    // Expressive Right-Hand Melody
    const melodyFreq = WALTZ_MELODY[bar][beatStep];
    if (melodyFreq) {
      const dur = beatStep === 0 ? 1.55 : 1.05;
      const vel = beatStep === 0 ? 0.095 : 0.078;
      this.playFeltPianoNote(session, melodyFreq, t + 0.006, dur, vel, 0.14);
    }
  }

  // --------------------------------------------------------------------------
  // Track 2: Petal Lo-Fi (Rhodes + Pillowy Chillhop Groove + Vinyl Warmth)
  // --------------------------------------------------------------------------
  scheduleLofiStep(session, step, baseTime) {
    const bar = Math.floor(step / 16) % 8;
    const stepInBar = step % 16;
    const chord = LOFI_CHORDS[bar % LOFI_CHORDS.length];

    // Classic laid-back lo-fi 16th-note swing on odd steps
    const swingOffset = stepInBar % 2 === 1 ? 0.022 : 0;
    const t = baseTime + swingOffset;

    // Rhodes chord swells (bar downbeat & lazy anticipation on step 10, turnaround on bar 3/7 step 8)
    const isTurnaroundBar = bar % 4 === 3;
    if (stepInBar === 0 || (!isTurnaroundBar && stepInBar === 10) || (isTurnaroundBar && stepInBar === 8)) {
      const notes =
        isTurnaroundBar && stepInBar >= 8 && chord.turnaroundNotes
          ? chord.turnaroundNotes
          : chord.notes;
      const chordVel = stepInBar === 0 ? 0.046 : 0.032;
      const chordDur = stepInBar === 0 ? 1.9 : 1.3;

      notes.forEach((freq, idx) => {
        this.playRhodesNote(session, freq, t + idx * 0.018, chordDur, chordVel, -0.22 + idx * 0.14);
      });
    }

    // Warm sub bass locking with the kick & turnaround
    if (stepInBar === 0 || (!isTurnaroundBar && stepInBar === 10) || (isTurnaroundBar && stepInBar === 8)) {
      this.playWarmBass(session, chord.bass, t, stepInBar === 0 ? 1.1 : 0.72, 0.12);
    }

    // Pillowy Kick (beat 1, optional ghost before beat 3, syncopated and-of-3)
    if (stepInBar === 0 || stepInBar === 10 || (bar % 2 === 1 && stepInBar === 7)) {
      const kickVel = stepInBar === 7 ? 0.11 : 0.18;
      this.playSoftKick(session, t, kickVel);
    }

    // Brushed Snare on beats 2 & 4
    if (stepInBar === 4 || stepInBar === 12) {
      this.playBrushedSnare(session, t, 0.085);
    }

    // Soft Dusty Closed Hat on swung 8ths + rare soft pickup
    if (stepInBar % 2 === 0 || (bar % 4 === 2 && stepInBar === 15)) {
      const accent = stepInBar % 4 === 2 ? 0.024 : 0.016;
      this.playSoftHat(session, t, accent);
    }

    // Lazy Rhodes top melody motif
    const melodyFreq = LOFI_MELODY_MAP[bar] && LOFI_MELODY_MAP[bar][stepInBar];
    if (melodyFreq) {
      this.playRhodesNote(session, melodyFreq, t + 0.01, 1.35, 0.056, 0.24);
    }
  }

  startLofiVinylBed(session) {
    if (!this.ctx || !this.pinkNoiseBuffer) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = this.pinkNoiseBuffer;
    src.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1600, now);
    bp.Q.setValueAtTime(0.65, now);

    const bedGain = ctx.createGain();
    bedGain.gain.setValueAtTime(0.032, now);

    src.connect(bp);
    bp.connect(bedGain);
    bedGain.connect(session.dryOut);

    src.start(now, Math.random() * 2.5);
    session.continuousNodes.push(src, bp, bedGain);
  }

  // --------------------------------------------------------------------------
  // Track 3: Sunlit Bossa (Acoustic Nylon Guitar + Cabasa + Warm Flute)
  // --------------------------------------------------------------------------
  scheduleBossaStep(session, step, t) {
    const bar = Math.floor(step / 16) % 8;
    const stepInBar = step % 16;
    const chord = BOSSA_CHORDS[bar % BOSSA_CHORDS.length];

    // Warm nylon bass thumb alternating root (beat 1/2+) and 5th (beat 3/4+)
    if (stepInBar === 0 || stepInBar === 6 || stepInBar === 8 || stepInBar === 14) {
      const bassFreq = stepInBar < 8 ? chord.rootBass : chord.altBass;
      const bassDur = stepInBar === 0 || stepInBar === 8 ? 0.58 : 0.34;
      const bassVel = stepInBar === 0 || stepInBar === 8 ? 0.13 : 0.095;
      this.playWarmBass(session, bassFreq, t, bassDur, bassVel);
    }

    // Authentic bossa clave nylon chord comping (steps 0, 3, 6, 10, 12)
    if (BOSSA_CLAVE_STEPS.has(stepInBar)) {
      const isShort = stepInBar === 3 || stepInBar === 10;
      const dur = isShort ? 0.32 : 0.62;
      const vel = isShort ? 0.042 : 0.052;
      chord.notes.forEach((freq, idx) => {
        this.playNylonGuitarNote(session, freq, t + idx * 0.011, dur, vel, -0.26 + idx * 0.12);
      });
    }

    // Gentle bossa cabasa / shaker on 8th notes
    if (stepInBar % 2 === 0) {
      const shakerVel = stepInBar % 4 === 0 ? 0.022 : 0.013;
      this.playSoftHat(session, t, shakerVel, 4600, 0.045);
    }

    // Soft wooden rim clave
    if (BOSSA_CLAVE_STEPS.has(stepInBar)) {
      this.playWoodRim(session, t, 0.036);
    }

    // Joyful warm flute melody
    const melodyItem = BOSSA_MELODY_MAP[bar] && BOSSA_MELODY_MAP[bar][stepInBar];
    if (melodyItem) {
      this.playWarmFluteNote(session, melodyItem.f, t, melodyItem.d, 0.068, 0.16);
    }
  }

  // --------------------------------------------------------------------------
  // Track 4: Rainy Conservatory (Soft Rainfall + Warm Pad + Glass Harp)
  // --------------------------------------------------------------------------
  scheduleRainyStep(session, step, t) {
    const chordBlock = Math.floor(step / 12) % RAINY_CHORDS.length;
    const stepInChord = step % 12;
    const chord = RAINY_CHORDS[chordBlock];

    // Warm botanical string pad swell at the start of every 12-step cycle (~5s)
    if (stepInChord === 0) {
      this.triggerSoftPadChord(session, chord.pad, t, 5.4);
    }

    // Delicate glass harp / celesta broken arpeggio pattern
    const arpIdx = RAINY_ARP_PATTERN[stepInChord];
    if (stepInChord !== 6 && stepInChord !== 11) {
      const freq = chord.arp[arpIdx];
      const vel = stepInChord === 0 ? 0.058 : 0.042;
      const pan = ((stepInChord % 2 === 0 ? -1 : 1) * 0.32);
      this.playGlassHarpNote(session, freq, t, 2.8, vel, pan);
    }

    // Subtle raindrop shimmer ping occasionally in the hall
    if (stepInChord === 5 || stepInChord === 11) {
      if (Math.random() < 0.65) {
        const dropFreq = chord.arp[chord.arp.length - 1] * 2;
        this.playRaindropPing(session, dropFreq, t + 0.14);
      }
    }
  }

  startConservatoryRainBed(session) {
    if (!this.ctx || !this.pinkNoiseBuffer) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = this.pinkNoiseBuffer;
    src.loop = true;

    const rainLP = ctx.createBiquadFilter();
    rainLP.type = 'lowpass';
    rainLP.frequency.setValueAtTime(1750, now);
    rainLP.Q.setValueAtTime(0.45, now);

    const rainHP = ctx.createBiquadFilter();
    rainHP.type = 'highpass';
    rainHP.frequency.setValueAtTime(240, now);

    // Gentle wind/rain intensity swell LFO
    const swellLfo = ctx.createOscillator();
    swellLfo.type = 'sine';
    swellLfo.frequency.setValueAtTime(0.085, now);
    const swellDepth = ctx.createGain();
    swellDepth.gain.setValueAtTime(380, now);
    swellLfo.connect(swellDepth);
    swellDepth.connect(rainLP.frequency);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.09, now);

    src.connect(rainHP);
    rainHP.connect(rainLP);
    rainLP.connect(rainGain);
    rainGain.connect(session.dryOut);
    rainGain.connect(session.reverbOut);

    src.start(now);
    swellLfo.start(now);

    session.continuousNodes.push(src, rainLP, rainHP, swellLfo, swellDepth, rainGain);
  }

  // --------------------------------------------------------------------------
  // Instrument Synthesizers (All routed into session.dryOut / reverbOut / delayOut)
  // --------------------------------------------------------------------------
  playFeltPianoNote(session, freq, time, duration, velocity, pan = 0) {
    const ctx = this.ctx;
    if (!ctx || session.disposed) return;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(2600, freq * 4.2), time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(300, freq * 1.35), time + Math.min(1.4, duration));
    filter.Q.setValueAtTime(0.6, time);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.018);
    env.gain.exponentialRampToValueAtTime(velocity * 0.42, time + duration * 0.42);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, time);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.24, time);
    gain2.gain.exponentialRampToValueAtTime(0.015, time + duration * 0.55);

    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, time);
    const gain3 = ctx.createGain();
    gain3.gain.setValueAtTime(0.07, time);
    gain3.gain.exponentialRampToValueAtTime(0.005, time + 0.35);

    osc1.connect(filter);
    osc2.connect(gain2);
    gain2.connect(filter);
    osc3.connect(gain3);
    gain3.connect(filter);
    filter.connect(env);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(pan, time);
      env.connect(panner);
      panner.connect(session.dryOut);
      panner.connect(session.reverbOut);
    } else {
      env.connect(session.dryOut);
      env.connect(session.reverbOut);
    }

    osc1.start(time);
    osc2.start(time);
    osc3.start(time);
    osc1.stop(time + duration + 0.05);
    osc2.stop(time + duration + 0.05);
    osc3.stop(time + duration + 0.05);

    osc1.onended = () => {
      osc1.disconnect();
      osc2.disconnect();
      osc3.disconnect();
      gain2.disconnect();
      gain3.disconnect();
      filter.disconnect();
      env.disconnect();
      if (panner) panner.disconnect();
    };
  }

  playRhodesNote(session, freq, time, duration, velocity, pan = 0) {
    const ctx = this.ctx;
    if (!ctx || session.disposed) return;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1450, time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(360, freq * 1.8), time + duration * 0.7);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.022);
    env.gain.exponentialRampToValueAtTime(velocity * 0.55, time + 0.35);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    // Warm electric piano body + subtle detuned vintage wow
    const oscBody = ctx.createOscillator();
    oscBody.type = 'sine';
    oscBody.frequency.setValueAtTime(freq, time);
    oscBody.detune.setValueAtTime((Math.random() - 0.5) * 7, time);

    const oscWarm = ctx.createOscillator();
    oscWarm.type = 'triangle';
    oscWarm.frequency.setValueAtTime(freq, time);
    oscWarm.detune.setValueAtTime(2.5, time);
    const warmGain = ctx.createGain();
    warmGain.gain.setValueAtTime(0.28, time);

    // Soft tine bell attack
    const oscTine = ctx.createOscillator();
    oscTine.type = 'sine';
    oscTine.frequency.setValueAtTime(freq * 4, time);
    const tineGain = ctx.createGain();
    tineGain.gain.setValueAtTime(0.075, time);
    tineGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

    oscBody.connect(filter);
    oscWarm.connect(warmGain);
    warmGain.connect(filter);
    oscTine.connect(tineGain);
    tineGain.connect(filter);
    filter.connect(env);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(pan, time);
      env.connect(panner);
      panner.connect(session.dryOut);
      panner.connect(session.reverbOut);
      panner.connect(session.delayOut);
    } else {
      env.connect(session.dryOut);
      env.connect(session.reverbOut);
    }

    oscBody.start(time);
    oscWarm.start(time);
    oscTine.start(time);
    oscBody.stop(time + duration + 0.04);
    oscWarm.stop(time + duration + 0.04);
    oscTine.stop(time + 0.2);

    oscBody.onended = () => {
      oscBody.disconnect();
      oscWarm.disconnect();
      oscTine.disconnect();
      warmGain.disconnect();
      tineGain.disconnect();
      filter.disconnect();
      env.disconnect();
      if (panner) panner.disconnect();
    };
  }

  playNylonGuitarNote(session, freq, time, duration, velocity, pan = 0) {
    const ctx = this.ctx;
    if (!ctx || session.disposed) return;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(3000, freq * 5.2), time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(340, freq * 1.45), time + 0.28);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.28, time);
    gain2.gain.exponentialRampToValueAtTime(0.02, time + duration * 0.65);

    osc1.connect(filter);
    osc2.connect(gain2);
    gain2.connect(filter);
    filter.connect(env);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(pan, time);
      env.connect(panner);
      panner.connect(session.dryOut);
      panner.connect(session.reverbOut);
    } else {
      env.connect(session.dryOut);
      env.connect(session.reverbOut);
    }

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.04);
    osc2.stop(time + duration + 0.04);

    osc1.onended = () => {
      osc1.disconnect();
      osc2.disconnect();
      gain2.disconnect();
      filter.disconnect();
      env.disconnect();
      if (panner) panner.disconnect();
    };
  }

  playWarmFluteNote(session, freq, time, duration, velocity, pan = 0) {
    const ctx = this.ctx;
    if (!ctx || session.disposed) return;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.09);
    env.gain.setValueAtTime(velocity * 0.85, time + Math.max(0.11, duration - 0.14));
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    const oscOctave = ctx.createOscillator();
    oscOctave.type = 'sine';
    oscOctave.frequency.setValueAtTime(freq * 2, time);
    const octGain = ctx.createGain();
    octGain.gain.setValueAtTime(0.09, time);

    // Gentle lyrical vibrato
    const vibrato = ctx.createOscillator();
    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(5.1, time);
    const vibDepth = ctx.createGain();
    vibDepth.gain.setValueAtTime(0, time);
    vibDepth.gain.linearRampToValueAtTime(6.5, time + 0.22);
    vibrato.connect(vibDepth);
    vibDepth.connect(osc.detune);

    osc.connect(env);
    oscOctave.connect(octGain);
    octGain.connect(env);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(pan, time);
      env.connect(panner);
      panner.connect(session.dryOut);
      panner.connect(session.reverbOut);
      panner.connect(session.delayOut);
    } else {
      env.connect(session.dryOut);
      env.connect(session.reverbOut);
    }

    osc.start(time);
    oscOctave.start(time);
    vibrato.start(time);
    osc.stop(time + duration + 0.04);
    oscOctave.stop(time + duration + 0.04);
    vibrato.stop(time + duration + 0.04);

    osc.onended = () => {
      osc.disconnect();
      oscOctave.disconnect();
      vibrato.disconnect();
      octGain.disconnect();
      vibDepth.disconnect();
      env.disconnect();
      if (panner) panner.disconnect();
    };
  }

  playWarmBass(session, freq, time, duration, velocity) {
    const ctx = this.ctx;
    if (!ctx || session.disposed) return;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(340, time);
    filter.frequency.exponentialRampToValueAtTime(160, time + duration * 0.75);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.025);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(freq, time);

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(env);
    env.connect(session.dryOut);

    osc.start(time);
    sub.start(time);
    osc.stop(time + duration + 0.04);
    sub.stop(time + duration + 0.04);

    osc.onended = () => {
      osc.disconnect();
      sub.disconnect();
      filter.disconnect();
      env.disconnect();
    };
  }

  playSoftKick(session, time, velocity) {
    const ctx = this.ctx;
    if (!ctx || session.disposed) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(112, time);
    osc.frequency.exponentialRampToValueAtTime(44, time + 0.085);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, time);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.24);

    osc.connect(filter);
    filter.connect(env);
    env.connect(session.dryOut);

    osc.start(time);
    osc.stop(time + 0.27);

    osc.onended = () => {
      osc.disconnect();
      filter.disconnect();
      env.disconnect();
    };
  }

  playBrushedSnare(session, time, velocity) {
    const ctx = this.ctx;
    if (!ctx || !this.pinkNoiseBuffer || session.disposed) return;

    const noise = ctx.createBufferSource();
    noise.buffer = this.pinkNoiseBuffer;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1050, time);
    bp.Q.setValueAtTime(0.85, time);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

    const body = ctx.createOscillator();
    body.type = 'triangle';
    body.frequency.setValueAtTime(195, time);
    body.frequency.exponentialRampToValueAtTime(125, time + 0.06);

    const bodyEnv = ctx.createGain();
    bodyEnv.gain.setValueAtTime(velocity * 0.55, time);
    bodyEnv.gain.exponentialRampToValueAtTime(0.0001, time + 0.075);

    noise.connect(bp);
    bp.connect(env);
    body.connect(bodyEnv);

    env.connect(session.dryOut);
    env.connect(session.reverbOut);
    bodyEnv.connect(session.dryOut);

    noise.start(time, Math.random() * 2);
    body.start(time);
    noise.stop(time + 0.16);
    body.stop(time + 0.09);

    noise.onended = () => {
      noise.disconnect();
      bp.disconnect();
      env.disconnect();
      body.disconnect();
      bodyEnv.disconnect();
    };
  }

  playSoftHat(session, time, velocity, cutoff = 5600, dur = 0.042) {
    const ctx = this.ctx;
    if (!ctx || !this.pinkNoiseBuffer || session.disposed) return;

    const noise = ctx.createBufferSource();
    noise.buffer = this.pinkNoiseBuffer;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(cutoff, time);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    noise.connect(hp);
    hp.connect(env);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(0.24, time);
      env.connect(panner);
      panner.connect(session.dryOut);
    } else {
      env.connect(session.dryOut);
    }

    noise.start(time, Math.random() * 2);
    noise.stop(time + dur + 0.02);

    noise.onended = () => {
      noise.disconnect();
      hp.disconnect();
      env.disconnect();
      if (panner) panner.disconnect();
    };
  }

  playWoodRim(session, time, velocity) {
    const ctx = this.ctx;
    if (!ctx || session.disposed) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(840, time);
    osc.frequency.exponentialRampToValueAtTime(610, time + 0.025);

    const env = ctx.createGain();
    env.gain.setValueAtTime(velocity, time);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    osc.connect(env);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(-0.28, time);
      env.connect(panner);
      panner.connect(session.dryOut);
      panner.connect(session.reverbOut);
    } else {
      env.connect(session.dryOut);
    }

    osc.start(time);
    osc.stop(time + 0.05);

    osc.onended = () => {
      osc.disconnect();
      env.disconnect();
      if (panner) panner.disconnect();
    };
  }

  triggerSoftPadChord(session, frequencies, time, duration) {
    const ctx = this.ctx;
    if (!ctx || session.disposed) return;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, time);
    filter.frequency.linearRampToValueAtTime(740, time + duration * 0.45);
    filter.frequency.linearRampToValueAtTime(480, time + duration);

    filter.connect(session.dryOut);
    filter.connect(session.reverbOut);

    frequencies.forEach((freq, idx) => {
      const voiceGain = ctx.createGain();
      const peak = 0.032 / (1 + idx * 0.14);
      voiceGain.gain.setValueAtTime(0.0001, time);
      voiceGain.gain.linearRampToValueAtTime(peak, time + 1.6);
      voiceGain.gain.setValueAtTime(peak, time + duration - 2.0);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      const oscA = ctx.createOscillator();
      oscA.type = 'sine';
      oscA.frequency.setValueAtTime(freq, time);
      oscA.detune.setValueAtTime(-2.5, time);

      const oscB = ctx.createOscillator();
      oscB.type = 'triangle';
      oscB.frequency.setValueAtTime(freq, time);
      oscB.detune.setValueAtTime(2.5, time);
      const triTrim = ctx.createGain();
      triTrim.gain.setValueAtTime(0.24, time);

      oscA.connect(voiceGain);
      oscB.connect(triTrim);
      triTrim.connect(voiceGain);
      voiceGain.connect(filter);

      oscA.start(time);
      oscB.start(time);
      oscA.stop(time + duration + 0.06);
      oscB.stop(time + duration + 0.06);

      oscA.onended = () => {
        oscA.disconnect();
        oscB.disconnect();
        triTrim.disconnect();
        voiceGain.disconnect();
        if (idx === frequencies.length - 1) {
          filter.disconnect();
        }
      };
    });
  }

  playGlassHarpNote(session, freq, time, duration, velocity, pan = 0) {
    const ctx = this.ctx;
    if (!ctx || session.disposed) return;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.035);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time);
    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.18, time);
    overtoneGain.gain.exponentialRampToValueAtTime(0.01, time + 0.8);

    osc1.connect(env);
    osc2.connect(overtoneGain);
    overtoneGain.connect(env);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(pan, time);
      env.connect(panner);
      panner.connect(session.dryOut);
      panner.connect(session.reverbOut);
      panner.connect(session.delayOut);
    } else {
      env.connect(session.dryOut);
      env.connect(session.reverbOut);
    }

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.05);
    osc2.stop(time + duration + 0.05);

    osc1.onended = () => {
      osc1.disconnect();
      osc2.disconnect();
      overtoneGain.disconnect();
      env.disconnect();
      if (panner) panner.disconnect();
    };
  }

  playRaindropPing(session, freq, time) {
    const ctx = this.ctx;
    if (!ctx || session.disposed) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.82, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.18, time + 0.065);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(0.014, time + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.24);

    osc.connect(env);
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime((Math.random() - 0.5) * 0.9, time);
      env.connect(panner);
      panner.connect(session.reverbOut);
    } else {
      env.connect(session.reverbOut);
    }

    osc.start(time);
    osc.stop(time + 0.28);

    osc.onended = () => {
      osc.disconnect();
      env.disconnect();
      if (panner) panner.disconnect();
    };
  }

  // --------------------------------------------------------------------------
  // Teardown
  // --------------------------------------------------------------------------
  destroy() {
    this.isDestroyed = true;
    this.isPlaying = false;
    this.stopScheduler();

    if (this.suspendTimer) {
      clearTimeout(this.suspendTimer);
      this.suspendTimer = null;
    }

    this.cleanupTimers.forEach((timer) => clearTimeout(timer));
    this.cleanupTimers.clear();

    if (this.session) {
      this.session.continuousNodes.forEach((node) => {
        try {
          if (typeof node.stop === 'function') node.stop();
        } catch {
          // Ignore already stopped
        }
        try {
          node.disconnect();
        } catch {
          // Ignore disconnect errors
        }
      });
      this.session = null;
    }

    if (this.ctx) {
      const ctxRef = this.ctx;
      this.ctx = null;
      ctxRef.close().catch(() => {});
    }
  }
}
