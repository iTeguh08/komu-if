import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * Room Builder for Raditya's Room
 * Constructs stylized bedroom architecture: walls, oak floor, window, and curtains.
 */
export class RoomBuilder {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.initMaterials();
    this.buildArchitecture();
  }

  initMaterials() {
    this.woodFloorTex = TextureGenerator.createWoodPlanksTexture();
    this.wallTex = TextureGenerator.createWallTexture();

    this.floorMaterial = new THREE.MeshStandardMaterial({
      map: this.woodFloorTex,
      roughness: 0.65,
      metalness: 0.05
    });

    this.wallMaterial = new THREE.MeshStandardMaterial({
      map: this.wallTex,
      roughness: 0.9,
      metalness: 0.0
    });

    this.woodTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x9B6C3F,
      roughness: 0.7,
      metalness: 0.05
    });

    this.curtainMaterial = new THREE.MeshStandardMaterial({
      color: 0xF2ECE1,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide
    });

    this.glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xCFE7FA,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.55
    });

    this.skyBackdropMaterial = new THREE.MeshBasicMaterial({
      color: 0x87CEEB
    });
  }

  buildArchitecture() {
    // 1. Oak Wood Floor
    const floorGeo = new THREE.BoxGeometry(8.0, 0.4, 8.0);
    const floorMesh = new THREE.Mesh(floorGeo, this.floorMaterial);
    floorMesh.position.set(0, -0.2, 0);
    floorMesh.receiveShadow = true;
    this.group.add(floorMesh);

    // Stylized diorama base rim (under floor)
    const baseRimGeo = new THREE.BoxGeometry(8.2, 0.5, 8.2);
    const baseRimMat = new THREE.MeshStandardMaterial({
      color: 0x5C3E20,
      roughness: 0.8
    });
    const baseRim = new THREE.Mesh(baseRimGeo, baseRimMat);
    baseRim.position.set(0, -0.45, 0);
    this.group.add(baseRim);

    // 2. Back Wall (Z = -4.0)
    const backWallGeo = new THREE.BoxGeometry(8.0, 4.2, 0.3);
    const backWallMesh = new THREE.Mesh(backWallGeo, this.wallMaterial);
    backWallMesh.position.set(0, 2.1, -4.15);
    backWallMesh.receiveShadow = true;
    this.group.add(backWallMesh);

    // 3. Left Wall (X = -4.0)
    const leftWallGeo = new THREE.BoxGeometry(0.3, 4.2, 8.0);
    const leftWallMesh = new THREE.Mesh(leftWallGeo, this.wallMaterial);
    leftWallMesh.position.set(-4.15, 2.1, 0);
    leftWallMesh.receiveShadow = true;
    this.group.add(leftWallMesh);

    // 4. Baseboards along wall edges
    const baseboardBackGeo = new THREE.BoxGeometry(8.0, 0.18, 0.08);
    const baseboardBack = new THREE.Mesh(baseboardBackGeo, this.woodTrimMaterial);
    baseboardBack.position.set(0, 0.09, -3.96);
    this.group.add(baseboardBack);

    const baseboardLeftGeo = new THREE.BoxGeometry(0.08, 0.18, 8.0);
    const baseboardLeft = new THREE.Mesh(baseboardLeftGeo, this.woodTrimMaterial);
    baseboardLeft.position.set(-3.96, 0.09, 0);
    this.group.add(baseboardLeft);

    // 5. Crown Molding at wall top
    const crownBackGeo = new THREE.BoxGeometry(8.0, 0.14, 0.1);
    const crownBack = new THREE.Mesh(crownBackGeo, this.woodTrimMaterial);
    crownBack.position.set(0, 4.13, -3.95);
    this.group.add(crownBack);

    const crownLeftGeo = new THREE.BoxGeometry(0.1, 0.14, 8.0);
    const crownLeft = new THREE.Mesh(crownLeftGeo, this.woodTrimMaterial);
    crownLeft.position.set(-3.95, 4.13, 0);
    this.group.add(crownLeft);

    // 6. Stylized Window with Curtains on Left Wall
    this.buildWindow();
  }

  buildWindow() {
    const windowGroup = new THREE.Group();
    windowGroup.position.set(-3.95, 2.2, 1.6);

    // Outer wooden window frame
    const frameW = 0.08;
    const frameH = 2.0;
    const frameD = 2.4;

    // Sill
    const sillGeo = new THREE.BoxGeometry(0.24, 0.08, frameD + 0.3);
    const sill = new THREE.Mesh(sillGeo, this.woodTrimMaterial);
    sill.position.set(0.06, -frameH / 2, 0);
    sill.castShadow = true;
    sill.receiveShadow = true;
    windowGroup.add(sill);

    // Top Header
    const topHeader = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, frameD + 0.2), this.woodTrimMaterial);
    topHeader.position.set(0.02, frameH / 2, 0);
    windowGroup.add(topHeader);

    // Window Glass Pane
    const glassGeo = new THREE.BoxGeometry(0.04, frameH - 0.1, frameD - 0.1);
    const glass = new THREE.Mesh(glassGeo, this.glassMaterial);
    glass.position.set(0.02, 0, 0);
    windowGroup.add(glass);

    // Window Sky Backdrop (simulating warm outside horizon)
    const skyGeo = new THREE.BoxGeometry(0.02, frameH + 0.2, frameD + 0.2);
    this.skyBackdrop = new THREE.Mesh(skyGeo, this.skyBackdropMaterial);
    this.skyBackdrop.position.set(-0.06, 0, 0);
    windowGroup.add(this.skyBackdrop);

    // Window Mullions (cross dividers)
    const mullionHoriz = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, frameD - 0.1), this.woodTrimMaterial);
    mullionHoriz.position.set(0.02, 0, 0);
    windowGroup.add(mullionHoriz);

    const mullionVert = new THREE.Mesh(new THREE.BoxGeometry(0.06, frameH - 0.1, 0.04), this.woodTrimMaterial);
    mullionVert.position.set(0.02, 0, 0);
    windowGroup.add(mullionVert);

    // Curtain Rod
    const rodGeo = new THREE.CylinderGeometry(0.025, 0.025, frameD + 0.7, 16);
    const rod = new THREE.Mesh(rodGeo, this.woodTrimMaterial);
    rod.rotation.x = Math.PI / 2;
    rod.position.set(0.18, frameH / 2 + 0.18, 0);
    windowGroup.add(rod);

    // Left and Right Draped Curtains (wavy stylized folds)
    const buildCurtainPanel = (zPos) => {
      const panel = new THREE.Group();
      const folds = 5;
      const foldW = 0.07;
      const foldH = frameH + 0.4;
      for (let f = 0; f < folds; f++) {
        const foldGeo = new THREE.CylinderGeometry(0.035, 0.045, foldH, 12);
        const foldMesh = new THREE.Mesh(foldGeo, this.curtainMaterial);
        foldMesh.position.set(0.16 + (f % 2) * 0.03, -0.1, (f - folds / 2) * foldW);
        foldMesh.castShadow = true;
        panel.add(foldMesh);
      }
      panel.position.z = zPos;
      return panel;
    };

    windowGroup.add(buildCurtainPanel(-frameD / 2 - 0.12));
    windowGroup.add(buildCurtainPanel(frameD / 2 + 0.12));

    this.group.add(windowGroup);
  }

  setSkyColor(colorHex) {
    if (this.skyBackdrop) {
      this.skyBackdrop.material.color.set(colorHex);
    }
  }
}
