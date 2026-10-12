import * as THREE from 'three';

/**
 * Character Builder for Raditya and Vestia Zeta
 * Constructs stylized 3D couple characters with full joint hierarchies for walking animation.
 */
export class CharacterBuilder {
  /**
   * Builds Raditya 3D character
   */
  static buildRaditya() {
    const group = new THREE.Group();
    group.name = "Raditya";

    // Palette
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xFAD8C0, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x241C18, roughness: 0.7 });
    const hoodieMat = new THREE.MeshStandardMaterial({ color: 0x3E4C59, roughness: 0.75 }); // Cozy slate-blue hoodie
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x2A2E33, roughness: 0.8 }); // Dark pants
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xF2EFE9, roughness: 0.4 }); // White sneakers
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1E1B18 });

    // Root pelvis
    const pelvis = new THREE.Group();
    pelvis.position.y = 0.6;
    group.add(pelvis);

    // Torso / Hoodie body
    const torsoGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.38, 14);
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    torso.position.y = 0.19;
    torso.castShadow = true;
    pelvis.add(torso);

    // Hoodie pouch pocket
    const pocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.1, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x34414D, roughness: 0.8 })
    );
    pocket.position.set(0, 0.12, 0.14);
    pelvis.add(pocket);

    // Head group
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.44;
    pelvis.add(headGroup);

    // Head base
    const headGeo = new THREE.SphereGeometry(0.16, 16, 14);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 0.12;
    head.castShadow = true;
    headGroup.add(head);

    // Hair (stylized textured bangs & top)
    const hairTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.175, 14, 12, 0, Math.PI * 2, 0, Math.PI / 1.7),
      hairMat
    );
    hairTop.position.y = 0.14;
    hairTop.castShadow = true;
    headGroup.add(hairTop);

    // Front bangs
    const bangsGeo = new THREE.BoxGeometry(0.18, 0.08, 0.06);
    const bangs = new THREE.Mesh(bangsGeo, hairMat);
    bangs.position.set(0, 0.22, 0.13);
    bangs.rotation.x = -0.15;
    headGroup.add(bangs);

    // Eyes
    const eyeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.04, 0.01), eyeMat);
    eyeLeft.position.set(-0.055, 0.12, 0.155);
    headGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.04, 0.01), eyeMat);
    eyeRight.position.set(0.055, 0.12, 0.155);
    headGroup.add(eyeRight);

    // ARMS
    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.21, 0.32, 0);
    pelvis.add(leftArmGroup);

    const leftArmMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.045, 0.28, 10),
      hoodieMat
    );
    leftArmMesh.position.y = -0.12;
    leftArmMesh.castShadow = true;
    leftArmGroup.add(leftArmMesh);

    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), skinMat);
    leftHand.position.y = -0.27;
    leftArmGroup.add(leftHand);

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.21, 0.32, 0);
    pelvis.add(rightArmGroup);

    const rightArmMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.045, 0.28, 10),
      hoodieMat
    );
    rightArmMesh.position.y = -0.12;
    rightArmMesh.castShadow = true;
    rightArmGroup.add(rightArmMesh);

    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), skinMat);
    rightHand.position.y = -0.27;
    rightArmGroup.add(rightHand);

    // LEGS
    // Left Leg
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.09, 0, 0);
    pelvis.add(leftLegGroup);

    const leftLegMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.05, 0.36, 12),
      pantsMat
    );
    leftLegMesh.position.y = -0.18;
    leftLegMesh.castShadow = true;
    leftLegGroup.add(leftLegMesh);

    const leftShoe = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.06, 0.15),
      shoeMat
    );
    leftShoe.position.set(0, -0.37, 0.03);
    leftShoe.castShadow = true;
    leftLegGroup.add(leftShoe);

    // Right Leg
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.09, 0, 0);
    pelvis.add(rightLegGroup);

    const rightLegMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.05, 0.36, 12),
      pantsMat
    );
    rightLegMesh.position.y = -0.18;
    rightLegMesh.castShadow = true;
    rightLegGroup.add(rightLegMesh);

    const rightShoe = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.06, 0.15),
      shoeMat
    );
    rightShoe.position.set(0, -0.37, 0.03);
    rightShoe.castShadow = true;
    rightLegGroup.add(rightShoe);

    return {
      root: group,
      pelvis,
      headGroup,
      leftArm: leftArmGroup,
      rightArm: rightArmGroup,
      leftLeg: leftLegGroup,
      rightLeg: rightLegGroup
    };
  }

  /**
   * Builds Vestia Zeta 3D character matching her official secret agent design
   */
  static buildVestiaZeta() {
    const group = new THREE.Group();
    group.name = "Vestia Zeta";

    // Palette based on reference image
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xFDE8DC, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xC3C7CE, roughness: 0.6 }); // Silver grey hair
    const hairDarkMat = new THREE.MeshStandardMaterial({ color: 0x8A92A0, roughness: 0.7 });
    const whiteDressMat = new THREE.MeshStandardMaterial({ color: 0xF6F8FA, roughness: 0.5 });
    const blackStrapMat = new THREE.MeshStandardMaterial({ color: 0x202228, roughness: 0.4 });
    const blueRibbonMat = new THREE.MeshStandardMaterial({ color: 0x4F86F7, roughness: 0.4 }); // Zeta's signature blue accent
    const blackStockingMat = new THREE.MeshStandardMaterial({ color: 0x1E2024, roughness: 0.6 });
    const whiteMeshSockMat = new THREE.MeshStandardMaterial({ color: 0xE8ECF2, roughness: 0.7 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x48648C }); // Zeta's blue-grey eyes

    // Root pelvis
    const pelvis = new THREE.Group();
    pelvis.position.y = 0.56; // Slightly shorter than Raditya for cozy couple height ratio
    group.add(pelvis);

    // Torso / White Agent Dress
    const torsoGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.34, 14);
    const torso = new THREE.Mesh(torsoGeo, whiteDressMat);
    torso.position.y = 0.17;
    torso.castShadow = true;
    pelvis.add(torso);

    // Black harness / tie straps on chest
    const strapV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.22, 0.02), blackStrapMat);
    strapV.position.set(0, 0.2, 0.135);
    pelvis.add(strapV);

    // Blue belt accent
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.28), blueRibbonMat);
    belt.position.set(0, 0.05, 0);
    pelvis.add(belt);

    // Pleated Skirt (White & Black)
    const skirtGeo = new THREE.CylinderGeometry(0.14, 0.24, 0.16, 16);
    const skirt = new THREE.Mesh(skirtGeo, whiteDressMat);
    skirt.position.y = -0.02;
    skirt.castShadow = true;
    pelvis.add(skirt);

    // Skirt black underside layer
    const skirtInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.245, 0.04, 16),
      blackStrapMat
    );
    skirtInner.position.y = -0.09;
    pelvis.add(skirtInner);

    // Head group
    const headGroup = new THREE.Group();
    headGroup.position.y = 0.38;
    pelvis.add(headGroup);

    // Head base
    const headGeo = new THREE.SphereGeometry(0.15, 16, 14);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 0.12;
    head.castShadow = true;
    headGroup.add(head);

    // Hair Top & Base
    const hairTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.165, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.7),
      hairMat
    );
    hairTop.position.y = 0.13;
    hairTop.castShadow = true;
    headGroup.add(hairTop);

    // Zeta's signature Cat-Ear-like Hair Tufts
    const tuftGeo = new THREE.ConeGeometry(0.045, 0.1, 10);
    const leftTuft = new THREE.Mesh(tuftGeo, hairMat);
    leftTuft.position.set(-0.09, 0.27, 0.02);
    leftTuft.rotation.z = 0.3;
    leftTuft.rotation.x = -0.1;
    headGroup.add(leftTuft);

    const rightTuft = new THREE.Mesh(tuftGeo, hairMat);
    rightTuft.position.set(0.09, 0.27, 0.02);
    rightTuft.rotation.z = -0.3;
    rightTuft.rotation.x = -0.1;
    headGroup.add(rightTuft);

    // Hair ribbon clip (black on left ear)
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.03), blackStrapMat);
    clip.position.set(-0.11, 0.24, 0.04);
    headGroup.add(clip);

    // Long Flowing Hair Locks behind back
    const backHairGeo = new THREE.CylinderGeometry(0.15, 0.08, 0.42, 12);
    const backHair = new THREE.Mesh(backHairGeo, hairDarkMat);
    backHair.position.set(0, -0.05, -0.1);
    backHair.castShadow = true;
    headGroup.add(backHair);

    // Side hair bangs
    const sideHairL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.26, 8), hairMat);
    sideHairL.position.set(-0.13, 0.02, 0.07);
    headGroup.add(sideHairL);

    const sideHairR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.26, 8), hairMat);
    sideHairR.position.set(0.13, 0.02, 0.07);
    headGroup.add(sideHairR);

    // Eyes
    const eyeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.04, 0.01), eyeMat);
    eyeLeft.position.set(-0.05, 0.12, 0.145);
    headGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.04, 0.01), eyeMat);
    eyeRight.position.set(0.05, 0.12, 0.145);
    headGroup.add(eyeRight);

    // ARMS
    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.18, 0.28, 0);
    pelvis.add(leftArmGroup);

    const leftArmMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.038, 0.26, 10),
      whiteDressMat
    );
    leftArmMesh.position.y = -0.11;
    leftArmMesh.castShadow = true;
    leftArmGroup.add(leftArmMesh);

    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), skinMat);
    leftHand.position.y = -0.24;
    leftArmGroup.add(leftHand);

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.18, 0.28, 0);
    pelvis.add(rightArmGroup);

    const rightArmMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.038, 0.26, 10),
      whiteDressMat
    );
    rightArmMesh.position.y = -0.11;
    rightArmMesh.castShadow = true;
    rightArmGroup.add(rightArmMesh);

    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), skinMat);
    rightHand.position.y = -0.24;
    rightArmGroup.add(rightHand);

    // LEGS with Zeta's iconic ASYMMETRIC socks & holster:
    // Left Leg: Bare thigh + White short mesh sock
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.08, -0.06, 0);
    pelvis.add(leftLegGroup);

    const leftThigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.045, 0.2, 10),
      skinMat
    );
    leftThigh.position.y = -0.1;
    leftLegGroup.add(leftThigh);

    const leftSock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.04, 0.18, 10),
      whiteMeshSockMat
    );
    leftSock.position.y = -0.26;
    leftSock.castShadow = true;
    leftLegGroup.add(leftSock);

    const leftShoe = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.06, 0.14),
      blackStrapMat
    );
    leftShoe.position.set(0, -0.37, 0.03);
    leftShoe.castShadow = true;
    leftLegGroup.add(leftShoe);

    // Right Leg: Full Black Thigh-High Stocking + Thigh Holster Strap
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.08, -0.06, 0);
    pelvis.add(rightLegGroup);

    const rightStocking = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.04, 0.38, 10),
      blackStockingMat
    );
    rightStocking.position.y = -0.19;
    rightStocking.castShadow = true;
    rightLegGroup.add(rightStocking);

    // Holster gun pouch on right thigh
    const holster = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.08, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x111115 })
    );
    holster.position.set(0.05, -0.12, 0.02);
    rightLegGroup.add(holster);

    const rightShoe = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.06, 0.14),
      blackStrapMat
    );
    rightShoe.position.set(0, -0.37, 0.03);
    rightShoe.castShadow = true;
    rightLegGroup.add(rightShoe);

    return {
      root: group,
      pelvis,
      headGroup,
      leftArm: leftArmGroup,
      rightArm: rightArmGroup,
      leftLeg: leftLegGroup,
      rightLeg: rightLegGroup
    };
  }

  /**
   * Builds an acrylic desk standee of Vestia Zeta for Raditya's study desk
   */
  static buildZetaDeskStandee(texturePath = '/assets/vestia_zeta.jpg') {
    const standeeGroup = new THREE.Group();
    standeeGroup.name = "Zeta Standee";

    // Acrylic circular base
    const baseGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.01, 16);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.7
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    standeeGroup.add(baseMesh);

    // Acrylic cutout plane with Zeta texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(texturePath, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const planeGeo = new THREE.PlaneGeometry(0.18, 0.32);
      const planeMat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        roughness: 0.2,
        side: THREE.DoubleSide
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.position.y = 0.16;
      standeeGroup.add(planeMesh);
    });

    standeeGroup.userData = {
      isInteractive: true,
      action: 'openZetaInfo',
      name: "Vestia Zeta Acrylic Standee",
      hint: "Secret Agent 77 on Raditya's desk"
    };

    return standeeGroup;
  }
}
