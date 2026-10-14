/* ==========================================================================
   ACOUSTIC SOUND ENGINE (WEB AUDIO API)
   Procedural synthesis of realistic supercar engine rumble and throttle rev.
   Zero external audio dependencies, race-condition protected lifecycle.
   ========================================================================== */

class SupercarSoundEngine {
  constructor() {
    this.ctx = null;
    this.isRunning = false;
    this.nodes = {};
    this.listeners = new Set();
    this.stopTimeout = null;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          this.ctx = null;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume().catch(() => {});
      } catch {
        // Audio suspended until user gesture
      }
    }
  }

  _teardownNodes(nodes) {
    if (!nodes) return;
    try {
      if (nodes.osc1) { nodes.osc1.stop(); nodes.osc1.disconnect(); }
      if (nodes.osc2) { nodes.osc2.stop(); nodes.osc2.disconnect(); }
      if (nodes.turboOsc) { nodes.turboOsc.stop(); nodes.turboOsc.disconnect(); }
      if (nodes.filter) nodes.filter.disconnect();
      if (nodes.turboGain) nodes.turboGain.disconnect();
      if (nodes.masterGain) nodes.masterGain.disconnect();
    } catch {
      // Ignore nodes that are already stopped or disconnected
    }
  }

  startEngine(type = 'v8') {
    // If a stop timeout is pending, cancel it immediately and clean up prior nodes
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
      this._teardownNodes(this.nodes);
      this.nodes = {};
      this.isRunning = false;
    }

    this.initContext();
    if (!this.ctx || this.isRunning) return;

    this.isRunning = true;
    const now = this.ctx.currentTime;

    try {
      // Master volume
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, now);
      masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.5);
      masterGain.connect(this.ctx.destination);

      // Primary low frequency rumble (crankshaft revolutions)
      const baseFreq = type === 'v12' ? 52 : 44;
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(baseFreq, now);

      // Secondary sub-bass harmonic
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 0.5, now);

      // Exhaust resonance filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.Q.setValueAtTime(4, now);

      // High harmonic flutter (turbo spool simulation)
      const turboOsc = this.ctx.createOscillator();
      turboOsc.type = 'sine';
      turboOsc.frequency.setValueAtTime(850, now);
      const turboGain = this.ctx.createGain();
      turboGain.gain.setValueAtTime(0.02, now);

      // Connect nodes
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      turboOsc.connect(turboGain);
      turboGain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      turboOsc.start(now);

      this.nodes = { osc1, osc2, turboOsc, filter, masterGain, turboGain, baseFreq };
      this.notify();
    } catch (e) {
      console.warn('Audio synthesis start failed:', e);
      this.isRunning = false;
    }
  }

  revEngine(intensity = 1.0) {
    if (!this.isRunning || !this.nodes.osc1 || !this.ctx) return;
    const now = this.ctx.currentTime;
    const { osc1, osc2, turboOsc, filter, masterGain, turboGain, baseFreq } = this.nodes;

    try {
      // Surge frequency up to simulated 8,600 RPM
      const targetFreq = baseFreq * (1.8 + intensity * 2.2);
      osc1.frequency.cancelScheduledValues(now);
      osc1.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.45);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.1, now + 1.2);

      osc2.frequency.cancelScheduledValues(now);
      osc2.frequency.exponentialRampToValueAtTime(targetFreq * 0.5, now + 0.45);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 1.2);

      filter.frequency.cancelScheduledValues(now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.45);
      filter.frequency.exponentialRampToValueAtTime(320, now + 1.2);

      turboOsc.frequency.cancelScheduledValues(now);
      turboOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.45);
      turboOsc.frequency.exponentialRampToValueAtTime(850, now + 1.2);

      turboGain.gain.cancelScheduledValues(now);
      turboGain.gain.exponentialRampToValueAtTime(0.08, now + 0.45);
      turboGain.gain.exponentialRampToValueAtTime(0.02, now + 1.2);

      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.exponentialRampToValueAtTime(0.65, now + 0.45);
      masterGain.gain.exponentialRampToValueAtTime(0.35, now + 1.2);
    } catch {
      // Safe fallback if nodes are ramping
    }
  }

  stopEngine() {
    if (!this.isRunning || !this.ctx) return;

    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    const currentNodes = this.nodes;
    const now = this.ctx.currentTime;

    if (currentNodes.masterGain) {
      try {
        currentNodes.masterGain.gain.cancelScheduledValues(now);
        currentNodes.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      } catch {
        // Ramp fallback
      }
    }

    this.isRunning = false;
    this.notify();

    this.stopTimeout = setTimeout(() => {
      this._teardownNodes(currentNodes);
      if (this.nodes === currentNodes) {
        this.nodes = {};
      }
      this.stopTimeout = null;
    }, 450);
  }

  playClick() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio error ignored
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.isRunning));
  }
}

export const soundEngine = new SupercarSoundEngine();
