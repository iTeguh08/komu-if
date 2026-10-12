import { asset } from '$app/paths';

export type Room = {
	v: 1;
	handle: string;
	name: string;
	tagline: string;
	door_code: string;
	tags?: string[];
	thumb: { src: string; w: number; h: number };
	accent?: string;
	entry?: string;
};

// Every static/rooms/<handle>/room.json becomes a room. See docs/SCHEMA.md.
const mods = import.meta.glob<Room>('/static/rooms/*/room.json', { eager: true, import: 'default' });

export const rooms: Room[] = Object.values(mods).sort((a, b) => a.name.localeCompare(b.name));

// asset() prefixes the base path; static/ files are not typed for dynamic names
export const roomUrl = (r: Room, file = r.entry ?? '') =>
	asset(`rooms/${r.handle}/${file}` as Parameters<typeof asset>[0]);
