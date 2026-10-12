import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';
import { CharacterBuilder } from './CharacterBuilder.js';

/**
 * Furniture Builder for Raditya's Room
 * Constructs stylized, cozy bed, nightstand, interactive lamp, rug, desk, chair, and accessories.
 */
export class FurnitureBuilder {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.interactiveObjects = []; // Stores meshes that can be clicked
    this.initMaterials();
    this.buildBedArea();
    this.buildDeskArea();
    this.buildFloorPlant();
  }

  initMaterials() {
    this.rugTexture = TextureGenerator.createRugTexture();

    // Wood materials
    this.warmOakMat = new THREE.MeshStandardMaterial({
      color: 0x9E6B38,
      roughness: 0.65,
      metalness: 0.05
    });

    this.darkOakMat = new THREE.MeshStandardMaterial({
      color: 0x734822,
      roughness: 0.7,
      metalness: 0.05
    });

    // Fabric materials
    this.mattressMat = new THREE.MeshStandardMaterial({
      color: 0xFAF6F0,
      roughness: 0.9,
      metalness: 0.0
    });

    this.duvetMat = new THREE.MeshStandardMaterial({
      color: 0xC6D5C3, // Soft muted sage
      roughness: 0.85,
      metalness: 0.0
    });

    this.duvetFoldMat = new THREE.MeshStandardMaterial({
      color: 0xB5C7B2,
      roughness: 0.85,
      metalness: 0.0
    });

    this.pillowMat = new THREE.MeshStandardMaterial({
      color: 0xFFFDF9,
      roughness: 0.9,
      metalness: 0.0
    });

    this.rugMat = new THREE.MeshStandardMaterial({
      map: this.rugTexture,
      roughness: 0.95,
      metalness: 0.0
    });

    // Accent materials
    this.brassMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.35,
      metalness: 0.8
    });

    this.lampCeramicMat = new THREE.MeshStandardMaterial({
      color: 0xD97746, // Terracotta ceramic
      roughness: 0.5,
      metalness: 0.05
    });

    this.lampshadeMat = new THREE.MeshStandardMaterial({
      color: 0xFFF5E6,
      roughness: 0.8,
      metalness: 0.0,
      emissive: 0xFF9E3B,
      emissiveIntensity: 0.0
    });

    this.potMat = new THREE.MeshStandardMaterial({
      color: 0xBA6336,
      roughness: 0.8,
      metalness: 0.0
    });

    this.leafMat = new THREE.MeshStandardMaterial({
      color: 0x3E784D,
      roughness: 0.6,
      metalness: 0.0
    });
  }

  buildBedArea() {
    // 1. Cozy Woven Rug under bed extending to room center
    const rugGeo = new THREE.BoxGeometry(3.6, 0.02, 4.4);
    const rug = new THREE.Mesh(rugGeo, this.rugMat);
    rug.position.set(-1.8, 0.01, -1.8);
    rug.receiveShadow = true;
    this.group.add(rug);

    // 2. Headboard against back wall
    const headboardW = 2.3;
    const headboardH = 1.35;
    const headboardGroup = new THREE.Group();
    headboardGroup.position.set(-2.2, headboardH / 2, -3.82);

    const headboardBody = new THREE.Mesh(
      new THREE.BoxGeometry(headboardW, headboardH, 0.12),
      this.warmOakMat
    );
    headboardBody.castShadow = true;
    headboardBody.receiveShadow = true;
    headboardGroup.add(headboardBody);

    // Rounded crown cap on headboard
    const capGeo = new THREE.CylinderGeometry(0.08, 0.08, headboardW, 16);
    const cap = new THREE.Mesh(capGeo, this.darkOakMat);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(0, headboardH / 2, 0);
    cap.castShadow = true;
    headboardGroup.add(cap);

    this.group.add(headboardGroup);

    // 3. Bed Frame & Base
    const bedFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.25, 2.7),
      this.warmOakMat
    );
    bedFrame.position.set(-2.2, 0.22, -2.4);
    bedFrame.castShadow = true;
    bedFrame.receiveShadow = true;
    this.group.add(bedFrame);

    // 4 Wooden Bed Legs
    const legGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.2, 12);
    const legPositions = [
      [-3.15, 0.1, -1.15],
      [-1.25, 0.1, -1.15],
      [-3.15, 0.1, -3.65],
      [-1.25, 0.1, -3.65]
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, this.darkOakMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      this.group.add(leg);
    });

    // 4. Mattress
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, 0.38, 2.5),
      this.mattressMat
    );
    mattress.position.set(-2.2, 0.48, -2.4);
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    this.group.add(mattress);

    // 5. Fluffy Pillows (2 propped up)
    const pillowGeo = new THREE.BoxGeometry(0.7, 0.18, 0.45);
    const pillow1 = new THREE.Mesh(pillowGeo, this.pillowMat);
    pillow1.position.set(-2.65, 0.72, -3.4);
    pillow1.rotation.x = -0.25;
    pillow1.castShadow = true;
    this.group.add(pillow1);

    const pillow2 = new THREE.Mesh(pillowGeo, this.pillowMat);
    pillow2.position.set(-1.75, 0.72, -3.4);
    pillow2.rotation.x = -0.25;
    pillow2.castShadow = true;
    this.group.add(pillow2);

    // 6. Duvet / Blanket (thick soft sage puff)
    const duvet = new THREE.Mesh(
      new THREE.BoxGeometry(2.02, 0.26, 1.9),
      this.duvetMat
    );
    duvet.position.set(-2.2, 0.62, -2.05);
    duvet.castShadow = true;
    duvet.receiveShadow = true;
    this.group.add(duvet);

    // Duvet fold-over lip near pillows
    const foldLip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 2.02, 16),
      this.duvetFoldMat
    );
    foldLip.rotation.z = Math.PI / 2;
    foldLip.position.set(-2.2, 0.68, -2.95);
    foldLip.castShadow = true;
    this.group.add(foldLip);

    // 7. Bedside Nightstand
    const nightstand = new THREE.Group();
    nightstand.position.set(-3.5, 0.38, -3.4);

    const bodyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.65, 0.6),
      this.warmOakMat
    );
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    nightstand.add(bodyMesh);

    // Nightstand drawers & brass handles
    for (let d = 0; d < 2; d++) {
      const drawerY = 0.14 - d * 0.28;
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.16, 12),
        this.brassMat
      );
      handle.rotation.z = Math.PI / 2;
      handle.position.set(0, drawerY, 0.31);
      nightstand.add(handle);
    }
    this.group.add(nightstand);

    // 8. Interactive Bedside Lamp on Nightstand
    this.buildBedsideLamp();
  }

  buildBedsideLamp() {
    this.lampGroup = new THREE.Group();
    this.lampGroup.position.set(-3.5, 0.72, -3.4);

    // Ceramic vase-shaped base
    const baseGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.22, 16);
    const baseMesh = new THREE.Mesh(baseGeo, this.lampCeramicMat);
    baseMesh.position.y = 0.11;
    baseMesh.castShadow = true;
    this.lampGroup.add(baseMesh);

    // Brass stem
    const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.18, 12);
    const stem = new THREE.Mesh(stemGeo, this.brassMat);
    stem.position.y = 0.28;
    this.lampGroup.add(stem);

    // Lampshade (cone)
    const shadeGeo = new THREE.CylinderGeometry(0.16, 0.24, 0.28, 20, 1, true);
    this.shadeMesh = new THREE.Mesh(shadeGeo, this.lampshadeMat);
    this.shadeMesh.position.y = 0.44;
    this.shadeMesh.castShadow = true;
    this.lampGroup.add(this.shadeMesh);

    // Top finial
    const finial = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 12, 12),
      this.brassMat
    );
    finial.position.y = 0.58;
    this.lampGroup.add(finial);

    // Set interactive user data
    this.shadeMesh.userData = {
      isInteractive: true,
      action: 'toggleLamp',
      name: "Bedside Lamp",
      hint: "Click to toggle cozy warm lighting"
    };
    baseMesh.userData = {
      isInteractive: true,
      action: 'toggleLamp',
      name: "Bedside Lamp",
      hint: "Click to toggle cozy warm lighting"
    };

    this.interactiveObjects.push(this.shadeMesh, baseMesh);
    this.group.add(this.lampGroup);
  }

  setLampEmissive(isOn) {
    if (this.lampshadeMat) {
      this.lampshadeMat.emissiveIntensity = isOn ? 0.9 : 0.0;
    }
  }

  buildDeskArea() {
    const deskGroup = new THREE.Group();
    deskGroup.position.set(2.4, 0, 1.2);

    // Desk Top (Warm oak with rounded bevels)
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.08, 0.9),
      this.warmOakMat
    );
    deskTop.position.set(0, 0.74, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Desk Legs (Tapered)
    const legGeo = new THREE.CylinderGeometry(0.035, 0.025, 0.72, 12);
    const offsets = [
      [-0.85, 0.36, -0.36],
      [0.85, 0.36, -0.36],
      [-0.85, 0.36, 0.36],
      [0.85, 0.36, 0.36]
    ];
    offsets.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, this.darkOakMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Desk Drawer Unit under right side
    const drawerUnit = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.28, 0.78),
      this.warmOakMat
    );
    drawerUnit.position.set(0.62, 0.56, 0);
    drawerUnit.castShadow = true;
    deskGroup.add(drawerUnit);

    // Drawer handle
    const drawerHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.14, 12),
      this.brassMat
    );
    drawerHandle.rotation.z = Math.PI / 2;
    drawerHandle.position.set(0.62, 0.56, 0.4);
    deskGroup.add(drawerHandle);

    // Ergonomic Modern Chair
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-0.15, 0, 0.7);
    chairGroup.rotation.y = -Math.PI / 6; // Angled invitingly

    // Cushion
    const seatGeo = new THREE.BoxGeometry(0.52, 0.08, 0.48);
    const seatMat = new THREE.MeshStandardMaterial({
      color: 0xE5DFD3,
      roughness: 0.8
    });
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.y = 0.46;
    seat.castShadow = true;
    chairGroup.add(seat);

    // Curved Backrest
    const backrestGeo = new THREE.BoxGeometry(0.5, 0.38, 0.06);
    const backrest = new THREE.Mesh(backrestGeo, this.warmOakMat);
    backrest.position.set(0, 0.74, 0.22);
    backrest.castShadow = true;
    chairGroup.add(backrest);

    // Chair Legs
    const chairLegGeo = new THREE.CylinderGeometry(0.025, 0.018, 0.44, 12);
    const chairLegs = [
      [-0.2, 0.22, -0.18],
      [0.2, 0.22, -0.18],
      [-0.2, 0.22, 0.18],
      [0.2, 0.22, 0.18]
    ];
    chairLegs.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(chairLegGeo, this.darkOakMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      chairGroup.add(leg);
    });
    deskGroup.add(chairGroup);

    // Desk Accessories:
    // 1. Laptop (open)
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-0.25, 0.78, 0);

    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.015, 0.26),
      new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.7, roughness: 0.3 })
    );
    laptopGroup.add(laptopBase);

    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.24, 0.012),
      new THREE.MeshStandardMaterial({
        color: 0x1E293B,
        emissive: 0x0284C7,
        emissiveIntensity: 0.25,
        roughness: 0.2
      })
    );
    laptopScreen.position.set(0, 0.12, -0.12);
    laptopScreen.rotation.x = -0.2;
    laptopGroup.add(laptopScreen);
    deskGroup.add(laptopGroup);

    // 2. Coffee Mug
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.04, 0.09, 14),
      this.lampCeramicMat
    );
    mug.position.set(0.35, 0.82, -0.15);
    mug.castShadow = true;
    deskGroup.add(mug);

    // 3. Mini Desk Succulent
    const succPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.04, 0.08, 12),
      new THREE.MeshStandardMaterial({ color: 0xFAF6EE, roughness: 0.7 })
    );
    succPot.position.set(0.65, 0.82, -0.2);
    deskGroup.add(succPot);

    const succPlant = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 10),
      this.leafMat
    );
    succPlant.position.set(0.65, 0.88, -0.2);
    deskGroup.add(succPlant);

    // 4. Stack of Books
    const bookColors = [0x5B8296, 0xC47B5D];
    for (let b = 0; b < 2; b++) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.035, 0.18),
        new THREE.MeshStandardMaterial({ color: bookColors[b], roughness: 0.8 })
      );
      book.position.set(-0.68, 0.8 + b * 0.04, 0.1);
      book.rotation.y = 0.15 * b;
      deskGroup.add(book);
    }

    // 5. Vestia Zeta Acrylic Desk Standee
    const zetaStandee = CharacterBuilder.buildZetaDeskStandee('/assets/vestia_zeta.jpg');
    zetaStandee.position.set(0.08, 0.78, -0.22);
    deskGroup.add(zetaStandee);

    this.group.add(deskGroup);
  }

  buildFloorPlant() {
    const plantGroup = new THREE.Group();
    plantGroup.position.set(-3.4, 0, 3.1);

    // Ceramic Pot
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.22, 0.52, 16),
      this.potMat
    );
    pot.position.y = 0.26;
    pot.castShadow = true;
    pot.receiveShadow = true;
    plantGroup.add(pot);

    // Soil
    const soil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.04, 16),
      new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.9 })
    );
    soil.position.y = 0.5;
    plantGroup.add(soil);

    // Stylized Plant Stems & Broad Leaves
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x2A5235, roughness: 0.7 });
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + (Math.random() * 0.3);
      const height = 0.5 + Math.random() * 0.4;

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.02, height, 8),
        stemMat
      );
      stem.position.set(Math.cos(angle) * 0.08, 0.5 + height / 2, Math.sin(angle) * 0.08);
      stem.rotation.z = Math.sin(angle) * 0.25;
      stem.rotation.x = Math.cos(angle) * 0.25;
      stem.castShadow = true;
      plantGroup.add(stem);

      // Broad Monstera leaf
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 8),
        this.leafMat
      );
      leaf.scale.set(1.4, 0.1, 0.9);
      leaf.position.set(Math.cos(angle) * 0.25, 0.5 + height, Math.sin(angle) * 0.25);
      leaf.rotation.y = angle;
      leaf.rotation.x = 0.35;
      leaf.castShadow = true;
      plantGroup.add(leaf);
    }

    this.group.add(plantGroup);
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }
}
