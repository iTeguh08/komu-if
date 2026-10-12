import * as THREE from 'three';

/**
 * Procedural texture generator for Raditya's Room.
 * Generates beautiful, lightweight stylized textures using HTML5 Canvas.
 * No external image loading failures or broken URLs.
 */
export class TextureGenerator {
  /**
   * Warm natural oak wood planks texture for bedroom flooring
   */
  static createWoodPlanksTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base warm oak color
    ctx.fillStyle = '#C4965F';
    ctx.fillRect(0, 0, 1024, 1024);

    const plankCount = 10;
    const plankHeight = 1024 / plankCount;
    const plankTones = ['#C89B64', '#BA8C55', '#CFA26B', '#C1935C', '#B58750'];

    for (let i = 0; i < plankCount; i++) {
      const y = i * plankHeight;
      const tone = plankTones[i % plankTones.length];

      // Plank body
      ctx.fillStyle = tone;
      ctx.fillRect(0, y, 1024, plankHeight);

      // Subtle wood grain lines
      ctx.strokeStyle = 'rgba(100, 65, 30, 0.08)';
      ctx.lineWidth = 1.5;
      for (let g = 0; g < 6; g++) {
        const lineY = y + 8 + g * (plankHeight / 6) + (Math.sin(g + i) * 3);
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.bezierCurveTo(300, lineY + 2, 700, lineY - 2, 1024, lineY + 1);
        ctx.stroke();
      }

      // Plank top highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, y, 1024, 2);

      // Plank groove / shadow seam
      ctx.fillStyle = 'rgba(60, 35, 15, 0.25)';
      ctx.fillRect(0, y + plankHeight - 2, 1024, 2);

      // Staggered vertical end joints
      const jointX1 = ((i * 380) % 800) + 100;
      const jointX2 = (jointX1 + 450) % 1000 + 12;
      ctx.fillStyle = 'rgba(60, 35, 15, 0.3)';
      ctx.fillRect(jointX1, y, 2, plankHeight);
      ctx.fillRect(jointX2, y, 2, plankHeight);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  /**
   * Cozy woven rug texture with soft rounded motifs
   */
  static createRugTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Soft warm ivory base
    ctx.fillStyle = '#EBE5D8';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle cozy checker / weave
    ctx.fillStyle = 'rgba(215, 206, 190, 0.4)';
    const size = 32;
    for (let x = 0; x < 512; x += size * 2) {
      for (let y = 0; y < 512; y += size * 2) {
        ctx.fillRect(x, y, size, size);
        ctx.fillRect(x + size, y + size, size, size);
      }
    }

    // Stylized subtle boho arch pattern
    ctx.strokeStyle = 'rgba(180, 160, 140, 0.35)';
    ctx.lineWidth = 4;
    for (let cx = 64; cx < 512; cx += 128) {
      for (let cy = 64; cy < 512; cy += 128) {
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  /**
   * Creamy wall plaster micro-texture
   */
  static createWallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#F5EFEB';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle gentle noise for warmth
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 6;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }

  /**
   * Stylized artwork generator for bedroom gallery photos
   * Returns { texture, dataUrl }
   */
  static createPhotoCanvas(photo) {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = Math.round(600 * (photo.dimensions.height / photo.dimensions.width));
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Background paper
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, w, h);

    // Draw stylized artwork according to theme
    switch (photo.theme) {
      case 'sunrise':
        this.drawSunriseTheme(ctx, w, h);
        break;
      case 'hackathon':
        this.drawHackathonTheme(ctx, w, h);
        break;
      case 'coffee':
        this.drawCoffeeTheme(ctx, w, h);
        break;
      case 'beach':
      default:
        this.drawBeachTheme(ctx, w, h);
        break;
    }

    // Border line & bottom caption tag
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    const dataUrl = canvas.toDataURL('image/png');
    const texture = new THREE.CanvasTexture(canvas);
    return { texture, dataUrl };
  }

  static drawSunriseTheme(ctx, w, h) {
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#536976');
    skyGrad.addColorStop(0.4, '#BBD2C5');
    skyGrad.addColorStop(0.7, '#F7971E');
    skyGrad.addColorStop(1, '#FFD200');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(15, 15, w - 30, h - 30);

    // Glowing sun
    ctx.fillStyle = 'rgba(255, 248, 220, 0.9)';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.45, h * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Mountain silhouettes
    ctx.fillStyle = '#4A3B4E';
    ctx.beginPath();
    ctx.moveTo(15, h - 15);
    ctx.lineTo(w * 0.28, h * 0.42);
    ctx.lineTo(w * 0.65, h - 15);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2D283E';
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h - 15);
    ctx.lineTo(w * 0.72, h * 0.36);
    ctx.lineTo(w - 15, h - 15);
    ctx.closePath();
    ctx.fill();

    // Birds
    ctx.strokeStyle = '#2D283E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w * 0.42, h * 0.25, 8, Math.PI, 0);
    ctx.arc(w * 0.42 + 16, h * 0.25, 8, Math.PI, 0);
    ctx.stroke();
  }

  static drawHackathonTheme(ctx, w, h) {
    // Modern deep teal workspace gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1E293B');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(15, 15, w - 30, h - 30);

    // Stylized laptop on desk
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(w * 0.25, h * 0.35, w * 0.5, h * 0.38);

    // Screen content
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(w * 0.28, h * 0.38, w * 0.44, h * 0.3);

    // Code lines
    ctx.fillStyle = '#F8FAFC';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(w * 0.31, h * 0.42 + i * 16, (i === 1 ? w * 0.35 : w * 0.22), 6);
    }

    // Laptop base
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.roundRect(w * 0.2, h * 0.73, w * 0.6, 12, 4);
    ctx.fill();

    // Warm desk plant
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.roundRect(w * 0.78, h * 0.65, 36, 40, 4);
    ctx.fill();

    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(w * 0.78 + 18, h * 0.58, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawCoffeeTheme(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#F5EBE6');
    grad.addColorStop(1, '#E6D7CD');
    ctx.fillStyle = grad;
    ctx.fillRect(15, 15, w - 30, h - 30);

    // Ceramic mug
    ctx.fillStyle = '#9C6644';
    ctx.beginPath();
    ctx.roundRect(w * 0.35, h * 0.4, w * 0.3, h * 0.35, [4, 4, 20, 20]);
    ctx.fill();

    // Coffee surface
    ctx.fillStyle = '#4A2E18';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.43, w * 0.12, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Latte art leaf
    ctx.strokeStyle = '#FAF0E6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.46);
    ctx.lineTo(w * 0.5, h * 0.40);
    ctx.stroke();

    // Handle
    ctx.strokeStyle = '#9C6644';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(w * 0.67, h * 0.54, 20, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    // Steam spirals
    ctx.strokeStyle = 'rgba(156, 102, 68, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.46, h * 0.34);
    ctx.quadraticCurveTo(w * 0.42, h * 0.26, w * 0.48, h * 0.18);
    ctx.stroke();
  }

  static drawBeachTheme(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#FF7E5F');
    sky.addColorStop(0.5, '#FEB47B');
    sky.addColorStop(0.8, '#4E65FF');
    sky.addColorStop(1, '#92EFFD');
    ctx.fillStyle = sky;
    ctx.fillRect(15, 15, w - 30, h - 30);

    // Ocean
    ctx.fillStyle = '#2C5364';
    ctx.fillRect(15, h * 0.62, w - 30, h * 0.38 - 15);

    // Sun reflection
    ctx.fillStyle = 'rgba(255, 220, 160, 0.6)';
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.55, 36, 0, Math.PI * 2);
    ctx.fill();

    // Palm tree silhouette
    ctx.fillStyle = '#1A1829';
    ctx.beginPath();
    ctx.moveTo(w * 0.85, h - 15);
    ctx.quadraticCurveTo(w * 0.88, h * 0.5, w * 0.78, h * 0.35);
    ctx.lineTo(w * 0.82, h - 15);
    ctx.fill();

    // Palm fronds
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1A1829';
    for (let a = -0.8; a < 1.2; a += 0.4) {
      ctx.beginPath();
      ctx.moveTo(w * 0.78, h * 0.35);
      ctx.quadraticCurveTo(w * 0.78 + Math.cos(a) * 40, h * 0.35 - Math.sin(a) * 30, w * 0.78 + Math.cos(a) * 70, h * 0.35 - Math.sin(a) * 20);
      ctx.stroke();
    }
  }

  /**
   * Generates the TV screen texture (Off or On state)
   */
  static createTVScreenTexture(isOn = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    if (!isOn) {
      // Off state: deep sleek charcoal with subtle soft glass reflection
      ctx.fillStyle = '#111215';
      ctx.fillRect(0, 0, 512, 300);

      const grad = ctx.createLinearGradient(0, 0, 512, 300);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      grad.addColorStop(0.5, 'transparent');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 300);
    } else {
      // Active state: cozy stylized retro game screen
      const grad = ctx.createLinearGradient(0, 0, 0, 300);
      grad.addColorStop(0, '#1E1B4B');
      grad.addColorStop(0.6, '#4338CA');
      grad.addColorStop(1, '#818CF8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 300);

      // Pixel stars / mountains
      ctx.fillStyle = '#312E81';
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.lineTo(120, 180);
      ctx.lineTo(240, 300);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(180, 300);
      ctx.lineTo(340, 160);
      ctx.lineTo(512, 300);
      ctx.fill();

      // Title badge
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText("RADITYA'S ARCADE", 256, 110);

      // Press start prompt
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '18px sans-serif';
      ctx.fillText("CLICK TV TO LAUNCH GAME", 256, 160);

      // Status bar
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 260, 512, 40);
      ctx.fillStyle = '#A5B4FC';
      ctx.font = '14px sans-serif';
      ctx.fillText("READY • PRESS START • 60 FPS", 256, 285);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}
