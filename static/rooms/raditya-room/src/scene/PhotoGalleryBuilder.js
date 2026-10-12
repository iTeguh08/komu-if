import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * Photo Gallery Builder for Raditya's Room
 * Generates physical wooden wall frames driven by src/config/roomConfig.js.
 */
export class PhotoGalleryBuilder {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.interactiveObjects = [];
    this.photoDataMap = new Map();

    this.buildGallery();
  }

  buildGallery() {
    const photos = this.config.photos || [];

    photos.forEach((photo) => {
      const frameGroup = new THREE.Group();
      frameGroup.position.set(photo.position.x, photo.position.y, photo.position.z);
      if (photo.rotation) {
        frameGroup.rotation.set(photo.rotation.x, photo.rotation.y, photo.rotation.z);
      }

      const { width, height, depth } = photo.dimensions;
      const borderThickness = 0.045;

      // 1. Wooden Outer Frame Molding
      const frameMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(photo.frameColor || '#8C5A28'),
        roughness: 0.65,
        metalness: 0.05
      });

      // Frame top/bottom/left/right border pieces
      const topBar = new THREE.Mesh(
        new THREE.BoxGeometry(width + borderThickness * 2, borderThickness, depth),
        frameMat
      );
      topBar.position.set(0, height / 2 + borderThickness / 2, 0);
      topBar.castShadow = true;
      frameGroup.add(topBar);

      const bottomBar = new THREE.Mesh(
        new THREE.BoxGeometry(width + borderThickness * 2, borderThickness, depth),
        frameMat
      );
      bottomBar.position.set(0, -height / 2 - borderThickness / 2, 0);
      bottomBar.castShadow = true;
      frameGroup.add(bottomBar);

      const leftBar = new THREE.Mesh(
        new THREE.BoxGeometry(borderThickness, height, depth),
        frameMat
      );
      leftBar.position.set(-width / 2 - borderThickness / 2, 0, 0);
      leftBar.castShadow = true;
      frameGroup.add(leftBar);

      const rightBar = new THREE.Mesh(
        new THREE.BoxGeometry(borderThickness, height, depth),
        frameMat
      );
      rightBar.position.set(width / 2 + borderThickness / 2, 0, 0);
      rightBar.castShadow = true;
      frameGroup.add(rightBar);

      // Backing Board
      const backing = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.01),
        new THREE.MeshStandardMaterial({ color: 0x4A3319, roughness: 0.9 })
      );
      backing.position.set(0, 0, -depth / 2 + 0.005);
      frameGroup.add(backing);

      // Mat (Paper Passe-Partout)
      const matMesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 0.01),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(photo.matColor || '#FAF7F2'), roughness: 0.95 })
      );
      matMesh.position.set(0, 0, -0.005);
      frameGroup.add(matMesh);

      // Artwork Canvas Texture
      let photoTexture;
      let previewUrl;

      if (photo.imageUrl) {
        photoTexture = new THREE.TextureLoader().load(photo.imageUrl);
        photoTexture.colorSpace = THREE.SRGBColorSpace;
        previewUrl = photo.imageUrl;
        photo.dataUrl = photo.imageUrl;
      } else {
        const artResult = TextureGenerator.createPhotoCanvas(photo);
        photoTexture = artResult.texture;
        previewUrl = artResult.dataUrl;
        photo.dataUrl = artResult.dataUrl;
      }

      const artMat = new THREE.MeshStandardMaterial({
        map: photoTexture,
        roughness: 0.45,
        metalness: 0.0
      });

      // Inset photo
      const photoInsetW = width * 0.82;
      const photoInsetH = height * 0.82;
      const photoMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(photoInsetW, photoInsetH),
        artMat
      );
      photoMesh.position.set(0, 0, 0.008);
      frameGroup.add(photoMesh);

      // Protective Glass Cover
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.25
      });
      const glassMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        glassMat
      );
      glassMesh.position.set(0, 0, 0.014);
      frameGroup.add(glassMesh);

      // Interactive metadata on photo and glass
      const interactiveData = {
        isInteractive: true,
        action: 'openPhoto',
        photo: photo,
        previewUrl: previewUrl,
        name: photo.title,
        hint: "Click to view photo details"
      };

      glassMesh.userData = interactiveData;
      photoMesh.userData = interactiveData;

      this.interactiveObjects.push(glassMesh, photoMesh);
      this.photoDataMap.set(photo.id, { photo, frameGroup });
      this.group.add(frameGroup);
    });
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }
}
