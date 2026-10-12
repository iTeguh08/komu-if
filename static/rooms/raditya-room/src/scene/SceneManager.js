import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LightingManager } from './LightingManager.js';
import { RoomBuilder } from './RoomBuilder.js';
import { FurnitureBuilder } from './FurnitureBuilder.js';
import { PhotoGalleryBuilder } from './PhotoGalleryBuilder.js';
import { TVGamingBuilder } from './TVGamingBuilder.js';
import { InteractionManager } from './InteractionManager.js';
import { CharacterManager } from './CharacterManager.js';
import { ChatBubbleManager } from '../ui/ChatBubbleManager.js';
import { RadioBuilder } from './RadioBuilder.js';
import { RadioMusicManager } from '../audio/RadioMusicManager.js';

/**
 * Scene Manager for Raditya's Room
 * Centralizes Three.js setup, scene assembly, animation loop, and user controls.
 */
export class SceneManager {
  constructor({ container, config, onPhotoClick, onTVClick, onLampToggle, onRadioClick, onHoverChange }) {
    this.container = container;
    this.config = config;
    this.onPhotoClick = onPhotoClick;
    this.onTVClick = onTVClick;
    this.onLampToggle = onLampToggle;
    this.onRadioClick = onRadioClick;
    this.onHoverChange = onHoverChange;

    this.initThree();
    this.assembleRoom();
    this.initInteraction();
    this.initResizeListener();
    this.startLoop();
  }

  initThree() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xEEE8DF); // Soft warm neutral backdrop

    // 2. Camera (Three-quarter isometric diorama perspective)
    const { camera: camConfig } = this.config;
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(camConfig.fov || 40, aspect, 0.1, 50);
    this.camera.position.set(
      camConfig.initialPosition.x,
      camConfig.initialPosition.y,
      camConfig.initialPosition.z
    );

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls (Constrained so room is never clipped or inverted)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(camConfig.target.x, camConfig.target.y, camConfig.target.z);
    this.controls.minDistance = camConfig.minDistance || 5.0;
    this.controls.maxDistance = camConfig.maxDistance || 16.0;
    this.controls.maxPolarAngle = camConfig.maxPolarAngle || Math.PI / 2 - 0.05;
    this.controls.minPolarAngle = camConfig.minPolarAngle || 0.2;
    this.controls.update();

    this.clock = new THREE.Clock();

    // Chat Bubble Manager for speech bubbles above 3D characters
    this.chatBubbles = new ChatBubbleManager(this.container, this.camera);
  }

  assembleRoom() {
    // Lighting
    this.lighting = new LightingManager(this.scene, this.config);

    // Architecture
    this.room = new RoomBuilder(this.scene);

    // Furniture & Decor
    this.furniture = new FurnitureBuilder(this.scene);

    // Photo Gallery Wall
    this.gallery = new PhotoGalleryBuilder(this.scene, this.config);

    // TV & Gaming Corner
    this.tvGaming = new TVGamingBuilder(this.scene, this.config);

    // Couple Walking Characters (Raditya & Vestia Zeta)
    this.characters = new CharacterManager(this.scene, this.chatBubbles, this.tvGaming);

    // 3D Vintage Bedroom Radio & Music Player
    this.radio = new RadioBuilder(this.scene);
    this.music = new RadioMusicManager();
    this.music.onStateChange(({ isPlaying }) => {
      if (this.radio) {
        this.radio.setPlaying(isPlaying);
      }
    });
  }

  initInteraction() {
    this.interaction = new InteractionManager({
      camera: this.camera,
      controls: this.controls,
      domElement: this.renderer.domElement,
      onPhotoClick: (photo, previewUrl) => {
        if (this.onPhotoClick) this.onPhotoClick(photo, previewUrl);
      },
      onTVClick: () => {
        // Toggle TV screen on and fire TV interaction
        this.tvGaming.setPower(true);
        this.lighting.setTVGlow(1.4, 0x818CF8);
        if (this.onTVClick) this.onTVClick();
      },
      onLampToggle: () => {
        const isLampOn = this.lighting.toggleBedsideLamp();
        this.furniture.setLampEmissive(isLampOn);
        if (this.onLampToggle) this.onLampToggle(isLampOn);
      },
      onRadioToggle: () => {
        if (this.onRadioClick) {
          this.onRadioClick();
        } else {
          this.toggleRadioMusic();
        }
      },
      onCoupleClick: (charName) => {
        if (this.characters) {
          this.characters.interactWithCharacter(charName);
        }
      },
      onHoverChange: (hoverData) => {
        if (this.onHoverChange) this.onHoverChange(hoverData);
      }
    });

    // Combine all clickable meshes
    const allInteractive = [
      ...this.furniture.getInteractiveObjects(),
      ...this.gallery.getInteractiveObjects(),
      ...this.tvGaming.getInteractiveObjects(),
      ...this.characters.getInteractiveObjects(),
      ...this.radio.getInteractiveObjects()
    ];
    this.interaction.setInteractiveTargets(allInteractive);
  }

  toggleRadioMusic() {
    if (!this.music) return false;
    const isPlaying = this.music.togglePlay();
    if (this.radio) {
      this.radio.setPlaying(isPlaying);
    }
    return isPlaying;
  }

  nextRadioStation() {
    if (!this.music) return null;
    return this.music.nextStation();
  }

  getMusicManager() {
    return this.music;
  }

  setLightingPreset(presetName) {
    this.lighting.applyPreset(presetName, true);
    if (presetName === 'evening') {
      this.scene.background.set(0x181824);
      this.room.setSkyColor(0x1B1B30);
      this.furniture.setLampEmissive(true);
    } else {
      this.scene.background.set(0xEEE8DF);
      this.room.setSkyColor(0x87CEEB);
      this.furniture.setLampEmissive(false);
    }
  }

  toggleLamp() {
    const isLampOn = this.lighting.toggleBedsideLamp();
    this.furniture.setLampEmissive(isLampOn);
    return isLampOn;
  }

  setTVPower(isOn) {
    this.tvGaming.setPower(isOn);
    this.lighting.setTVGlow(isOn ? 1.4 : 0.15, isOn ? 0x818CF8 : 0x222233);
  }

  resetCamera() {
    this.interaction.resetCamera();
  }

  initResizeListener() {
    this.resizeHandler = () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  startLoop() {
    const animate = () => {
      this.animId = requestAnimationFrame(animate);
      const delta = this.clock.getDelta();

      this.controls.update();
      this.interaction.update();
      this.lighting.update(delta);
      if (this.characters) {
        this.characters.update(delta);
      }
      if (this.chatBubbles) {
        this.chatBubbles.update(delta);
      }
      if (this.radio) {
        this.radio.update(delta);
      }

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  destroy() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.resizeHandler);
    this.interaction.destroy();
    if (this.chatBubbles) {
      this.chatBubbles.destroy();
    }
    this.renderer.dispose();
  }
}
