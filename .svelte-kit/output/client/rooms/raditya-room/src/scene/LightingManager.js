import * as THREE from 'three';

/**
 * Lighting Manager for Raditya's Room
 * Controls daylight vs evening moods, interactive bedside lamp, and TV glow.
 */
export class LightingManager {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.currentPresetName = config.lighting.defaultPreset || 'daylight';
    this.isLampOn = this.currentPresetName === 'evening';

    this.initLights();
    this.applyPreset(this.currentPresetName, false);
  }

  initLights() {
    // 1. Ambient hemisphere light
    this.hemiLight = new THREE.HemisphereLight(0xfff8ee, 0xe3d5c5, 0.9);
    this.scene.add(this.hemiLight);

    // 2. Primary directional sun / moon light streaming through window and cutaway
    this.dirLight = new THREE.DirectionalLight(0xfff3dc, 1.6);
    this.dirLight.position.set(-8, 7, 3);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 1;
    this.dirLight.shadow.camera.far = 25;
    this.dirLight.shadow.camera.left = -6;
    this.dirLight.shadow.camera.right = 6;
    this.dirLight.shadow.camera.top = 6;
    this.dirLight.shadow.camera.bottom = -6;
    this.dirLight.shadow.bias = -0.0005;
    this.dirLight.shadow.radius = 2.5; // Soft stylized shadow
    this.scene.add(this.dirLight);

    // 3. Window aperture soft fill light
    this.windowLight = new THREE.PointLight(0xebf3ff, 1.8, 12, 1.2);
    this.windowLight.position.set(-3.8, 2.3, 1.6);
    this.scene.add(this.windowLight);

    // 4. Interactive bedside lamp light
    this.lampLight = new THREE.PointLight(0xffb347, 0, 6, 1.6);
    this.lampLight.position.set(-3.3, 1.4, -3.3);
    this.lampLight.castShadow = true;
    this.lampLight.shadow.bias = -0.001;
    this.lampLight.shadow.mapSize.width = 1024;
    this.lampLight.shadow.mapSize.height = 1024;
    this.scene.add(this.lampLight);

    // 5. Television screen emissive ambient glow
    this.tvGlow = new THREE.PointLight(0x818cf8, 0.2, 5, 1.8);
    this.tvGlow.position.set(1.8, 1.35, -2.8);
    this.scene.add(this.tvGlow);

    // 6. Subtle soft fill from viewer camera direction
    this.cameraFillLight = new THREE.DirectionalLight(0xfff5e6, 0.4);
    this.cameraFillLight.position.set(6, 4, 6);
    this.scene.add(this.cameraFillLight);
  }

  applyPreset(presetName, animate = true) {
    const preset = this.config.lighting.presets[presetName];
    if (!preset) return;
    this.currentPresetName = presetName;

    const targetHemiColor = new THREE.Color(preset.skyColor);
    const targetHemiGround = new THREE.Color(preset.groundColor);
    const targetDirColor = new THREE.Color(preset.sunColor);
    const targetWindowColor = new THREE.Color(preset.windowLightColor);

    if (!animate) {
      this.hemiLight.color.copy(targetHemiColor);
      this.hemiLight.groundColor.copy(targetHemiGround);
      this.hemiLight.intensity = preset.ambientIntensity;

      this.dirLight.color.copy(targetDirColor);
      this.dirLight.intensity = preset.sunIntensity;
      this.dirLight.position.set(preset.sunPosition.x, preset.sunPosition.y, preset.sunPosition.z);

      this.windowLight.color.copy(targetWindowColor);
      this.windowLight.intensity = preset.windowIntensity;

      // Lamp defaults for preset unless manually toggled
      if (presetName === 'evening') {
        this.isLampOn = true;
        this.lampLight.intensity = preset.lampIntensity;
      } else {
        this.isLampOn = false;
        this.lampLight.intensity = 0;
      }
      this.tvGlow.intensity = preset.tvGlowIntensity;
    } else {
      // Smooth transition
      this.targetPreset = {
        hemiColor: targetHemiColor,
        hemiGround: targetHemiGround,
        hemiIntensity: preset.ambientIntensity,
        dirColor: targetDirColor,
        dirIntensity: preset.sunIntensity,
        dirPos: preset.sunPosition,
        windowColor: targetWindowColor,
        windowIntensity: preset.windowIntensity,
        lampIntensity: presetName === 'evening' ? preset.lampIntensity : 0,
        tvGlowIntensity: preset.tvGlowIntensity
      };
      this.isLampOn = presetName === 'evening';
      this.transitionProgress = 0;
    }
  }

  toggleBedsideLamp() {
    this.isLampOn = !this.isLampOn;
    this.lampLight.intensity = this.isLampOn ? 2.2 : 0;
    return this.isLampOn;
  }

  setBedsideLamp(state) {
    this.isLampOn = state;
    this.lampLight.intensity = this.isLampOn ? 2.2 : 0;
  }

  setTVGlow(intensity, colorHex = 0x818cf8) {
    this.tvGlow.intensity = intensity;
    this.tvGlow.color.setHex(colorHex);
  }

  update(delta) {
    if (this.targetPreset && this.transitionProgress < 1) {
      this.transitionProgress = Math.min(1, this.transitionProgress + delta * 2.0);
      const t = this.transitionProgress;

      this.hemiLight.color.lerp(this.targetPreset.hemiColor, 0.1);
      this.hemiLight.groundColor.lerp(this.targetPreset.hemiGround, 0.1);
      this.hemiLight.intensity = THREE.MathUtils.lerp(this.hemiLight.intensity, this.targetPreset.hemiIntensity, 0.1);

      this.dirLight.color.lerp(this.targetPreset.dirColor, 0.1);
      this.dirLight.intensity = THREE.MathUtils.lerp(this.dirLight.intensity, this.targetPreset.dirIntensity, 0.1);

      this.windowLight.color.lerp(this.targetPreset.windowColor, 0.1);
      this.windowLight.intensity = THREE.MathUtils.lerp(this.windowLight.intensity, this.targetPreset.windowIntensity, 0.1);

      this.lampLight.intensity = THREE.MathUtils.lerp(this.lampLight.intensity, this.targetPreset.lampIntensity, 0.1);
      this.tvGlow.intensity = THREE.MathUtils.lerp(this.tvGlow.intensity, this.targetPreset.tvGlowIntensity, 0.1);

      if (this.transitionProgress >= 1) {
        this.targetPreset = null;
      }
    }
  }
}
