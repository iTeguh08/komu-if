/**
 * Radio Music Manager for Raditya's Room
 * Provides Spotify-style music search, online streaming, Spotify embeds, 
 * local audio playback, and procedural Lo-Fi synthesis.
 * 
 * Features:
 * 1. Live Song Search: Uses iTunes Search API (100% free, zero CORS restrictions, millions of tracks worldwide)
 * 2. Real Audio Streaming: Streams full preview audio directly into the bedroom audio system
 * 3. Spotify Embed: Generates responsive Spotify embed players for any open.spotify.com track or playlist
 * 4. Local Audio Upload: Plays local MP3/audio files directly from the user's computer
 * 5. Procedural Synthesizer: 4 built-in ambient stations (Cozy Lo-Fi, Minecraft Piano, Zeta's Lounge, Beach Sunset)
 * 6. Visual Sync: Triggers 3D radio LED and floating 3D musical notes
 */
export class RadioMusicManager {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.volume = 0.5;
    this.currentTrack = null;
    this.currentSourceType = 'none'; // 'stream' | 'spotify' | 'upload' | 'synth'
    this.onStateChangeCallbacks = [];

    // HTML5 Audio element for search streams and local files
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.volume = this.volume;

    this.initAudioElementListeners();

    // Procedural Lo-Fi stations (ambient fallback)
    this.stations = [
      {
        id: "lofi",
        name: "Cozy Bedroom Lo-Fi",
        genre: "Chillhop",
        bpm: 72,
        scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
        chords: [
          [261.63, 329.63, 392.00, 493.88],
          [220.00, 261.63, 329.63, 392.00],
          [174.61, 220.00, 261.63, 329.63],
          [196.00, 246.94, 293.66, 349.23]
        ]
      },
      {
        id: "minecraft",
        name: "Minecraft Peaceful Calm",
        genre: "Ambient Piano",
        bpm: 56,
        scale: [220.00, 261.63, 329.63, 392.00, 440.00, 523.25],
        chords: [
          [174.61, 261.63, 329.63, 440.00],
          [130.81, 196.00, 246.94, 329.63],
          [146.83, 220.00, 261.63, 349.23],
          [196.00, 293.66, 349.23, 440.00]
        ]
      },
      {
        id: "zeta",
        name: "Zeta's Agent Lounge",
        genre: "Secret Agent Jazz",
        bpm: 80,
        scale: [246.94, 293.66, 329.63, 369.99, 440.00, 493.88],
        chords: [
          [123.47, 185.00, 246.94, 293.66],
          [164.81, 220.00, 261.63, 329.63],
          [146.83, 220.00, 293.66, 369.99],
          [185.00, 246.94, 293.66, 369.99]
        ]
      },
      {
        id: "beach",
        name: "Bali Beach Sunset",
        genre: "Warm Acoustic",
        bpm: 64,
        scale: [196.00, 220.00, 246.94, 293.66, 329.63, 392.00],
        chords: [
          [196.00, 246.94, 293.66, 392.00],
          [146.83, 220.00, 293.66, 369.99],
          [164.81, 196.00, 246.94, 329.63],
          [174.61, 220.00, 261.63, 349.23]
        ]
      }
    ];

    this.currentStationIndex = 0;
    this.synthTimerId = null;
    this.chordStep = 0;
  }

  initAudioElementListeners() {
    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyState();
    });

    this.audioElement.addEventListener('pause', () => {
      // If we didn't switch to another source, mark as paused
      if (this.currentSourceType === 'stream' || this.currentSourceType === 'upload') {
        this.isPlaying = false;
        this.notifyState();
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyState();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio streaming encountered an issue:', e);
      // Fallback to synth if stream fails
      if (this.isPlaying && this.currentSourceType === 'stream') {
        console.log('Falling back to built-in Lo-Fi synthesizer...');
        this.playSynthStation(0);
      }
    });
  }

  /**
   * Search songs via iTunes Search API (Free, SSL, no auth, full CORS allowed)
   */
  async searchSongs(query) {
    if (!query || !query.trim()) return [];
    try {
      const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(query.trim())}&entity=song&limit=15`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Search failed: ${response.status}`);
      const data = await response.json();
      
      return (data.results || []).map(item => ({
        id: item.trackId,
        title: item.trackName || 'Unknown Title',
        artist: item.artistName || 'Unknown Artist',
        album: item.collectionName || '',
        artworkUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '300x300') : '',
        previewUrl: item.previewUrl,
        durationMs: item.trackTimeMillis || 30000,
        source: 'search'
      }));
    } catch (err) {
      console.error('Error searching songs:', err);
      return [];
    }
  }

  /**
   * Play a track from search results
   */
  async playTrack(track) {
    this.stopSynth();

    this.currentTrack = {
      title: track.title,
      artist: track.artist,
      album: track.album || '',
      artworkUrl: track.artworkUrl || '',
      audioUrl: track.previewUrl,
      source: 'search'
    };
    this.currentSourceType = 'stream';

    if (track.previewUrl) {
      this.audioElement.src = track.previewUrl;
      this.audioElement.volume = this.volume;
      try {
        await this.audioElement.play();
        this.isPlaying = true;
        this.notifyState();
      } catch (err) {
        console.warn('Playback error (user interaction might be needed):', err);
      }
    }
  }

  /**
   * Play a user-uploaded local audio file (MP3 / WAV / OGG)
   */
  async playLocalAudio(file) {
    if (!file) return;
    this.stopSynth();

    const objectUrl = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, "");

    this.currentTrack = {
      title: cleanName,
      artist: "Local Audio File",
      album: "User Upload",
      artworkUrl: "",
      audioUrl: objectUrl,
      source: 'upload'
    };
    this.currentSourceType = 'upload';

    this.audioElement.src = objectUrl;
    this.audioElement.volume = this.volume;
    try {
      await this.audioElement.play();
      this.isPlaying = true;
      this.notifyState();
    } catch (err) {
      console.warn('Failed to play local audio:', err);
    }
  }

  /**
   * Convert Spotify link to embed iframe URL
   * Supports https://open.spotify.com/track/..., /playlist/..., /album/...
   */
  parseSpotifyUrl(rawUrl) {
    if (!rawUrl) return null;
    try {
      const url = new URL(rawUrl.trim());
      if (url.hostname.includes('spotify.com')) {
        const parts = url.pathname.split('/').filter(Boolean);
        // Expecting ['track', 'xyz'] or ['playlist', 'xyz'] or ['album', 'xyz']
        if (parts.length >= 2) {
          const type = parts[0];
          const id = parts[1];
          return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
        }
      }
    } catch {
      // not a standard URL, check uri format spotify:track:...
      const match = rawUrl.trim().match(/spotify:(track|playlist|album):([a-zA-Z0-9]+)/);
      if (match) {
        return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
      }
    }
    return null;
  }

  setSpotifyEmbed(embedUrl, title = "Spotify Music") {
    this.audioElement.pause();
    this.stopSynth();

    this.currentSourceType = 'spotify';
    this.isPlaying = true;
    this.currentTrack = {
      title: title,
      artist: "Spotify Player",
      album: "Embedded Stream",
      artworkUrl: "",
      embedUrl: embedUrl,
      source: 'spotify'
    };
    this.notifyState();
  }

  /**
   * Procedural Lo-Fi Synthesizer (Ambient Bedroom Mode)
   */
  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playSynthStation(stationIndex = 0) {
    this.audioElement.pause();
    this.ensureAudioContext();

    this.currentStationIndex = stationIndex % this.stations.length;
    const station = this.stations[this.currentStationIndex];
    this.currentSourceType = 'synth';
    this.isPlaying = true;

    this.currentTrack = {
      title: station.name,
      artist: "Raditya's Lo-Fi Synthesizer",
      album: station.genre,
      artworkUrl: "",
      source: 'synth'
    };

    this.stopSynth();
    this.scheduleSynthLoop();
    this.notifyState();
  }

  scheduleSynthLoop() {
    const station = this.stations[this.currentStationIndex];
    const beatInterval = (60 / station.bpm) * 1000;

    const tick = () => {
      if (!this.isPlaying || this.currentSourceType !== 'synth') return;
      this.playSynthChordStep();
      this.synthTimerId = setTimeout(tick, beatInterval * 2);
    };

    tick();
  }

  playSynthChordStep() {
    if (!this.audioCtx) return;
    const station = this.stations[this.currentStationIndex];
    const chord = station.chords[this.chordStep % station.chords.length];
    this.chordStep++;

    const now = this.audioCtx.currentTime;
    const chordDuration = (60 / station.bpm) * 1.9;

    chord.forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + chordDuration);

      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.12 + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + i * 0.03);
      osc.stop(now + chordDuration);
    });

    // Play subtle vinyl warmth
    this.playVinylCrack();
  }

  playVinylCrack() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const noiseBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 0.05, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.015;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1200;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);
  }

  stopSynth() {
    if (this.synthTimerId) {
      clearTimeout(this.synthTimerId);
      this.synthTimerId = null;
    }
  }

  /**
   * Unified Toggle Play / Pause
   */
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  play() {
    if (this.currentSourceType === 'stream' || this.currentSourceType === 'upload') {
      this.audioElement.play().catch(e => console.warn(e));
      this.isPlaying = true;
    } else if (this.currentSourceType === 'synth') {
      this.playSynthStation(this.currentStationIndex);
    } else if (this.currentSourceType === 'spotify') {
      this.isPlaying = true;
    } else {
      // Default to Cozy Lo-Fi
      this.playSynthStation(0);
    }
    this.notifyState();
  }

  pause() {
    this.isPlaying = false;
    this.audioElement.pause();
    this.stopSynth();
    this.notifyState();
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.audioElement.volume = this.volume;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx?.currentTime || 0);
    }
  }

  onStateChange(cb) {
    this.onStateChangeCallbacks.push(cb);
  }

  notifyState() {
    const state = {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      sourceType: this.currentSourceType,
      station: this.stations[this.currentStationIndex]
    };
    this.onStateChangeCallbacks.forEach(cb => cb(state));
  }
}
