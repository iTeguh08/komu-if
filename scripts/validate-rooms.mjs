#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..', 'static', 'rooms');
const doorRe = /^[0-9]{2}$/;
const codes = new Map();
let failed = false;

const fail = (msg) => {
	console.error(msg);
	failed = true;
};

for (const handle of await readdir(root)) {
	if (handle.startsWith('_')) continue;
	const dir = join(root, handle);
	const jsonPath = join(dir, 'room.json');
	let room;
	try {
		room = JSON.parse(await readFile(jsonPath, 'utf8'));
	} catch {
		fail(`${handle}: missing or invalid room.json`);
		continue;
	}
	if (room.handle !== handle) fail(`${handle}: handle mismatch`);
	if (!doorRe.test(room.door_code ?? '')) fail(`${handle}: door_code must be 2 digits`);
	else {
		const prev = codes.get(room.door_code);
		if (prev) fail(`${handle}: door_code ${room.door_code} already used by ${prev}`);
		else codes.set(room.door_code, handle);
	}
	const thumb = room.thumb;
	if (!thumb?.src) fail(`${handle}: thumb required`);
	else {
		try {
			await stat(join(dir, thumb.src));
		} catch {
			fail(`${handle}: thumb file missing: ${thumb.src}`);
		}
	}
}

if (failed) process.exit(1);
console.log(`OK ${codes.size} room(s)`);
