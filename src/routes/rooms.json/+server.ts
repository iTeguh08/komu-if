import { json } from '@sveltejs/kit';
import { rooms } from '#lib/rooms.ts';

export const prerender = true;

export const GET = () => json(rooms.map(({ handle, name, entry }) => ({ handle, name, entry })));
