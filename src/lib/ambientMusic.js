/**
 * AmbientGardenEngine
 *
 * Pure Web Audio API generative soundscape crafted for Twirl & Flora.
 * Combines warm detuned pad swells, felt-piano / acoustic harp plucks,
 * subtle stereo ping-pong delay, and a custom 3.4s low-passed hall reverb
 * with zero external audio dependencies.
 */

const CHORDS = [
  {
    name: 'Fmaj9',
    pad: [174.61, 261.63, 329.63, 392.0, 440.0],
    melody: [349.23, 392.0, 440.0, 523.25, 587.33, 659.25, 698.46, 880.0],
  },
  {
    name: 'C6/9',
    pad: [164.81, 261.63, 293.66, 392.0, 440.0],
    melody: [329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0],
  },
  {
    name: 'Dm9',
    pad: [146.83, 220.0, 261.63, 329.63, 349.23],
    melody: [293.66, 349.23, 440.0, 523.25, 587.33, 659.25, 698.46, 880.0],
  },
  {
    name: 'Bbmaj9',
    pad: [116.54, 174.61, 220.0, 261.63, 293.66],
    melody: [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46, 783.99],
  },
];

const CHORD_INTERVAL_MS = 7200;

function createHallImpulseResponse(ctx, durationSeconds = 3.4) {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * durationSeconds);
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const preDelaySamples = Math.floor(sampleRate * 0.038);

  for (let ch = 0; ch < 2; ch += 1) {
    const channelData = impulse.getChannelData(ch);
    let lp1 = 0;
    let lp2 = 0;
    const damp = 0.74;

    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      lp1 = lp1 * damp + white * (1 - damp);
      lp2 = lp2 * damp + lp1 * (1 - damp);

      const t = i / sampleRate;
      const preFade = i < preDelaySamples ? Math.pow(i / preDelaySamples, 2) : 1;
      const decay = Math.pow(1 - i / length, 2.5) * Math.exp(-t * 1.35);

      channelData[i] = lp2 * preFade * decay * 0.58;
    }
  }

  return impulse;
}

export class AmbientGardenEngine {
  constructor(initialVolume = 0.65) {
    this.ctx = null;
    this.masterGain = null;
    this.dryGain = null;
    this.reverbSend = null;
    this.delaySend = null;
    this.padLfo = null;
    this.padFilter = null;

    this.volume = initialVolume;
    this.isPlaying = false;
    this.isDestroyed = false;

    this.chordIndex = 0;
    this.melodyStep = 3;
    this.chordTimer = null;
    this.melodyTimer = null;
    this.shimmerTimer = null;
    this.suspendTimer = null;
  }

  ensureContext() {
    if (this.ctx || this.isDestroyed) return this.ctx;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    this.ctx = ctx;

    // Master chain: warm low-pass -> gentle compressor -> master gain -> destination
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, ctx.currentTime);
    compressor.knee.setValueAtTime(18, ctx.currentTime);
    compressor.ratio.setValueAtTime(3, ctx.currentTime);
    compressor.attack.setValueAtTime(0.02, ctx.currentTime);
    compressor.release.setValueAtTime(0.25, ctx.currentTime);
    compressor.connect(masterGain);

    const warmMasterFilter = ctx.createBiquadFilter();
    warmMasterFilter.type = 'lowpass';
    warmMasterFilter.frequency.setValueAtTime(2400, ctx.currentTime);
    warmMasterFilter.Q.setValueAtTime(0.5, ctx.currentTime);
    warmMasterFilter.connect(compressor);

    const dryGain = ctx.createGain();
    dryGain.gain.setValueAtTime(0.62, ctx.currentTime);
    dryGain.connect(warmMasterFilter);

    // 3.4s Stereo Hall Convolution Reverb
    const reverbSend = ctx.createGain();
    reverbSend.gain.setValueAtTime(0.56, ctx.currentTime);

    const convolver = ctx.createConvolver();
    convolver.buffer = createHallImpulseResponse(ctx, 3.4);

    const reverbOutGain = ctx.createGain();
    reverbOutGain.gain.setValueAtTime(0.52, ctx.currentTime);

    reverbSend.connect(convolver);
    convolver.connect(reverbOutGain);
    reverbOutGain.connect(warmMasterFilter);

    // Warm Stereo Ping-Pong Delay
    const delaySend = ctx.createGain();
    delaySend.gain.setValueAtTime(0.26, ctx.currentTime);

    const delayL = ctx.createDelay(2.0);
    delayL.delayTime.setValueAtTime(0.42, ctx.currentTime);
    const delayR = ctx.createDelay(2.0);
    delayR.delayTime.setValueAtTime(0.56, ctx.currentTime);

    const delayFilterL = ctx.createBiquadFilter();
    delayFilterL.type = 'lowpass';
    delayFilterL.frequency.setValueAtTime(860, ctx.currentTime);

    const delayFilterR = ctx.createBiquadFilter();
    delayFilterR.type = 'lowpass';
    delayFilterR.frequency.setValueAtTime(780, ctx.currentTime);

    const feedbackL = ctx.createGain();
    feedbackL.gain.setValueAtTime(0.25, ctx.currentTime);
    const feedbackR = ctx.createGain();
    feedbackR.gain.setValueAtTime(0.23, ctx.currentTime);

    const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    delaySend.connect(delayL);
    delayL.connect(delayFilterL);
    delayFilterL.connect(feedbackL);
    feedbackL.connect(delayR);
    delayR.connect(delayFilterR);
    feedbackR.connect(delayL);
    delayFilterR.connect(feedbackR);

    if (panL && panR) {
      panL.pan.setValueAtTime(-0.38, ctx.currentTime);
      panR.pan.setValueAtTime(0.38, ctx.currentTime);
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

    // Shared warm pad low-pass filter with slow breathing LFO
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(540, ctx.currentTime);
    padFilter.Q.setValueAtTime(0.6, ctx.currentTime);
    padFilter.connect(dryGain);
    padFilter.connect(reverbSend);

    const padLfo = ctx.createOscillator();
    padLfo.type = 'sine';
    padLfo.frequency.setValueAtTime(0.065, ctx.currentTime);
    const padLfoGain = ctx.createGain();
    padLfoGain.gain.setValueAtTime(135, ctx.currentTime);
    padLfo.connect(padLfoGain);
    padLfoGain.connect(padFilter.frequency);
    padLfo.start();

    this.masterGain = masterGain;
    this.dryGain = dryGain;
    this.reverbSend = reverbSend;
    this.delaySend = delaySend;
    this.padFilter = padFilter;
    this.padLfo = padLfo;

    return ctx;
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
    const target = Math.max(0.0001, this.volume * 0.44);
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
    this.masterGain.gain.linearRampToValueAtTime(target, now + 1.8);

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.playNextChord();
      this.scheduleNextMelodyNote(900);
    }

    return true;
  }

  pause() {
    if (!this.ctx) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = false;
    this.clearSchedulers();

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.55);

    if (this.suspendTimer) {
      clearTimeout(this.suspendTimer);
    }

    const ctxRef = this.ctx;
    this.suspendTimer = setTimeout(() => {
      if (!this.isPlaying && ctxRef && ctxRef.state === 'running') {
        ctxRef.suspend().catch(() => {});
      }
    }, 620);
  }

  setVolume(nextVolume) {
    const clamped = Math.min(1, Math.max(0, nextVolume));
    this.volume = clamped;

    if (this.ctx && this.masterGain && this.isPlaying) {
      const now = this.ctx.currentTime;
      const target = Math.max(0.0001, clamped * 0.44);
      this.masterGain.gain.setTargetAtTime(target, now, 0.08);
    }
  }

  clearSchedulers() {
    if (this.chordTimer) {
      clearTimeout(this.chordTimer);
      this.chordTimer = null;
    }
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
    if (this.shimmerTimer) {
      clearTimeout(this.shimmerTimer);
      this.shimmerTimer = null;
    }
  }

  playNextChord() {
    if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running') return;

    const chord = CHORDS[this.chordIndex];
    this.triggerPadChord(chord.pad);

    this.chordIndex = (this.chordIndex + 1) % CHORDS.length;
    this.chordTimer = setTimeout(() => {
      this.playNextChord();
    }, CHORD_INTERVAL_MS);
  }

  triggerPadChord(frequencies) {
    if (!this.ctx || !this.padFilter) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const attack = 2.4;
    const sustain = 2.6;
    const release = 3.6;
    const totalDuration = attack + sustain + release;

    frequencies.forEach((freq, idx) => {
      const voiceGain = ctx.createGain();
      const peak = (0.042 / (1 + idx * 0.16));

      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.linearRampToValueAtTime(peak, now + attack);
      voiceGain.gain.setValueAtTime(peak, now + attack + sustain);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + totalDuration);

      const oscA = ctx.createOscillator();
      oscA.type = 'sine';
      oscA.frequency.setValueAtTime(freq, now);
      oscA.detune.setValueAtTime(-2.5, now);

      const oscB = ctx.createOscillator();
      oscB.type = 'triangle';
      oscB.frequency.setValueAtTime(freq, now);
      oscB.detune.setValueAtTime(2.5, now);

      const triTrim = ctx.createGain();
      triTrim.gain.setValueAtTime(0.32, now);

      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const panAmount = ((idx % 2 === 0 ? -1 : 1) * (0.12 + idx * 0.06));

      oscA.connect(voiceGain);
      oscB.connect(triTrim);
      triTrim.connect(voiceGain);

      if (panner) {
        panner.pan.setValueAtTime(Math.max(-0.5, Math.min(0.5, panAmount)), now);
        voiceGain.connect(panner);
        panner.connect(this.padFilter);
      } else {
        voiceGain.connect(this.padFilter);
      }

      oscA.start(now);
      oscB.start(now);
      oscA.stop(now + totalDuration + 0.05);
      oscB.stop(now + totalDuration + 0.05);

      oscA.onended = () => {
        oscA.disconnect();
        oscB.disconnect();
        triTrim.disconnect();
        voiceGain.disconnect();
        if (panner) panner.disconnect();
      };
    });
  }

  scheduleNextMelodyNote(overrideDelay) {
    if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running') return;

    const delayMs = overrideDelay ?? (1450 + Math.random() * 1450);

    this.melodyTimer = setTimeout(() => {
      if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running') return;

      const activeChordIdx = (this.chordIndex - 1 + CHORDS.length) % CHORDS.length;
      const chord = CHORDS[activeChordIdx];
      const palette = chord.melody;

      // 20% gentle rest so the arrangement breathes naturally
      if (Math.random() > 0.2) {
        const steps = [-2, -1, 1, 1, 2];
        const delta = steps[Math.floor(Math.random() * steps.length)];
        this.melodyStep = Math.max(0, Math.min(palette.length - 1, this.melodyStep + delta));

        const freq = palette[this.melodyStep];
        const velocity = 0.055 + Math.random() * 0.032;
        const pan = (Math.random() - 0.5) * 0.72;
        this.triggerFeltNote(freq, velocity, pan);

        // Occasional delicate shimmer overtone
        if (Math.random() < 0.24) {
          const shimmerFreq = palette[Math.min(palette.length - 1, this.melodyStep + 2)];
          this.shimmerTimer = setTimeout(() => {
            this.shimmerTimer = null;
            if (this.isPlaying && this.ctx && this.ctx.state === 'running') {
              this.triggerShimmerNote(shimmerFreq);
            }
          }, 340);
        }
      }

      this.scheduleNextMelodyNote();
    }, delayMs);
  }

  triggerFeltNote(freq, velocity, pan = 0) {
    if (!this.ctx || !this.dryGain) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 3.8;

    const noteFilter = ctx.createBiquadFilter();
    noteFilter.type = 'lowpass';
    const startCutoff = Math.min(2000, freq * 3.6);
    const endCutoff = Math.max(320, freq * 1.15);
    noteFilter.frequency.setValueAtTime(startCutoff, now);
    noteFilter.frequency.exponentialRampToValueAtTime(endCutoff, now + 1.5);
    noteFilter.Q.setValueAtTime(0.7, now);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(velocity, now + 0.026);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const oscFundamental = ctx.createOscillator();
    oscFundamental.type = 'sine';
    oscFundamental.frequency.setValueAtTime(freq, now);

    const oscHarmonic2 = ctx.createOscillator();
    oscHarmonic2.type = 'sine';
    oscHarmonic2.frequency.setValueAtTime(freq * 2, now);

    const gainH2 = ctx.createGain();
    gainH2.gain.setValueAtTime(0.22, now);
    gainH2.gain.exponentialRampToValueAtTime(0.01, now + 1.1);

    const oscHarmonic3 = ctx.createOscillator();
    oscHarmonic3.type = 'sine';
    oscHarmonic3.frequency.setValueAtTime(freq * 3, now);

    const gainH3 = ctx.createGain();
    gainH3.gain.setValueAtTime(0.06, now);
    gainH3.gain.exponentialRampToValueAtTime(0.005, now + 0.55);

    oscFundamental.connect(noteFilter);
    oscHarmonic2.connect(gainH2);
    gainH2.connect(noteFilter);
    oscHarmonic3.connect(gainH3);
    gainH3.connect(noteFilter);

    noteFilter.connect(env);

    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(pan, now);
      env.connect(panner);
      panner.connect(this.dryGain);
      panner.connect(this.reverbSend);
      panner.connect(this.delaySend);
    } else {
      env.connect(this.dryGain);
      env.connect(this.reverbSend);
      env.connect(this.delaySend);
    }

    oscFundamental.start(now);
    oscHarmonic2.start(now);
    oscHarmonic3.start(now);

    oscFundamental.stop(now + duration + 0.05);
    oscHarmonic2.stop(now + duration + 0.05);
    oscHarmonic3.stop(now + duration + 0.05);

    oscFundamental.onended = () => {
      oscFundamental.disconnect();
      oscHarmonic2.disconnect();
      oscHarmonic3.disconnect();
      gainH2.disconnect();
      gainH3.disconnect();
      noteFilter.disconnect();
      env.disconnect();
      if (panner) panner.disconnect();
    };
  }

  triggerShimmerNote(freq) {
    if (!this.ctx || !this.reverbSend) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 4.2;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.016, now + 0.22);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(env);
    env.connect(this.reverbSend);

    osc.start(now);
    osc.stop(now + duration + 0.05);

    osc.onended = () => {
      osc.disconnect();
      env.disconnect();
    };
  }

  destroy() {
    this.isDestroyed = true;
    this.isPlaying = false;
    this.clearSchedulers();

    if (this.suspendTimer) {
      clearTimeout(this.suspendTimer);
      this.suspendTimer = null;
    }

    if (this.padLfo) {
      try {
        this.padLfo.stop();
        this.padLfo.disconnect();
      } catch {
        // Ignore if already stopped
      }
      this.padLfo = null;
    }

    if (this.ctx) {
      const ctxRef = this.ctx;
      this.ctx = null;
      ctxRef.close().catch(() => {});
    }
  }
}
