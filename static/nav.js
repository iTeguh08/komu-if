// Shared room navigation. Add to any room: <script src="../../nav.js"></script>
// Floating pill (shadow DOM, so room CSS can't break it, and it can't break room CSS).
(() => {
	const root = new URL('.', document.currentScript.src); // site root, any base path
	const host = document.createElement('div');
	host.style.cssText = 'position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));z-index:2147483647';
	const s = host.attachShadow({ mode: 'open' });
	const svg = (d) =>
		`<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="${d}"/></svg>`;
	s.innerHTML = `
	<style>
		*{box-sizing:border-box;font:13px/1 system-ui,sans-serif}
		.p{display:flex;gap:2px;background:#0b0b0c;border:1px solid #222221;border-radius:99px;padding:3px}
		a,button{display:flex;align-items:center;gap:6px;color:#ecebe6;background:none;border:0;border-radius:99px;padding:9px 14px;cursor:pointer;text-decoration:none;transition:background .2s}
		a:hover,button:hover{background:#222221}
		a:focus-visible,button:focus-visible{outline:2px solid #ff5a36;outline-offset:1px}
		ul{display:none;position:absolute;bottom:calc(100% + 6px);left:0;width:224px;max-height:60vh;overflow:auto;margin:0;padding:4px;list-style:none;background:#0b0b0c;border:1px solid #222221;border-radius:2px}
		ul.o{display:block}
		li a{border-radius:2px;padding:10px 12px}
		@media (pointer:coarse){a,button{min-height:44px}}
		@media (prefers-reduced-motion:reduce){a,button{transition:none}}
	</style>
	<ul id="l"></ul>
	<div class="p"><a href="${root}">${svg('M10 3 5 8l5 5')}Gallery</a><button aria-expanded="false" aria-controls="l">Rooms ${svg('m4 10 4-4 4 4')}</button></div>`;
	const ul = s.querySelector('ul');
	const btn = s.querySelector('button');
	const toggle = (on) => btn.setAttribute('aria-expanded', ul.classList.toggle('o', on));
	btn.onclick = () => toggle();
	document.addEventListener('keydown', (e) => e.key === 'Escape' && toggle(false));
	fetch(new URL('rooms.json', root))
		.then((r) => r.json())
		.then((rs) => {
			ul.innerHTML = rs
				.map(
					(r) =>
						`<li><a href="${new URL(`rooms/${r.handle}/${r.entry ?? ''}`, root)}">${r.name}</a></li>`
				)
				.join('');
		})
		.catch(() => {});
	document.body.append(host);
})();
