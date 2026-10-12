import * as THREE from 'three';
import { CharacterBuilder } from './CharacterBuilder.js';

/**
 * Character Manager for Raditya and Vestia Zeta
 * Autonomous life-simulation behavior:
 * - Independent & coupled wandering around the room (no longer glued together)
 * - Activities: Coding at laptop desk, Playing game at TV console, Looking out window, Relaxing on bed
 * - Interactive Speech Bubbles when clicked ("Hi!", playful dialogue)
 */
export class CharacterManager {
  constructor(scene, chatBubbleManager, tvGaming) {
    this.scene = scene;
    this.chatBubbles = chatBubbleManager;
    this.tvGaming = tvGaming;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Initial character positions
    this.radityaData = {
      name: "Raditya",
      pos: new THREE.Vector3(1.0, 0, 0.4),
      targetPos: new THREE.Vector3(2.15, 0, 1.55),
      facingAngle: 0,
      state: 'WALKING', // 'WALKING' | 'CODING' | 'GAMING' | 'WINDOW' | 'BED' | 'IDLE' | 'WAVING'
      walkPhase: 0,
      actionTimer: 2.0,
      currentActivity: null
    };

    this.zetaData = {
      name: "Vestia Zeta",
      pos: new THREE.Vector3(-0.8, 0, 0.6),
      targetPos: new THREE.Vector3(-2.4, 0, 1.5),
      facingAngle: 0,
      state: 'WALKING',
      walkPhase: 0,
      actionTimer: 3.5,
      currentActivity: null
    };

    this.initCharacters();
    this.initActivitySpots();
  }

  initCharacters() {
    this.raditya = CharacterBuilder.buildRaditya();
    this.zeta = CharacterBuilder.buildVestiaZeta();

    this.group.add(this.raditya.root);
    this.group.add(this.zeta.root);

    // Interactive clicking registration
    this.interactiveObjects = [];
    const makeInteractive = (charRoot, name) => {
      charRoot.traverse((child) => {
        if (child.isMesh) {
          child.userData = {
            isInteractive: true,
            action: 'interactCouple',
            characterName: name,
            name: `${name}`,
            hint: `Click to talk with ${name}`
          };
          this.interactiveObjects.push(child);
        }
      });
    };

    makeInteractive(this.raditya.root, "Raditya");
    makeInteractive(this.zeta.root, "Vestia Zeta");
  }

  initActivitySpots() {
    // Defined functional spots around Raditya's bedroom
    this.spots = {
      // 1. Coding at study desk
      desk_coding: {
        radityaPos: new THREE.Vector3(2.15, 0, 1.55),
        radityaAngle: Math.PI, // Facing desk
        zetaPos: new THREE.Vector3(1.7, 0, 1.25),
        zetaAngle: 0.6, // Standing beside desk looking at laptop
        duration: 9.0,
        activity: 'CODING',
        radityaLines: [
          "Bentar ya, lagi ngoding nge-fix bug dulu hehe 💻",
          "Sedikit lagi selesai nih fitur baru kamarnya!",
          "Ngoding di kamar sendiri emang paling pewe ☕"
        ],
        zetaLines: [
          "Raditya lagi fokus ngoding tuh, jangan diganggu dulu ya~ ✨",
          "Wah kodingan Three.js apa nih? Keren banget!",
          "Secret Agent 77 lagi mengawasi jalannya proses deployment hehe!"
        ]
      },

      // 2. Gaming at TV Console
      tv_gaming: {
        radityaPos: new THREE.Vector3(1.5, 0, -1.8),
        radityaAngle: Math.PI, // Facing TV
        zetaPos: new THREE.Vector3(2.1, 0, -1.8),
        zetaAngle: Math.PI, // Facing TV
        duration: 10.0,
        activity: 'GAMING',
        radityaLines: [
          "Lagi seru banget main game sama Zeta nih! 🎮",
          "Ayo rematch Zeta, kali ini aku pasti menang!",
          "Main game di konsol emang paling seru setelah ngoding seharian!"
        ],
        zetaLines: [
          "Jangan remehin Secret Agent 77 ya, aku jago main game! 🕹️",
          "Hehe aku menang lagi kan Raditya~ GG!",
          "Ayo main game bareng lagi, seru banget!"
        ]
      },

      // 3. Relaxing near the sunny/twilight window
      window_chill: {
        radityaPos: new THREE.Vector3(-2.4, 0, 1.6),
        radityaAngle: -Math.PI / 2, // Facing window
        zetaPos: new THREE.Vector3(-2.4, 0, 1.0),
        zetaAngle: -Math.PI / 2, // Facing window
        duration: 7.0,
        activity: 'WINDOW',
        radityaLines: [
          "Udaranya seger banget dari jendela kamar.",
          "Pemandangan langit dari sini estetik banget ya.",
          "Cahaya mataharinya bikin kamar terasa hangat."
        ],
        zetaLines: [
          "Langit di luar indah banget ya dilihat dari kamar Raditya~ ☁️",
          "Anginnya sepoi-sepoi, adem banget di sini!",
          "Spot jendela ini cozy banget buat santai~"
        ]
      },

      // 4. Relaxing on the edge of the cozy bed
      bed_chill: {
        radityaPos: new THREE.Vector3(-1.15, 0, -1.9),
        radityaAngle: Math.PI / 2, // Facing room
        zetaPos: new THREE.Vector3(-1.15, 0, -1.3),
        zetaAngle: Math.PI / 2,
        duration: 6.5,
        activity: 'BED',
        radityaLines: [
          "Kasurnya empuk banget, mager jadinya hehe.",
          "Kamar ini emang didesain biar super cozy.",
          "Hi! Mau ikut santai di kamar?"
        ],
        zetaLines: [
          "Nyamannya kasur ini... hampir ketiduran tadi hehe~ 💤",
          "Kombinasi sprei sage green sama kayu oak-nya estetik banget!",
          "Kamar Raditya ini definisi kamar impian banget ya~"
        ]
      },

      // 5. Casual stroll spots
      stroll_center: {
        radityaPos: new THREE.Vector3(0.1, 0, 0.2),
        radityaAngle: 0,
        zetaPos: new THREE.Vector3(-0.6, 0, -0.4),
        zetaAngle: 0.8,
        duration: 5.0,
        activity: 'IDLE',
        radityaLines: [
          "Hi! Selamat datang di Raditya's Room!",
          "Lagi keliling kamar nih bareng Zeta."
        ],
        zetaLines: [
          "Hii! Secret Agent 77 lagi patroli keliling kamar Raditya!",
          "Hi! Senang kamu mampir ke kamar Raditya~"
        ]
      }
    };
  }

  /**
   * Called when user clicks Raditya or Zeta
   */
  interactWithCharacter(charName) {
    const isZeta = charName === "Vestia Zeta";
    const char = isZeta ? this.zeta : this.raditya;
    const data = isZeta ? this.zetaData : this.radityaData;

    // Trigger cute wave
    this.triggerWave(data, char);

    // Get context-aware speech dialogue
    const lines = this.getDialogueLines(isZeta, data.state);
    const randomMsg = lines[Math.floor(Math.random() * lines.length)];

    if (this.chatBubbles) {
      this.chatBubbles.showBubble(char.root, charName, randomMsg, 4.5);
    }
  }

  getDialogueLines(isZeta, state) {
    if (isZeta) {
      switch (state) {
        case 'CODING':
          return [
            "Raditya lagi fokus ngoding tuh, jangan diganggu dulu ya~ ☕",
            "Wah kodingan Three.js apa nih? Keren banget!",
            "Secret Agent 77 lagi mengawasi jalannya proses deployment hehe!"
          ];
        case 'GAMING':
          return [
            "Jangan remehin Secret Agent 77 ya, aku jago main game! 🕹️",
            "Hehe aku menang lagi kan Raditya~ GG!",
            "Ayo main game bareng lagi, seru banget!"
          ];
        case 'WINDOW':
          return [
            "Langit di luar indah banget ya dilihat dari kamar Raditya~ ☁️",
            "Anginnya sepoi-sepoi, adem banget di sini!",
            "Spot jendela ini cozy banget buat santai~"
          ];
        case 'BED':
          return [
            "Nyamannya kasur ini... hampir ketiduran tadi hehe~ 💤",
            "Kombinasi sprei sage green sama kayu oak-nya estetik banget!",
            "Kamar Raditya ini definisi kamar impian banget ya~"
          ];
        default:
          return [
            "Hii! Secret Agent 77 lagi patroli keliling kamar Raditya!",
            "Hi! Senang kamu mampir ke kamar Raditya~",
            "Kamar ini cozy dan estetik banget ya!"
          ];
      }
    } else {
      switch (state) {
        case 'CODING':
          return [
            "Bentar ya, lagi ngoding nge-fix bug dulu hehe 💻",
            "Sedikit lagi selesai nih fitur baru kamarnya!",
            "Ngoding di kamar sendiri emang paling pewe ☕"
          ];
        case 'GAMING':
          return [
            "Lagi seru banget main game sama Zeta nih! 🎮",
            "Ayo rematch Zeta, kali ini aku pasti menang!",
            "Main game di konsol emang paling seru setelah ngoding seharian!"
          ];
        case 'WINDOW':
          return [
            "Udaranya seger banget dari jendela kamar.",
            "Pemandangan langit dari sini estetik banget ya.",
            "Cahaya mataharinya bikin kamar terasa hangat."
          ];
        case 'BED':
          return [
            "Kasurnya empuk banget, mager jadinya hehe.",
            "Kamar ini emang didesain biar super cozy.",
            "Hi! Mau ikut santai di kamar?"
          ];
        default:
          return [
            "Hi! Selamat datang di Raditya's Room!",
            "Lagi keliling kamar nih bareng Zeta.",
            "Kamu bisa klik TV, lampu, atau foto-foto di dinding juga loh!"
          ];
      }
    }
  }

  triggerWave(data, char) {
    data.prevState = data.state;
    data.state = 'WAVING';
    data.waveTimer = 3.0;
  }

  update(delta) {
    this.updateCharacter(this.radityaData, this.raditya, delta, true);
    this.updateCharacter(this.zetaData, this.zeta, delta, false);
  }

  updateCharacter(data, char, delta, isRaditya) {
    const time = performance.now() * 0.001;

    // WAVING STATE
    if (data.state === 'WAVING') {
      data.waveTimer -= delta;
      const waveFreq = time * 8;

      if (isRaditya) {
        char.rightArm.rotation.z = -1.2 + Math.sin(waveFreq) * 0.35;
        char.rightArm.rotation.x = 0.2;
      } else {
        char.leftArm.rotation.z = 1.2 - Math.sin(waveFreq) * 0.35;
        char.leftArm.rotation.x = 0.2;
      }

      if (data.waveTimer <= 0) {
        data.state = data.prevState || 'IDLE';
        char.rightArm.rotation.set(0, 0, 0);
        char.leftArm.rotation.set(0, 0, 0);
      }
      return;
    }

    // CODING STATE (At desk)
    if (data.state === 'CODING') {
      data.actionTimer -= delta;

      if (isRaditya) {
        // Seated on chair typing rapidly
        char.pelvis.position.y = 0.42;
        char.leftLeg.rotation.x = -Math.PI / 2.2;
        char.rightLeg.rotation.x = -Math.PI / 2.2;

        // Rapid typing arm movement
        const typeL = Math.sin(time * 22) * 0.08;
        const typeR = Math.cos(time * 20) * 0.08;
        char.leftArm.rotation.set(-1.1 + typeL, 0, 0.2);
        char.rightArm.rotation.set(-1.1 + typeR, 0, -0.2);
        char.headGroup.rotation.x = 0.2; // Looking down at laptop screen
      } else {
        // Zeta standing beside desk looking at laptop screen
        char.pelvis.position.y = 0.56;
        char.leftLeg.rotation.set(0, 0, 0);
        char.rightLeg.rotation.set(0, 0, 0);
        char.leftArm.rotation.set(-0.3, 0, 0.1);
        char.rightArm.rotation.set(-0.3, 0, -0.1);
        char.headGroup.rotation.set(0.15, 0.3, 0);
      }

      if (data.actionTimer <= 0) {
        this.assignNextActivity(data, isRaditya);
      }
      return;
    }

    // GAMING STATE (At TV console)
    if (data.state === 'GAMING') {
      data.actionTimer -= delta;

      // Both seated on floor cushion holding controller
      char.pelvis.position.y = 0.26;
      char.leftLeg.rotation.x = -Math.PI / 2.2;
      char.rightLeg.rotation.x = -Math.PI / 2.2;

      // Controller grip pose with gaming body lean
      const gameAction = Math.sin(time * 6) * 0.06;
      char.leftArm.rotation.set(-0.95 + gameAction, 0, 0.35);
      char.rightArm.rotation.set(-0.95 + gameAction, 0, -0.35);
      char.pelvis.rotation.y = gameAction * 0.5;
      char.headGroup.rotation.x = -0.1; // Looking up at TV

      if (data.actionTimer <= 0) {
        this.assignNextActivity(data, isRaditya);
      }
      return;
    }

    // WINDOW CHILL STATE
    if (data.state === 'WINDOW') {
      data.actionTimer -= delta;
      char.pelvis.position.y = isRaditya ? 0.6 : 0.56;
      char.leftLeg.rotation.set(0, 0, 0);
      char.rightLeg.rotation.set(0, 0, 0);
      char.leftArm.rotation.set(0, 0, 0);
      char.rightArm.rotation.set(0, 0, 0);

      // Subtle breeze head tilt
      char.headGroup.rotation.y = Math.sin(time * 0.8) * 0.2;
      char.headGroup.rotation.x = -0.05;

      if (data.actionTimer <= 0) {
        this.assignNextActivity(data, isRaditya);
      }
      return;
    }

    // BED CHILL STATE
    if (data.state === 'BED') {
      data.actionTimer -= delta;
      // Sitting on bed edge
      char.pelvis.position.y = 0.44;
      char.leftLeg.rotation.x = -Math.PI / 2.4 + Math.sin(time * 2) * 0.08;
      char.rightLeg.rotation.x = -Math.PI / 2.4 - Math.sin(time * 2) * 0.08;
      char.leftArm.rotation.set(0, 0, 0.1);
      char.rightArm.rotation.set(0, 0, -0.1);

      if (data.actionTimer <= 0) {
        this.assignNextActivity(data, isRaditya);
      }
      return;
    }

    // IDLE PAUSE STATE
    if (data.state === 'IDLE') {
      data.actionTimer -= delta;
      char.pelvis.position.y = (isRaditya ? 0.6 : 0.56) + Math.sin(time * 2.5) * 0.012;
      char.leftLeg.rotation.set(0, 0, 0);
      char.rightLeg.rotation.set(0, 0, 0);
      char.leftArm.rotation.set(0, 0, 0);
      char.rightArm.rotation.set(0, 0, 0);
      char.headGroup.rotation.set(0, Math.sin(time * 1.5) * 0.15, 0);

      if (data.actionTimer <= 0) {
        this.assignNextActivity(data, isRaditya);
      }
      return;
    }

    // WALKING STATE
    if (data.state === 'WALKING') {
      const dir = new THREE.Vector3().subVectors(data.targetPos, data.pos);
      const dist = dir.length();
      const moveSpeed = 0.78;

      if (dist < 0.1) {
        // Arrived at target
        data.pos.copy(data.targetPos);
        data.facingAngle = data.targetAngle !== undefined ? data.targetAngle : data.facingAngle;
        data.state = data.nextState || 'IDLE';
        data.actionTimer = data.nextDuration || 4.0;
        this.resetLimbs(char, isRaditya);
      } else {
        dir.normalize();
        data.pos.addScaledVector(dir, moveSpeed * delta);

        // Smooth rotation
        const targetAngle = Math.atan2(dir.x, dir.z);
        let diff = targetAngle - data.facingAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        data.facingAngle += diff * Math.min(1, delta * 7.0);

        // Walk cycle
        data.walkPhase += delta * 7.2;
        const swing = Math.sin(data.walkPhase);
        const cosSwing = Math.cos(data.walkPhase);

        char.leftLeg.rotation.x = swing * 0.44;
        char.rightLeg.rotation.x = -swing * 0.44;
        char.leftArm.rotation.x = -swing * 0.35;
        char.rightArm.rotation.x = swing * 0.35;
        char.pelvis.position.y = (isRaditya ? 0.6 : 0.56) + Math.abs(cosSwing) * 0.025;
        char.pelvis.rotation.z = (isRaditya ? 1 : -1) * Math.sin(data.walkPhase * 0.5) * 0.03;
      }

      char.root.position.copy(data.pos);
      char.root.rotation.y = data.facingAngle;
    }
  }

  assignNextActivity(data, isRaditya) {
    // Pick random activity
    const spotKeys = Object.keys(this.spots);
    const chosenKey = spotKeys[Math.floor(Math.random() * spotKeys.length)];
    const spot = this.spots[chosenKey];

    const targetPos = isRaditya ? spot.radityaPos : spot.zetaPos;
    const targetAngle = isRaditya ? spot.radityaAngle : spot.zetaAngle;

    data.targetPos.copy(targetPos);
    data.targetAngle = targetAngle;
    data.nextState = spot.activity;
    data.nextDuration = spot.duration;
    data.state = 'WALKING';

    // Trigger TV power on if activity is gaming
    if (spot.activity === 'GAMING' && this.tvGaming) {
      this.tvGaming.setPower(true);
    }
  }

  resetLimbs(char, isRaditya) {
    char.leftLeg.rotation.set(0, 0, 0);
    char.rightLeg.rotation.set(0, 0, 0);
    char.leftArm.rotation.set(0, 0, 0);
    char.rightArm.rotation.set(0, 0, 0);
    char.pelvis.rotation.set(0, 0, 0);
    char.pelvis.position.y = isRaditya ? 0.6 : 0.56;
    char.headGroup.rotation.set(0, 0, 0);
  }

  getInteractiveObjects() {
    return this.interactiveObjects;
  }
}
