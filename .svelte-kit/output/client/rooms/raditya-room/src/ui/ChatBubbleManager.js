import * as THREE from 'three';

/**
 * Chat Bubble Manager for Raditya and Vestia Zeta
 * Projects 3D character world positions to 2D screen coordinates and displays floating speech bubbles.
 */
export class ChatBubbleManager {
  constructor(container, camera) {
    this.container = container;
    this.camera = camera;
    this.bubbles = []; // Active bubbles

    this.initDOM();
  }

  initDOM() {
    this.bubbleContainer = document.getElementById('chat-bubble-container');
    if (!this.bubbleContainer) {
      this.bubbleContainer = document.createElement('div');
      this.bubbleContainer.id = 'chat-bubble-container';
      this.bubbleContainer.style.position = 'absolute';
      this.bubbleContainer.style.inset = '0';
      this.bubbleContainer.style.pointerEvents = 'none';
      this.bubbleContainer.style.overflow = 'hidden';
      this.bubbleContainer.style.zIndex = '100';
      const parent = document.getElementById('app-container') || this.container || document.body;
      parent.appendChild(this.bubbleContainer);
    }
  }

  /**
   * Shows a speech bubble above a character
   * @param {THREE.Object3D} targetObject - Character root object in 3D
   * @param {string} senderName - "Raditya" or "Vestia Zeta"
   * @param {string} message - Dialogue text
   * @param {number} duration - Display time in seconds
   */
  showBubble(targetObject, senderName, message, duration = 4.5) {
    // Remove existing bubble for this sender if any
    this.dismissBubbleBySender(senderName);

    const bubbleEl = document.createElement('div');
    bubbleEl.className = `chat-bubble ${senderName === 'Vestia Zeta' ? 'zeta-bubble' : 'raditya-bubble'}`;
    bubbleEl.innerHTML = `
      <div class="bubble-header">
        <span class="bubble-avatar-dot"></span>
        <span class="bubble-sender">${senderName}</span>
      </div>
      <div class="bubble-text">${message}</div>
      <div class="bubble-tail"></div>
    `;

    this.bubbleContainer.appendChild(bubbleEl);

    const bubbleData = {
      element: bubbleEl,
      target: targetObject,
      senderName,
      timeLeft: duration,
      offsetY: senderName === 'Vestia Zeta' ? 1.35 : 1.45
    };

    this.bubbles.push(bubbleData);

    // Initial positioning
    this.updateBubblePosition(bubbleData);
  }

  dismissBubbleBySender(senderName) {
    const existingIndex = this.bubbles.findIndex(b => b.senderName === senderName);
    if (existingIndex !== -1) {
      const b = this.bubbles[existingIndex];
      if (b.element.parentNode) {
        b.element.parentNode.removeChild(b.element);
      }
      this.bubbles.splice(existingIndex, 1);
    }
  }

  update(delta) {
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.timeLeft -= delta;

      if (b.timeLeft <= 0) {
        b.element.classList.add('fading');
        setTimeout(() => {
          if (b.element.parentNode) {
            b.element.parentNode.removeChild(b.element);
          }
        }, 300);
        this.bubbles.splice(i, 1);
        continue;
      }

      this.updateBubblePosition(b);
    }
  }

  updateBubblePosition(bubble) {
    if (!bubble.target) return;

    const worldPos = new THREE.Vector3();
    bubble.target.getWorldPosition(worldPos);
    worldPos.y += bubble.offsetY;

    // Project 3D vector to screen space
    const screenPos = worldPos.clone().project(this.camera);

    // If character is behind camera
    if (screenPos.z > 1) {
      bubble.element.style.opacity = '0';
      return;
    }

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    const x = (screenPos.x * 0.5 + 0.5) * width;
    const y = (-screenPos.y * 0.5 + 0.5) * height;

    bubble.element.style.left = `${Math.round(x)}px`;
    bubble.element.style.top = `${Math.round(y)}px`;
    bubble.element.style.opacity = '1';
  }

  destroy() {
    if (this.bubbleContainer && this.bubbleContainer.parentNode) {
      this.bubbleContainer.parentNode.removeChild(this.bubbleContainer);
    }
    this.bubbles = [];
  }
}
