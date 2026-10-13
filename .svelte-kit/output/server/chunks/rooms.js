import { bt as asset } from "./internal.js";
var rooms = Object.values(/* @__PURE__ */ Object.assign({
	"/static/rooms/krishna-sugosa/room.json": {
		v: 1,
		handle: "krishna-sugosa",
		door_code: "61",
		name: "Krishna Sugosa",
		tagline: "A tiny car game.",
		tags: ["game"],
		thumb: {
			"src": "thumb.webp",
			"w": 800,
			"h": 1e3
		},
		accent: "#ff5a36"
	},
	"/static/rooms/raditya-room/room.json": {
		v: 1,
		handle: "raditya-room",
		name: "Raditya's Room",
		tagline: "Stylized 3D bedroom with Spotify radio and wall memories.",
		tags: [
			"3d",
			"threejs",
			"interactive",
			"music"
		],
		thumb: {
			"src": "thumb.png",
			"w": 800,
			"h": 600
		},
		accent: "#d97706"
	},
	"/static/rooms/teguh-prawira/room.json": {
		v: 1,
		handle: "teguh-prawira",
		door_code: "50",
		name: "Teguh Prawira",
		tagline: "Kamar gelap. Bawa senter.",
		tags: ["interactive", "art"],
		thumb: {
			"src": "thumb.webp",
			"w": 800,
			"h": 1e3
		},
		accent: "#ffb454"
	}
})).sort((a, b) => a.name.localeCompare(b.name));
var roomUrl = (r, file = r.entry ?? "") => asset(`rooms/${r.handle}/${file}`);
//#endregion
export { rooms as n, roomUrl as t };

//# sourceMappingURL=rooms.js.map