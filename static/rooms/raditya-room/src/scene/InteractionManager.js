import * as THREE from 'three';

/**
 * Interaction Manager for Raditya's Room
 * Handles raycasting, hover highlights, camera focus transitions, and click events.
 */
export class InteractionManager {
  constructor({ camera, controls, domElement, onPhotoClick, onTVClick, onLampToggle, onRadioToggle, onCoupleClick, onHoverChange }) {
    this.camera = camera;
    this.controls = controls;
    this.domElement = domElement;
    this.onPhotoClick = onPhotoClick;
    this.onTVClick = onTVClick;
    this.onLampToggle = onLampToggle;
    this.onRadioToggle = onRadioToggle;
    this.onCoupleClick = onCoupleClick;
    this.onHoverChange = onHoverChange;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.interactiveTargets = [];
    this.currentHovered = null;

    // Camera animation state
    this.isTransitioning = false;
    this.transitionStart = null;
    this.transitionDuration = 800; // ms
    this.cameraStartPos = new THREE.Vector3();
    this.cameraEndPos = new THREE.Vector3();
    this.targetStartPos = new THREE.Vector3();
    this.targetEndPos = new THREE.Vector3();

    this.defaultCameraPos = new THREE.Vector3(7.2, 5.6, 7.8);
    this.defaultTargetPos = new THREE.Vector3(-0.2, 1.2, -0.4);

    this.initEvents();
  }

  setInteractiveTargets(targets) {
    this.interactiveTargets = targets;
  }

  initEvents() {
    this.onPointerMove = this.handlePointerMove.bind(this);
    this.onPointerDown = this.handlePointerDown.bind(this);
    this.onClick = this.handleClick.bind(this);

    this.domElement.addEventListener('pointermove', this.onPointerMove);
    this.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.domElement.addEventListener('click', this.onClick);
  }

  handlePointerMove(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveTargets, true);

    let foundTarget = null;
    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !obj.userData?.isInteractive && obj.parent) {
        obj = obj.parent;
      }
      if (obj && obj.userData?.isInteractive) {
        foundTarget = obj;
      }
    }

    if (foundTarget !== this.currentHovered) {
      this.clearHover();
      if (foundTarget) {
        this.setHover(foundTarget);
      }
    }
  }

  handlePointerDown(event) {
    this.pointerDownX = event.clientX;
    this.pointerDownY = event.clientY;
  }

  handleClick(event) {
    // Prevent click if user was dragging camera orbit
    const deltaX = Math.abs(event.clientX - (this.pointerDownX || event.clientX));
    const deltaY = Math.abs(event.clientY - (this.pointerDownY || event.clientY));
    if (deltaX > 6 || deltaY > 6) return;

    // Immediate raycast at click coordinates (ensures moving characters and touch events are hit reliably)
    const rect = this.domElement.getBoundingClientRect();
    const clickMouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(clickMouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveTargets, true);

    let clickedTarget = null;
    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !obj.userData?.isInteractive && obj.parent) {
        obj = obj.parent;
      }
      if (obj && obj.userData?.isInteractive) {
        clickedTarget = obj;
      }
    }
    if (!clickedTarget) clickedTarget = this.currentHovered;

    if (clickedTarget) {
      const data = clickedTarget.userData;
      if (data.action === 'openPhoto') {
        const photo = data.photo;
        // Smooth camera transition toward photo frame
        const focusPos = new THREE.Vector3(photo.position.x, photo.position.y, photo.position.z + 1.8);
        const lookTarget = new THREE.Vector3(photo.position.x, photo.position.y, photo.position.z);
        this.transitionCamera(focusPos, lookTarget);

        if (this.onPhotoClick) {
          this.onPhotoClick(photo, data.previewUrl);
        }
      } else if (data.action === 'launchTVGame') {
        // Smooth camera transition toward TV screen
        const focusPos = new THREE.Vector3(1.8, 1.4, -1.2);
        const lookTarget = new THREE.Vector3(1.8, 1.25, -3.2);
        this.transitionCamera(focusPos, lookTarget);

        if (this.onTVClick) {
          this.onTVClick();
        }
      } else if (data.action === 'toggleLamp') {
        if (this.onLampToggle) {
          this.onLampToggle();
        }
      } else if (data.action === 'toggleRadio') {
        if (this.onRadioToggle) {
          this.onRadioToggle();
        }
      } else if (data.action === 'interactCouple') {
        if (this.onCoupleClick) {
          this.onCoupleClick(data.characterName, clickedTarget);
        }
      }
    }
  }

  setHover(object) {
    this.currentHovered = object;
    this.domElement.style.cursor = 'pointer';

    // Highlight emissive
    if (object.material && object.material.emissive) {
      object.userData.prevEmissive = object.material.emissive.getHex();
      object.userData.prevEmissiveIntensity = object.material.emissiveIntensity;
      object.material.emissive.setHex(0x553311);
      object.material.emissiveIntensity = 0.5;
    }

    if (this.onHoverChange) {
      this.onHoverChange(object.userData);
    }
  }

  clearHover() {
    if (this.currentHovered) {
      if (this.currentHovered.material && this.currentHovered.material.emissive) {
        if (this.currentHovered.userData.prevEmissive !== undefined) {
          this.currentHovered.material.emissive.setHex(this.currentHovered.userData.prevEmissive);
          this.currentHovered.material.emissiveIntensity = this.currentHovered.userData.prevEmissiveIntensity || 0;
        } else {
          this.currentHovered.material.emissive.setHex(0x000000);
          this.currentHovered.material.emissiveIntensity = 0;
        }
      }
      this.currentHovered = null;
      this.domElement.style.cursor = 'default';
      if (this.onHoverChange) {
        this.onHoverChange(null);
      }
    }
  }

  transitionCamera(targetPos, lookTarget, duration = 800) {
    this.isTransitioning = true;
    this.transitionStart = performance.now();
    this.transitionDuration = duration;

    this.cameraStartPos.copy(this.camera.position);
    this.cameraEndPos.copy(targetPos);

    this.targetStartPos.copy(this.controls.target);
    this.targetEndPos.copy(lookTarget);
  }

  resetCamera() {
    this.transitionCamera(this.defaultCameraPos, this.defaultTargetPos, 900);
  }

  update() {
    if (this.isTransitioning) {
      const elapsed = performance.now() - this.transitionStart;
      const progress = Math.min(1, elapsed / this.transitionDuration);

      // Smooth ease-in-out curve
      const t = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      this.camera.position.lerpVectors(this.cameraStartPos, this.cameraEndPos, t);
      this.controls.target.lerpVectors(this.targetStartPos, this.targetEndPos, t);
      this.controls.update();

      if (progress >= 1) {
        this.isTransitioning = false;
      }
    }
  }

  destroy() {
    this.domElement.removeEventListener('pointermove', this.onPointerMove);
    this.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.domElement.removeEventListener('click', this.onClick);
  }
}
