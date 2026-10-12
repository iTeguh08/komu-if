import * as THREE from 'three';

/**
 * 3D Vintage Radio Builder for Raditya's Room
 * Constructs retro wooden radio with brass knobs, speaker grille, antenna, and floating musical notes.
 */
export class RadioBuilder {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = "Vintage Radio";
    this.scene.add(this.group);

    this.isPlaying = false;
    this.interactiveObjects = [];
    this.noteParticles = [];

    this.initMaterials();
    this.buildRadioMesh();
    this.initNoteParticles();
  }

  initMaterials() {
    this.woodMat = new THREE.MeshStandardMaterial({
      color: 0x8C4E22, // Rich vintage teak
      roughness: 0.6,
      metalness: 0.05
    });

    this.speakerClothMat = new THREE.MeshStandardMaterial({
      color: 0xEAE1D0, // Cream retro mesh
      roughness: 0.9,
      metalness: 0.0
    });

    this.dialMat = new THREE.MeshStandardMaterial({
      color: 0x221E1A,
      roughness: 0.4,
      emissive: 0x000000,
      emissiveIntensity: 0.0
    });

    this.brassMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.35,
      metalness: 0.8
    });

    this.ledMat = new THREE.MeshBasicMaterial({
      color: 0x442211
    });

    this.antennaMat = new THREE.MeshStandardMaterial({
      color: 0xCCCCCC,
      roughness: 0.25,
      metalness: 0.9
    });
  }

  buildRadioMesh() {
    // Placed on bedside nightstand or media credenza
    // Let's place it on the media credenza: (x: 0.65, y: 0.52, z: -3.15)
    this.group.position.set(0.65, 0.52, -3.15);

    // 1. Wooden Cabinet
    const bodyGeo = new THREE.BoxGeometry(0.46, 0.28, 0.22);
    const body = new THREE.Mesh(bodyGeo, this.woodMat);
    body.position.y = 0.14;
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);

    // 2. Speaker Cloth Grille (Left half of front)
    const grilleGeo = new THREE.BoxGeometry(0.22, 0.20, 0.01);
    const grille = new THREE.Mesh(grilleGeo, this.speakerClothMat);
    grille.position.set(-0.09, 0.14, 0.115);
    this.group.add(grille);

    // Horizontal retro grille slats
    for (let s = 0; s < 4; s++) {
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(0.20, 0.012, 0.015),
        this.woodMat
      );
      slat.position.set(-0.09, 0.07 + s * 0.045, 0.12);
      this.group.add(slat);
    }

    // 3. Radio Tuning Dial Window (Right half of front)
    const dialGeo = new THREE.BoxGeometry(0.16, 0.09, 0.01);
    this.dialMesh = new THREE.Mesh(dialGeo, this.dialMat);
    this.dialMesh.position.set(0.11, 0.18, 0.115);
    this.group.add(this.dialMesh);

    // 4. Brass Knobs (Volume & Tuning)
    const knobGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.02, 14);
    knobGeo.rotateX(Math.PI / 2);

    const knobVol = new THREE.Mesh(knobGeo, this.brassMat);
    knobVol.position.set(0.06, 0.08, 0.12);
    this.group.add(knobVol);

    const knobTune = new THREE.Mesh(knobGeo, this.brassMat);
    knobTune.position.set(0.16, 0.08, 0.12);
    this.group.add(knobTune);

    // 5. Power Indicator LED
    const ledGeo = new THREE.SphereGeometry(0.012, 10, 8);
    this.ledMesh = new THREE.Mesh(ledGeo, this.ledMat);
    this.ledMesh.position.set(0.18, 0.23, 0.12);
    this.group.add(this.ledMesh);

    // 6. Telescopic Metal Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.006, 0.008, 0.42, 8);
    const antenna = new THREE.Mesh(antennaGeo, this.antennaMat);
    antenna.position.set(-0.16, 0.45, -0.06);
    antenna.rotation.z = -0.3;
    antenna.rotation.x = -0.15;
    this.group.add(antenna);

    // Interactive data
    const radioData = {
      isInteractive: true,
      action: 'toggleRadio',
      name: "Vintage Bedroom Radio",
      hint: "Click to open Spotify & music search"
    };

    body.userData = radioData;
    grille.userData = radioData;
    this.dialMesh.userData = radioData;

    this.interactiveObjects.push(body, grille, this.dialMesh);
  }

  initNoteParticles() {
    // Generate musical notes canvas texture (♫ ♪ ♬)
    const symbols = ['♫', '♪', '♬'];
    this.noteTextures = symbols.map(sym => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#D97736'; // Warm terracotta amber
      ctx.font = 'bold 42px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sym, 32, 32);
      return new THREE.CanvasTexture(canvas);
    });

    // Create 4 floating particle sprites
    for (let i = 0; i < 4; i++) {
      const mat = new THREE.SpriteMaterial({
        map: this.noteTextures[i % this.noteTextures.length],
        transparent: true,
        opacity: 0
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.2, 0.2, 0.2);
      this.group.add(sprite);

      this.noteParticles.push({
        sprite,
        offset: i * 0.8,
        speed: 0.35 + Math.random() * 0.2,
        yProgress: i * 0.25
      });
    }
  }

  setPlaying(isOn) {
    this.isPlaying = isOn;
    if (this.ledMesh) {
      this.ledMesh.material.color.setHex(isOn ? 0x22C55E : 0x442211);
    }
    if (this.dialMesh) {
      this.dialMesh.material.emissive.setHex(isOn ? 0x92400E : 0x000000);
      this.dialMesh.material.emissiveIntensity = isOn ? 0.8 : 0.0;
    }
  }

  update(delta) {
    if (!this.isPlaying) {
      this.noteParticles.forEach(p => {
        p.sprite.material.opacity = 0;
      });
      return;
    }

    const time = performance.now() * 0.001;

    // Animate floating musical notes
    this.noteParticles.forEach((p, idx) => {
      p.yProgress += delta * p.speed;
      if (p.yProgress > 1.0) {
        p.yProgress = 0;
      }

      const t = p.yProgress;
      const x = -0.16 + Math.sin(time * 3 + idx) * 0.12;
      const y = 0.55 + t * 0.7;
      const z = -0.06 + Math.cos(time * 2 + idx) * 0.08;

      p.sprite.position.set(x, y, z);
      // Fade in and fade out curve
      const opacity = Math.sin(t * Math.PI) * 0.9;
      p.sprite.material.opacity = opacity;
      p.sprite.scale.set(0.15 + t * 0.1, 0.15 + t * 0.1, 0.15 + t * 0.1);
    });
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }
}
