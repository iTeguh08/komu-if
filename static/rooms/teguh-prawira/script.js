// Teguh Prawira's room. Edit the notes below to change what each object says.
const NOTES = {
	poster: 'IF B Pagi, Angkatan 14. Tahun pertama, baru mulai.',
	window: 'Di luar sudah malam. Di dalam masih ada yang menyala.',
	shelf: 'Buku yang belum selesai dibaca. Jumlahnya jujur.',
	laptop: 'Sedang membangun komu-if, galeri yang kamu lihat sekarang.',
	plant: 'Satu-satunya penghuni yang tidak minta di-debug.',
	chess: 'Catur. Satu langkah salah, selesai. Coba puzzle-nya.',
	rubik: 'Rubik. Bisa diputar dan diacak di arcade.',
	pad: 'Controller. Hobi yang belum pernah dianggap kerjaan.',
	arcade: 'Mesin arcade. Masukkan koin imajiner.',
	radio: 'Radio. Satu lagu, diputar berulang.',
};
const HINT = 'Gerakkan cahaya. Cari benda di kamar ini.';

const stage = document.getElementById('stage');
const scene = document.getElementById('scene') || stage;
const note = document.getElementById('note');
const toggle = document.getElementById('switch');
const lamp = document.getElementById('lamp');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let tx = innerWidth * 0.3, ty = innerHeight * 0.45; // target
let x = tx, y = ty; // current
let userMoved = false;
let hintTimer;

function frame() {
	const k = reduced ? 1 : 0.16;
	x += (tx - x) * k;
	y += (ty - y) * k;
	stage.style.setProperty('--x', x.toFixed(1) + 'px');
	stage.style.setProperty('--y', y.toFixed(1) + 'px');
	requestAnimationFrame(frame);
}
frame();

function aim(px, py) { tx = px; ty = py; }
function aimAt(el) {
	const r = el.getBoundingClientRect();
	const sr = scene.getBoundingClientRect();
	aim(r.left - sr.left + r.width / 2, r.top - sr.top + r.height / 2);
}

function handlePointer(e) {
	const sr = scene.getBoundingClientRect();
	userMoved = true;
	aim(e.clientX - sr.left, e.clientY - sr.top);
}

scene.addEventListener('pointermove', handlePointer);
scene.addEventListener('pointerdown', handlePointer);

function say(text) {
	note.textContent = text;
	clearTimeout(hintTimer);
	hintTimer = setTimeout(() => (note.textContent = HINT), 7000);
}

function setLit(on) {
	stage.dataset.lit = String(on);
	toggle.setAttribute('aria-pressed', String(on));
	toggle.textContent = on ? 'Matikan lampu' : 'Nyalakan semua lampu';
}
toggle.addEventListener('click', () => setLit(stage.dataset.lit !== 'true'));
lamp.addEventListener('click', () => {
	setLit(stage.dataset.lit !== 'true');
	say(stage.dataset.lit === 'true' ? 'Klik.' : 'Gelap lagi.');
});

for (const el of stage.querySelectorAll('.obj[data-note]')) {
	el.addEventListener('click', () => { aimAt(el); say(NOTES[el.dataset.note]); });
}
for (const el of stage.querySelectorAll('.obj')) {
	el.addEventListener('focus', () => { userMoved = true; aimAt(el); });
}

// One authored moment: the light sweeps across the room once, then hands over to you.
if (!reduced) {
	const stops = ['.window', '.desk', '.poster', '.title'];
	stops.forEach((sel, i) => {
		setTimeout(() => {
			if (userMoved) return;
			const el = document.querySelector(sel);
			if (el) aimAt(el);
		}, 500 + i * 900);
	});
}
