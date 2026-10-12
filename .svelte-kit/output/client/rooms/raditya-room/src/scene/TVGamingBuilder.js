import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * TV and Gaming Corner Builder for Raditya's Room
 * Constructs media console credenza, 3D television, PlayStation-style console, controller, and soundbar.
 */
export class TVGamingBuilder {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.isTVOn = false;
    this.interactiveObjects = [];

    this.initMaterials();
    this.buildMediaCredenza();
    this.buildTelevision();
    this.buildGamingConsole();
    this.buildFloorPouf();
  }

  initMaterials() {
    this.oakMat = new THREE.MeshStandardMaterial({
      color: 0x9E6B38,
      roughness: 0.65,
      metalness: 0.05
    });

    this.darkSlateMat = new THREE.MeshStandardMaterial({
      color: 0x242428,
      roughness: 0.35,
      metalness: 0.2
    });

    this.psShellMat = new THREE.MeshStandardMaterial({
      color: 0xEEEEF2,
      roughness: 0.3,
      metalness: 0.1
    });

    this.screenOffTex = TextureGenerator.createTVScreenTexture(false);
    this.screenOnTex = TextureGenerator.createTVScreenTexture(true);

    this.screenMaterial = new THREE.MeshStandardMaterial({
      map: this.screenOffTex,
      roughness: 0.2,
      metalness: 0.1,
      emissive: 0x000000,
      emissiveIntensity: 0.0
    });

    this.poufMat = new THREE.MeshStandardMaterial({
      color: 0xBA6336, // Warm terracotta
      roughness: 0.9,
      metalness: 0.0
    });
  }

  buildMediaCredenza() {
    const credenza = new THREE.Group();
    credenza.position.set(1.8, 0.26, -3.2);

    // Main credenza box
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 0.48, 0.65),
      this.oakMat
    );
    body.castShadow = true;
    body.receiveShadow = true;
    credenza.add(body);

    // Open center media cavity
    const cavityMat = new THREE.MeshStandardMaterial({ color: 0x6E451F, roughness: 0.8 });
    const cavity = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.28, 0.6),
      cavityMat
    );
    cavity.position.set(0, 0.04, 0.04);
    credenza.add(cavity);

    // 4 credenza legs
    const legGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.16, 12);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x4A2F16, roughness: 0.8 });
    const legOffsets = [
      [-1.0, -0.32, -0.24],
      [1.0, -0.32, -0.24],
      [-1.0, -0.32, 0.24],
      [1.0, -0.32, 0.24]
    ];
    legOffsets.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      credenza.add(leg);
    });

    this.group.add(credenza);
  }

  buildTelevision() {
    this.tvGroup = new THREE.Group();
    this.tvGroup.position.set(1.8, 0.5, -3.2);

    // TV Metal Base
    const baseGeo = new THREE.BoxGeometry(0.7, 0.02, 0.3);
    const base = new THREE.Mesh(baseGeo, this.darkSlateMat);
    base.position.set(0, 0.01, 0);
    base.castShadow = true;
    this.tvGroup.add(base);

    // TV Stand Neck
    const neckGeo = new THREE.BoxGeometry(0.12, 0.16, 0.08);
    const neck = new THREE.Mesh(neckGeo, this.darkSlateMat);
    neck.position.set(0, 0.09, -0.04);
    this.tvGroup.add(neck);

    // TV Outer Frame (Sleek dark bezel)
    const tvW = 1.9;
    const tvH = 1.12;
    const frameGeo = new THREE.BoxGeometry(tvW, tvH, 0.05);
    const frame = new THREE.Mesh(frameGeo, this.darkSlateMat);
    frame.position.set(0, 0.72, 0);
    frame.castShadow = true;
    this.tvGroup.add(frame);

    // TV Screen (16:9 Plane)
    const screenGeo = new THREE.PlaneGeometry(tvW - 0.06, tvH - 0.06);
    this.screenMesh = new THREE.Mesh(screenGeo, this.screenMaterial);
    this.screenMesh.position.set(0, 0.72, 0.028);
    this.tvGroup.add(this.screenMesh);

    // Soundbar resting under screen
    const soundbar = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.06, 0.1),
      this.darkSlateMat
    );
    soundbar.position.set(0, 0.04, 0.08);
    soundbar.castShadow = true;
    this.tvGroup.add(soundbar);

    // User data for click handling
    const tvInteractiveData = {
      isInteractive: true,
      action: 'launchTVGame',
      name: "Raditya's Gaming Station",
      hint: "Click to power on TV and launch game"
    };
    this.screenMesh.userData = tvInteractiveData;
    frame.userData = tvInteractiveData;

    this.interactiveObjects.push(this.screenMesh, frame);
    this.group.add(this.tvGroup);
  }

  buildGamingConsole() {
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(1.8, 0.32, -3.15); // Resting in credenza center cavity

    // PlayStation-style console: curved white outer panels + black center
    const blackCore = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.08, 0.28),
      this.darkSlateMat
    );
    consoleGroup.add(blackCore);

    // Top & Bottom White curved wings
    const topWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.015, 0.3),
      this.psShellMat
    );
    topWing.position.set(0, 0.05, 0);
    consoleGroup.add(topWing);

    const bottomWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.015, 0.3),
      this.psShellMat
    );
    bottomWing.position.set(0, -0.05, 0);
    consoleGroup.add(bottomWing);

    // LED Glow line on console front
    this.consoleLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.008, 0.01),
      new THREE.MeshBasicMaterial({ color: 0x60A5FA })
    );
    this.consoleLed.position.set(0, 0.02, 0.145);
    consoleGroup.add(this.consoleLed);

    this.group.add(consoleGroup);

    // Controller resting on credenza top
    const controllerGroup = new THREE.Group();
    controllerGroup.position.set(1.1, 0.52, -3.1);
    controllerGroup.rotation.y = 0.3;

    const controllerBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.04, 0.12),
      this.psShellMat
    );
    controllerGroup.add(controllerBody);

    // Controller grips
    const gripGeo = new THREE.CylinderGeometry(0.025, 0.02, 0.12, 12);
    const leftGrip = new THREE.Mesh(gripGeo, this.psShellMat);
    leftGrip.rotation.x = Math.PI / 4;
    leftGrip.position.set(-0.08, -0.02, 0.04);
    controllerGroup.add(leftGrip);

    const rightGrip = new THREE.Mesh(gripGeo, this.psShellMat);
    rightGrip.rotation.x = Math.PI / 4;
    rightGrip.position.set(0.08, -0.02, 0.04);
    controllerGroup.add(rightGrip);

    // Thumbsticks
    const stickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.02, 10);
    const leftStick = new THREE.Mesh(stickGeo, this.darkSlateMat);
    leftStick.position.set(-0.04, 0.03, 0.01);
    controllerGroup.add(leftStick);

    const rightStick = new THREE.Mesh(stickGeo, this.darkSlateMat);
    rightStick.position.set(0.04, 0.03, 0.01);
    controllerGroup.add(rightStick);

    controllerGroup.userData = {
      isInteractive: true,
      action: 'launchTVGame',
      name: "Wireless Controller",
      hint: "Click to launch game"
    };
    this.interactiveObjects.push(controllerBody);

    this.group.add(controllerGroup);
  }

  buildFloorPouf() {
    // Soft circular floor cushion for gaming
    const poufGeo = new THREE.CylinderGeometry(0.42, 0.46, 0.22, 20);
    const pouf = new THREE.Mesh(poufGeo, this.poufMat);
    pouf.position.set(1.8, 0.11, -1.8);
    pouf.castShadow = true;
    pouf.receiveShadow = true;
    this.group.add(pouf);
  }

  setPower(isOn) {
    this.isTVOn = isOn;
    if (this.screenMesh && this.screenMaterial) {
      this.screenMaterial.map = isOn ? this.screenOnTex : this.screenOffTex;
      this.screenMaterial.emissive = new THREE.Color(isOn ? 0x4338CA : 0x000000);
      this.screenMaterial.emissiveIntensity = isOn ? 0.75 : 0.0;
      this.screenMaterial.needsUpdate = true;
    }
    if (this.consoleLed) {
      this.consoleLed.material.color.setHex(isOn ? 0x38BDF8 : 0x60A5FA);
    }
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }
}
