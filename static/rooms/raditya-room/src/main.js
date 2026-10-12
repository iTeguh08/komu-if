import { roomConfig } from './config/roomConfig.js';
import { SceneManager } from './scene/SceneManager.js';
import { OverlayManager } from './ui/OverlayManager.js';

/**
 * Main Application Entry Point
 * Initializes 3D bedroom scene, UI controls, and event wiring.
 */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  if (!container) {
    console.error('Fatal: canvas-container element not found.');
    return;
  }

  // 1. Initialize Overlay & Modal Manager
  const overlayManager = new OverlayManager(roomConfig);

  // 2. Initialize 3D Scene
  let currentLightingPreset = roomConfig.lighting.defaultPreset || 'daylight';
  let isLampActive = currentLightingPreset === 'evening';

  const sceneManager = new SceneManager({
    container,
    config: roomConfig,
    onPhotoClick: (photo, previewUrl) => {
      overlayManager.openPhotoModal(photo, previewUrl);
    },
    onTVClick: () => {
      overlayManager.openTVGameModal();
    },
    onLampToggle: (isLampOn) => {
      isLampActive = isLampOn;
      updateLampButtonUI(isLampActive);
    },
    onRadioClick: () => {
      overlayManager.openRadioModal();
    },
    onHoverChange: (hoverData) => {
      overlayManager.showInteractionCue(hoverData);
    }
  });

  // Connect Music Manager to Overlay Manager for search & player UI
  overlayManager.setMusicManager(sceneManager.getMusicManager());

  // 3. Toolbar Controls Setup
  const btnLighting = document.getElementById('btn-lighting-preset');
  const labelLighting = document.getElementById('label-lighting');
  const btnLamp = document.getElementById('btn-lamp-toggle');
  const labelLamp = document.getElementById('label-lamp');
  const btnReset = document.getElementById('btn-reset-camera');
  const btnInfo = document.getElementById('btn-room-info');

  function updateLightingButtonUI(preset) {
    if (!btnLighting || !labelLighting) return;
    if (preset === 'evening') {
      labelLighting.textContent = 'Cozy Evening';
      btnLighting.classList.add('active');
    } else {
      labelLighting.textContent = 'Morning Sun';
      btnLighting.classList.remove('active');
    }
  }

  function updateLampButtonUI(isOn) {
    if (!btnLamp || !labelLamp) return;
    if (isOn) {
      labelLamp.textContent = 'Lamp On';
      btnLamp.classList.add('active');
    } else {
      labelLamp.textContent = 'Lamp Off';
      btnLamp.classList.remove('active');
    }
  }

  // Initialize UI button states
  updateLightingButtonUI(currentLightingPreset);
  updateLampButtonUI(isLampActive);

  // Toggle Daylight / Evening Atmosphere
  if (btnLighting) {
    btnLighting.addEventListener('click', () => {
      currentLightingPreset = currentLightingPreset === 'daylight' ? 'evening' : 'daylight';
      sceneManager.setLightingPreset(currentLightingPreset);
      updateLightingButtonUI(currentLightingPreset);

      isLampActive = currentLightingPreset === 'evening';
      updateLampButtonUI(isLampActive);
    });
  }

  // Toggle Bedside Lamp
  if (btnLamp) {
    btnLamp.addEventListener('click', () => {
      isLampActive = sceneManager.toggleLamp();
      updateLampButtonUI(isLampActive);
    });
  }

  // Reset Camera View
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      sceneManager.resetCamera();
    });
  }

  // Radio Toolbar Controls
  const btnRadioToggle = document.getElementById('btn-radio-toggle');
  const labelRadio = document.getElementById('label-radio');
  const btnRadioNext = document.getElementById('btn-radio-next');

  function updateRadioUI(isPlaying, currentTrack, station) {
    if (!btnRadioToggle || !labelRadio) return;
    if (isPlaying) {
      const title = currentTrack?.title || station?.name || 'Playing';
      const cleanTitle = title.length > 18 ? title.substring(0, 16) + '...' : title;
      labelRadio.textContent = `Radio: ${cleanTitle}`;
      btnRadioToggle.classList.add('active');
    } else {
      labelRadio.textContent = 'Radio: Off';
      btnRadioToggle.classList.remove('active');
    }
  }

  // Subscribe to music manager state updates (triggered via UI or clicking 3D radio mesh)
  const musicManager = sceneManager.getMusicManager();
  if (musicManager) {
    musicManager.onStateChange(({ isPlaying, currentTrack, station }) => {
      updateRadioUI(isPlaying, currentTrack, station);
    });
  }

  if (btnRadioToggle) {
    btnRadioToggle.addEventListener('click', () => {
      overlayManager.openRadioModal();
    });
  }

  if (btnRadioNext) {
    btnRadioNext.addEventListener('click', () => {
      sceneManager.nextRadioStation();
    });
  }

  // Open Room Information Modal
  if (btnInfo) {
    btnInfo.addEventListener('click', () => {
      overlayManager.openInfoModal();
    });
  }

  console.log("Raditya's Room initialized successfully with Three.js.");
});
