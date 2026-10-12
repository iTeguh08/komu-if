/**
 * Room Configuration for Raditya's Room
 * All photos, external game destinations, and room presets are centralized here.
 * Can be customized without touching scene rendering code.
 */

export const roomConfig = {
  // Identity
  roomName: "Raditya's Room",
  subtitle: "IF B Virtual Room Project",
  creator: "Raditya",

  // Gaming Corner Configuration
  // Validated HTTP/HTTPS external game or interactive destination
  gameUrl: "https://krunker.io", // Or any configured web game destination
  gameName: "Raditya's Arcade",
  gameDescription: "Launch interactive web game on the bedroom TV",

  // Camera Presets
  camera: {
    initialPosition: { x: 7.2, y: 5.6, z: 7.8 },
    target: { x: -0.2, y: 1.2, z: -0.4 },
    fov: 40,
    minDistance: 5.0,
    maxDistance: 16.0,
    maxPolarAngle: Math.PI / 2 - 0.05, // Prevent dipping below floor
    minPolarAngle: 0.2
  },

  // Lighting Presets
  lighting: {
    defaultPreset: "daylight", // "daylight" | "evening"
    presets: {
      daylight: {
        name: "Morning Sun",
        ambientColor: "#FFF8EE",
        ambientIntensity: 0.95,
        sunColor: "#FFF3DC",
        sunIntensity: 1.6,
        sunPosition: { x: -8, y: 7, z: 3 },
        windowLightColor: "#EBF3FF",
        windowIntensity: 1.8,
        lampIntensity: 0.0,
        tvGlowIntensity: 0.15,
        skyColor: "#E8F0FE",
        groundColor: "#E3D5C5"
      },
      evening: {
        name: "Cozy Evening",
        ambientColor: "#2A2535",
        ambientIntensity: 0.45,
        sunColor: "#586282",
        sunIntensity: 0.3,
        sunPosition: { x: -6, y: 4, z: 2 },
        windowLightColor: "#3B4E76",
        windowIntensity: 0.8,
        lampIntensity: 2.2,
        lampColor: "#FFB347",
        tvGlowIntensity: 1.2,
        skyColor: "#1A1A2A",
        groundColor: "#14121A"
      }
    }
  },

  // Wall Photo Gallery
  // Photos generated on the bedroom wall with wooden frames
  photos: [
    {
      id: "photo-1",
      title: "Minecraft Badlands Adventure",
      caption: "Explorasi dunia Minecraft di bioma Badlands dengan Netherite armor.",
      isPlaceholder: false,
      imageUrl: "/photos/photo_minecraft.png",
      position: { x: 0.25, y: 2.65, z: -3.88 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 0.85, height: 0.82, depth: 0.04 },
      frameColor: "#8C5A28",
      matColor: "#FAF7F2"
    },
    {
      id: "photo-2",
      title: "Pantai Sanur with Glasses",
      caption: "Momen santai Raditya di pesisir pantai dengan kacamata hitam.",
      isPlaceholder: false,
      imageUrl: "/photos/photo_raditya_beach1.jpg",
      position: { x: 1.28, y: 2.65, z: -3.88 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 0.85, height: 0.82, depth: 0.04 },
      frameColor: "#8C5A28",
      matColor: "#FAF7F2"
    },
    {
      id: "photo-3",
      title: "Vestia Zeta Secret Agent",
      caption: "Potret close-up Vestia Zeta dengan topeng mata misterius dan mata biru keunguan.",
      isPlaceholder: false,
      imageUrl: "/photos/photo_vestia_zeta.jpg",
      position: { x: 2.32, y: 2.65, z: -3.88 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 0.85, height: 0.82, depth: 0.04 },
      frameColor: "#8C5A28",
      matColor: "#FAF7F2"
    },
    {
      id: "photo-4",
      title: "Beach Breeze Memories",
      caption: "Menikmati hangatnya angin laut dan pemandangan perahu di pantai.",
      isPlaceholder: false,
      imageUrl: "/photos/photo_raditya_beach2.jpg",
      position: { x: 3.35, y: 2.65, z: -3.88 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 0.85, height: 0.82, depth: 0.04 },
      frameColor: "#8C5A28",
      matColor: "#FAF7F2"
    }
  ]
};
