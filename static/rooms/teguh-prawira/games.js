// Teguh Prawira's room: music, quotes, and the arcade. Everything runs in the browser, nothing is sent anywhere.
// Edit QUOTES, PUZZLES and SNIPPETS below to make them yours.

const TP = (() => {
	// ---- pure logic (also run by Node for the checks) ----
	const QUOTES = [
		['Talk is cheap. Show me the code.', 'Linus Torvalds'],
		['Premature optimization is the root of all evil.', 'Donald Knuth'],
		['Every chess master was once a beginner.', 'Irving Chernev'],
		['Make it work, make it right, make it fast.', 'Kent Beck'],
	];

	// FEN piece placement, white to move, `sol` = every accepted mating move (from+to).
	const PUZZLES = [
		{ fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1', sol: ['d1d8'], hint: 'Mate di baris belakang.' },
		{ fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR', sol: ['h5f7'], hint: 'Satu kotak yang cuma dijaga raja.' },
		{ fen: '7k/5Q2/6K1/8/8/8/8/8', sol: ['f7g7', 'f7h7', 'f7f8'], hint: 'Raja putih ikut membantu.' },
		{ fen: '6rk/6pp/8/6N1/8/8/8/6K1', sol: ['g5f7'], hint: 'Raja hitam terkunci pion dan bentengnya sendiri.' },
	];

	const SNIPPETS = [
		'const sum = (a, b) => a + b;',
		'for (let i = 0; i < 10; i++) {}',
		'git commit -m "fix: bug"',
		"document.querySelector('.room')",
		'SELECT * FROM rooms WHERE door = 50;',
	];

	// Rubik: each sticker keeps a position p, a normal n and a basis (u, v), all integer vectors.
	const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
	const rot = (w, k, a) => {
		const [x, y, z] = w, c = Math.cos(a), s = Math.sin(a);
		return k === 0 ? [x, y * c - z * s, y * s + z * c] : k === 1 ? [x * c + z * s, y, -x * s + z * c] : [x * c - y * s, x * s + y * c, z];
	};
	const snap = (w) => w.map((n) => Math.round(n) + 0);

	function makeCube() {
		const out = [];
		for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
			for (let k = 0; k < 3; k++) {
				const c = [x, y, z][k];
				if (c === 0) continue;
				const n = [0, 0, 0]; n[k] = c;
				const u = k === 2 || k === 1 ? [1, 0, 0] : [0, 0, 1];
				out.push({ p: [x, y, z], n, u, v: cross(n, u), color: n.join() });
			}
		}
		return out;
	}
	// Quarter turn of one layer: axis k (0 x, 1 y, 2 z), layer -1|0|1, dir +1|-1. Mutates and returns the stickers.
	function turn(cube, k, layer, dir) {
		for (const s of cube) {
			if (s.p[k] !== layer) continue;
			for (const f of ['p', 'n', 'u', 'v']) s[f] = snap(rot(s[f], k, (dir * Math.PI) / 2));
		}
		return cube;
	}
	const isSolved = (cube) => {
		const seen = {};
		for (const s of cube) {
			const key = s.color, n = s.n.join();
			if (seen[key] !== undefined && seen[key] !== n) return false;
			seen[key] = n;
		}
		return true;
	};
	const state = (cube) => cube.map((s) => [s.p, s.n].join('|')).join(';');

	return { QUOTES, PUZZLES, SNIPPETS, makeCube, turn, isSolved, state, rot };
})();

if (typeof module !== 'undefined') module.exports = TP;

if (typeof document !== 'undefined') (() => {
	const $ = (s, r = document) => r.querySelector(s);
	const mk = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const KEY = 'teguh-prawira:'; // rule 12: prefix every localStorage key with the handle

	// ---- quote on the wall ----
	let qi = 0;
	let quoteTimer = null;
	function showQuote() {
		const [text, by] = TP.QUOTES[qi++ % TP.QUOTES.length];
		$('#q-text').textContent = '\u201C' + text + '\u201D';
		$('#q-by').textContent = by;
		if (quoteTimer) clearInterval(quoteTimer);
		quoteTimer = setInterval(showQuote, 14000);
	}
	showQuote();
	$('#quote').addEventListener('click', showQuote);

	// ---- the little cube on the shelf ----
	const COLORS = { '1,0,0': '#c8362b', '-1,0,0': '#e0782a', '0,1,0': '#eeeae0', '0,-1,0': '#e6c630', '0,0,1': '#2a9a4a', '0,0,-1': '#2d6fcf' };
	const faces = ['rotateY(0deg)', 'rotateY(180deg)', 'rotateY(90deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'];
	const mini = $('#mini-cube');
	faces.forEach((t, i) => {
		const f = mk('span', 'face');
		f.style.transform = `${t} translateZ(calc(var(--c) / 2))`;
		for (let j = 0; j < 9; j++) { const s = mk('i'); s.style.background = Object.values(COLORS)[i]; f.append(s); }
		mini.append(f);
	});
	$('#rubik').addEventListener('click', () => { mini.classList.remove('whirl'); void mini.offsetWidth; mini.classList.add('whirl'); });
	$('#pad').addEventListener('click', () => { const p = $('#pad'); p.classList.remove('press'); void p.offsetWidth; p.classList.add('press'); });

	// ---- music: official video via youtube-nocookie, starts on the first interaction ----
	const VID = 'tI-5uv4wryI';
	const player = $('#player'), radio = $('#radio');
	let frame = null, paused = false, muted = false;
	const send = (func) => frame && frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
	function startMusic() {
		if (frame) return;
		frame = mk('iframe');
		frame.title = 'Oasis, Champagne Supernova (video resmi)';
		frame.allow = 'autoplay; encrypted-media; picture-in-picture';
		frame.referrerPolicy = 'strict-origin-when-cross-origin';
		frame.src = `https://www.youtube-nocookie.com/embed/${VID}?autoplay=1&enablejsapi=1&playsinline=1&rel=0&loop=1&playlist=${VID}`;
		$('.player-box').append(frame);
		player.hidden = false;
		paused = muted = false;
		syncMusic();
	}
	function syncMusic() {
		$('#pp').textContent = paused ? 'Putar' : 'Jeda';
		$('#mu').textContent = muted ? 'Suara' : 'Mute';
		radio.classList.toggle('on', !!frame && !paused);
	}
	function togglePause() { if (!frame) return startMusic(); paused = !paused; send(paused ? 'pauseVideo' : 'playVideo'); syncMusic(); }
	$('#pp').addEventListener('click', togglePause);
	$('#mu').addEventListener('click', () => { muted = !muted; send(muted ? 'mute' : 'unMute'); syncMusic(); });
	$('#px').addEventListener('click', () => { frame.remove(); frame = null; player.hidden = true; syncMusic(); });
	radio.addEventListener('click', togglePause);
	const first = (e) => {
		removeEventListener('click', first);
		if (!radio.contains(e.target)) startMusic(); // a click on the radio handles itself
	};
	addEventListener('click', first);

	// ---- arcade hub ----
	const hub = $('#hub'), menu = $('#hub-menu'), view = $('#hub-view'), body = $('#hub-body');
	const TITLES = { hunt: 'Cari Barang', rubik: 'Rubik 3D', chess: 'Mate in 1', typing: 'Ngetik Kode' };
	let stop = null;
	const halt = () => { if (stop) stop(); stop = null; };
	function openHub(game) {
		if (!hub.open) hub.showModal();
		game ? show(game) : showMenu();
	}
	function showMenu() { halt(); menu.hidden = false; view.hidden = true; $('#hub-title').textContent = 'Arcade Teguh'; }
	function show(name) {
		halt(); body.replaceChildren();
		if (name === 'hunt') { hub.close(); return startHunt(); }
		menu.hidden = true; view.hidden = false;
		$('#hub-title').textContent = TITLES[name];
		stop = { rubik: gameRubik, chess: gameChess, typing: gameTyping }[name](body) || null;
	}
	menu.addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (b) show(b.dataset.g); });
	$('#hub-back').addEventListener('click', showMenu);
	$('#hub-x').addEventListener('click', () => hub.close());
	hub.addEventListener('close', halt);
	hub.addEventListener('click', (e) => { // click on the backdrop, not the padding
		if (e.target !== hub) return; // bubbled from a child that may have resized the dialog
		const r = hub.getBoundingClientRect();
		if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) hub.close();
	});
	scene.addEventListener('click', (e) => {
		const b = e.target.closest('[data-game]');
		if (b) openHub(b.dataset.game === 'menu' ? null : b.dataset.game);
	});

	// ---- game 1: find the hidden things with the flashlight ----
	let hunt = null;
	const hud = $('#hud'), hudT = $('#hud-t');
	function startHunt() {
		if (hunt) hunt.end('stop');
		setLit(false); toggle.disabled = true;
		const glyphs = ['\uD83D\uDD11', '\uD83E\uDE99', '\uD83D\uDCFC', '\u2B50', '\uD83C\uDFB2'];
		const names = ['kunci', 'koin', 'kaset', 'bintang', 'dadu'];
		const sr = scene.getBoundingClientRect();
		const pts = [];
		while (pts.length < glyphs.length) {
			const c = [sr.width * (0.06 + Math.random() * 0.88), sr.height * (0.12 + Math.random() * 0.76)];
			if (pts.every((q) => Math.hypot(q[0] - c[0], q[1] - c[1]) > sr.width * 0.12)) pts.push(c);
		}
		const dark = $('.dark', scene);
		let found = 0, left = 45;
		const best = () => Number(localStorage.getItem(KEY + 'hunt-best')) || 0;
		const items = pts.map((c, i) => {
			const b = mk('button', 'hunt-item', glyphs[i]);
			b.type = 'button'; b.setAttribute('aria-label', names[i]);
			b.style.left = c[0] + 'px'; b.style.top = c[1] + 'px';
			b.addEventListener('click', () => {
				const r = Math.min(320, Math.max(150, 0.24 * Math.max(innerWidth, innerHeight))) * 0.9;
				const bb = b.getBoundingClientRect(), s2 = scene.getBoundingClientRect();
				const curX = parseFloat(stage.style.getPropertyValue('--x')) || x;
				const curY = parseFloat(stage.style.getPropertyValue('--y')) || y;
				if (Math.hypot(bb.left - s2.left + bb.width / 2 - curX, bb.top - s2.top + bb.height / 2 - curY) > r) return say('Terlalu gelap. Dekatkan senter dulu.');
				b.remove(); found++; paint();
				if (found === glyphs.length) end('win');
			});
			scene.insertBefore(b, dark);
			return b;
		});
		const paint = () => { hudT.textContent = `${found}/${glyphs.length} ketemu · ${left}s`; };
		const timer = setInterval(() => { if (--left <= 0) end('lose'); else paint(); }, 1000);
		function end(why) {
			clearInterval(timer); items.forEach((b) => b.remove()); toggle.disabled = false; hunt = null;
			if (why === 'win') {
				const t = 45 - left, b0 = best();
				if (!b0 || t < b0) localStorage.setItem(KEY + 'hunt-best', t);
				hudT.textContent = `Semua ketemu dalam ${t}s · rekor ${Math.min(t, b0 || t)}s`;
			} else if (why === 'lose') hudT.textContent = `Waktu habis, ${found}/${glyphs.length}. Coba lagi dari arcade.`;
			if (why === 'stop') return (hud.hidden = true);
			setTimeout(() => { if (!hunt) hud.hidden = true; }, 5000);
		}
		hunt = { end };
		hud.hidden = false; paint();
		say('Ada 5 benda tersembunyi. Cari pakai senter, klik saat kena cahaya.');
	}
	$('#hud-x').addEventListener('click', () => hunt ? hunt.end('stop') : (hud.hidden = true));

	// ---- game 2: rubik 3D ----
	function gameRubik(root) {
		const S = 46;
		const cube = TP.makeCube(), history = [];
		const wrap = mk('div', 'cube-wrap'), c3 = mk('div', 'cube3d');
		wrap.append(c3);
		const els = cube.map((s) => { const e = mk('i', 'st'); e.style.background = COLORS[s.color]; c3.append(e); return e; });
		const status = mk('p', 'hub-status', 'Seret untuk memutar sudut pandang. Tombol di bawah memutar satu sisi.');
		let ry = -35, rx = -25, busy = false;
		const view3 = () => { c3.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; };
		const draw = (anim) => cube.forEach((s, i) => {
			let { p, n, u, v } = s;
			if (anim && p[anim.k] === anim.layer) [p, n, u, v] = [p, n, u, v].map((w) => TP.rot(w, anim.k, anim.a));
			els[i].style.transform = `matrix3d(${u[0]},${u[1]},${u[2]},0,${v[0]},${v[1]},${v[2]},0,${n[0]},${n[1]},${n[2]},0,${(p[0] + n[0] / 2) * S},${(p[1] + n[1] / 2) * S},${(p[2] + n[2] / 2) * S},1)`;
		});
		const move = (m, ms) => new Promise((done) => {
			const [k, layer, dir] = m, t0 = performance.now();
			const tick = (now) => {
				const t = ms ? Math.min(1, (now - t0) / ms) : 1;
				if (t < 1) { draw({ k, layer, a: dir * (Math.PI / 2) * t * t * (3 - 2 * t) }); return requestAnimationFrame(tick); }
				TP.turn(cube, k, layer, dir); draw(); done();
			};
			requestAnimationFrame(tick);
		});
		const check = () => { status.textContent = TP.isSolved(cube) ? 'Tersusun.' : 'Belum tersusun.'; };
		const run = async (seq, ms, record) => {
			if (busy) return; busy = true;
			for (const m of seq) { await move(m, reducedMotion ? 0 : ms); if (record) history.push(m); }
			busy = false; check();
		};
		const FACES = { R: [0, 1], L: [0, -1], U: [1, -1], D: [1, 1], F: [2, 1], B: [2, -1] };
		const pad = mk('div', 'cube-pad');
		for (const [f, [k, l]] of Object.entries(FACES)) for (const d of [1, -1]) {
			const b = mk('button', '', f + (d < 0 ? "'" : '')); b.type = 'button';
			b.addEventListener('click', () => run([[k, l, d]], 220, true));
			pad.append(b);
		}
		const act = mk('div', 'cube-act');
		const scr = mk('button', '', 'Acak'); scr.type = 'button';
		scr.addEventListener('click', () => {
			if (busy) return;
			history.length = 0;
			run(Array.from({ length: 18 }, () => [Math.floor(Math.random() * 3), [-1, 1][Math.floor(Math.random() * 2)], [1, -1][Math.floor(Math.random() * 2)]]), 90, true);
		});
		const sol = mk('button', '', 'Selesaikan'); sol.type = 'button';
		sol.addEventListener('click', async () => {
			if (busy) return;
			const seq = history.splice(0).reverse().map(([k, l, d]) => [k, l, -d]);
			await run(seq, 110, false);
		});
		act.append(scr, sol);
		let drag = null;
		wrap.addEventListener('pointerdown', (e) => {
			if (e.pointerType === 'mouse' && e.button !== 0) return;
			drag = [e.clientX, e.clientY];
			try { wrap.setPointerCapture(e.pointerId); } catch (_) {}
		});
		wrap.addEventListener('pointermove', (e) => {
			if (!drag) return;
			ry += (e.clientX - drag[0]) * 0.6;
			rx = Math.max(-80, Math.min(80, rx - (e.clientY - drag[1]) * 0.6));
			drag = [e.clientX, e.clientY];
			view3();
		});
		const endDrag = (e) => {
			drag = null;
			try { if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId); } catch (_) {}
		};
		wrap.addEventListener('pointerup', endDrag);
		wrap.addEventListener('pointercancel', endDrag);
		root.append(wrap, status, pad, act);
		draw(); view3(); check();
		return () => { busy = true; }; // a running animation stops committing moves when the view closes
	}

	// ---- game 3: mate in one ----
	function gameChess(root) {
		const GLYPH = { K: '\u2654', Q: '\u2655', R: '\u2656', B: '\u2657', N: '\u2658', P: '\u2659', k: '\u265A', q: '\u265B', r: '\u265C', b: '\u265D', n: '\u265E', p: '\u265F' };
		let n = 0, from = null, solved = false;
		let curPz = null;
		const info = mk('p', 'hub-status'), board = mk('div', 'board'), next = mk('button', 'hub-next', 'Posisi berikutnya');
		next.type = 'button'; next.hidden = true;
		const load = () => {
			curPz = TP.PUZZLES[n % TP.PUZZLES.length];
			from = null; solved = false; next.hidden = true;
			info.textContent = `Putih jalan. Skakmat dalam satu langkah. (${(n % TP.PUZZLES.length) + 1}/${TP.PUZZLES.length})`;
			const grid = {};
			curPz.fen.split('/').forEach((row, r) => { let f = 0; for (const ch of row) { if (/\d/.test(ch)) f += +ch; else grid['abcdefgh'[f++] + (8 - r)] = ch; } });
			board.replaceChildren();
			for (let r = 8; r >= 1; r--) for (const f of 'abcdefgh') {
				const sq = f + r, b = mk('button', 'sq ' + ((f.charCodeAt(0) + r) % 2 ? 'lt' : 'dk'), grid[sq] ? GLYPH[grid[sq]] : '');
				b.type = 'button'; b.dataset.sq = sq; b.setAttribute('aria-label', sq + (grid[sq] ? ' ' + grid[sq] : ''));
				if (grid[sq] && grid[sq] === grid[sq].toUpperCase()) b.classList.add('w');
				board.append(b);
			}
		};
		board.addEventListener('click', (e) => {
			const b = e.target.closest('.sq'); if (!b || solved || !curPz) return;
			const sq = b.dataset.sq;
			if (!from) {
				if (!b.textContent || !b.classList.contains('w')) return;
				from = sq; b.classList.add('sel'); return;
			}
			const mv = from + sq;
			if (from === sq) { from = null; b.classList.remove('sel'); return; }
			if (b.classList.contains('w')) {
				board.querySelector('.sel')?.classList.remove('sel');
				from = sq; b.classList.add('sel'); return;
			}
			if (curPz.sol.includes(mv)) {
				solved = true;
				const fromEl = board.querySelector('[data-sq="' + from + '"]');
				b.textContent = fromEl.textContent;
				b.className = 'sq ' + ((sq.charCodeAt(0) + parseInt(sq[1])) % 2 ? 'lt' : 'dk') + ' w ok';
				fromEl.textContent = '';
				fromEl.classList.remove('sel', 'w');
				from = null;
				info.textContent = 'Skakmat. Benar.'; next.hidden = false;
			} else {
				board.querySelector('.sel')?.classList.remove('sel');
				from = null;
				info.textContent = 'Bukan itu. ' + curPz.hint;
			}
		});
		next.addEventListener('click', () => { n++; load(); });
		root.append(info, board, next);
		load();
	}

	// ---- game 4: typing ----
	function gameTyping(root) {
		let text = '', t0 = 0, done = false;
		const target = mk('p', 'ty-text'), input = mk('input', 'ty-in'), stats = mk('p', 'hub-status'), again = mk('button', 'hub-next', 'Ulangi');
		input.type = 'text'; input.autocomplete = 'off'; input.autocapitalize = 'off'; input.spellcheck = false; input.setAttribute('aria-label', 'Ketik potongan kode di atas');
		again.type = 'button';
		const render = () => {
			target.replaceChildren(...[...text].map((ch, i) => mk('span', i >= input.value.length ? '' : input.value[i] === ch ? 'ok' : 'bad', ch)));
		};
		const reset = () => {
			const prev = text; do { text = TP.SNIPPETS[Math.floor(Math.random() * TP.SNIPPETS.length)]; } while (text === prev && TP.SNIPPETS.length > 1);
			input.value = ''; input.disabled = false; t0 = 0; done = false; again.hidden = true;
			stats.textContent = 'Mulai mengetik untuk menjalankan waktu.'; render(); input.focus();
		};
		input.addEventListener('input', () => {
			if (done) return;
			if (!t0) t0 = performance.now();
			render();
			if (input.value === text) {
				done = true; input.disabled = true; again.hidden = false;
				const sec = Math.max(0.5, (performance.now() - t0) / 1000);
				const min = sec / 60, wpm = Math.max(1, Math.round(text.length / 5 / min));
				const best = Number(localStorage.getItem(KEY + 'wpm-best')) || 0;
				if (wpm > best) localStorage.setItem(KEY + 'wpm-best', wpm);
				stats.textContent = `${wpm} WPM (${sec.toFixed(1)}s) · rekor ${Math.max(wpm, best)} WPM`;
			}
		});
		again.addEventListener('click', reset);
		root.append(target, input, stats, again);
		reset();
	}

})();
