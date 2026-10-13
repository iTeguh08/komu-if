import { n as rooms, t as roomUrl } from "../../chunks/rooms.js";
import { i as ensure_array_like, l as attr, n as attr_style, r as derived, s as stringify, t as attr_class, u as escape_html } from "../../chunks/server2.js";
//#region src/lib/RoomDoorCard.svelte
function RoomDoorCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { room } = $$props;
		const glow = derived(() => room.accent ?? "var(--color-accent)");
		$$renderer.push(`<a${attr("href", roomUrl(room))} data-sveltekit-reload=""${attr("aria-label", `Pintu ${stringify(room.door_code)}, ${stringify(room.name)}`)} class="door-card group relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-xs border border-line bg-wall transition-[border-color,box-shadow] duration-200 hover:border-(--glow) hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--glow)_35%,transparent)] focus-visible:border-(--glow) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"${attr_style("", { "--glow": glow() })}><div class="relative isolate min-h-0 flex-[1.2] overflow-hidden px-5 pt-5 pb-3"><svg class="pointer-events-none absolute inset-x-5 top-4 bottom-5 text-line transition-colors duration-200 group-hover:text-(--glow)" viewBox="0 0 100 118" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="1" y="1" width="98" height="116" stroke="currentColor" stroke-width="1.25"></rect><rect x="7" y="7" width="86" height="104" stroke="currentColor" stroke-width="0.75" opacity="0.55"></rect><path d="M7 7 H93 M7 7 Q50 20 93 7" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"></path><line x1="50" y1="12" x2="50" y2="108" stroke="currentColor" stroke-width="1.25"></line><line x1="7" y1="111" x2="93" y2="111" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></line><circle cx="11" cy="26" r="1.1" fill="currentColor" opacity="0.7"></circle><circle cx="11" cy="48" r="1.1" fill="currentColor" opacity="0.7"></circle><circle cx="11" cy="70" r="1.1" fill="currentColor" opacity="0.7"></circle><circle cx="89" cy="26" r="1.1" fill="currentColor" opacity="0.7"></circle><circle cx="89" cy="48" r="1.1" fill="currentColor" opacity="0.7"></circle><circle cx="89" cy="70" r="1.1" fill="currentColor" opacity="0.7"></circle><rect x="38" y="96" width="24" height="8" stroke="currentColor" stroke-width="0.75" opacity="0.45"></rect></svg> <span class="relative z-10 flex h-full items-center justify-center font-mono text-5xl tabular-nums tracking-tight text-ink drop-shadow-[0_2px_8px_rgb(0_0_0/0.65)] transition-colors duration-200 group-hover:text-(--glow) sm:text-6xl">${escape_html(room.door_code)}</span></div> <div class="relative z-20 shrink-0 border-t-2 border-line bg-wall px-4 py-4 shadow-[0_-12px_28px_rgb(0_0_0/0.55)]"><h2 class="font-display text-xl leading-snug text-ink sm:text-2xl">${escape_html(room.name)}</h2> <p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/75">${escape_html(room.tagline)}</p></div></a>`);
	});
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const tags = [...new Set(rooms.flatMap((r) => r.tags ?? []))].sort();
		let active = null;
		const shown = derived(() => rooms);
		$$renderer.push(`<main class="mx-auto max-w-7xl px-5 py-8"><h1 class="sr-only">Class rooms</h1> `);
		if (tags.length) {
			$$renderer.push(`<!--[0--><div class="mb-8 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by tag"><!--[-->`);
			const each_array = ensure_array_like([null, ...tags]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let t = each_array[$$index];
				$$renderer.push(`<button type="button"${attr("aria-pressed", active === t)}${attr_class(`shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors duration-200 ${active === t ? "border-accent bg-accent text-wall" : "border-line text-mute hover:text-ink"}`)}>${escape_html(t ?? "all")}</button>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (rooms.length === 0) $$renderer.push(`<!--[0--><p class="py-24 font-display text-3xl text-mute">No rooms yet. Be the first.</p>`);
		else if (shown().length === 0) $$renderer.push(`<!--[1--><p class="py-24 text-mute">Nothing tagged <span class="font-mono text-ink">${escape_html(active)}</span>. <button class="text-ink underline underline-offset-4">Clear filter</button></p>`);
		else {
			$$renderer.push(`<!--[-1--><ul class="columns-2 gap-4 md:columns-3 xl:columns-4"><!--[-->`);
			const each_array_1 = ensure_array_like(shown());
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let r = each_array_1[i];
				$$renderer.push(`<li class="reveal mb-4 break-inside-avoid"${attr_style("", { "--i": i })}>`);
				RoomDoorCard($$renderer, { room: r });
				$$renderer.push(`<!----></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		}
		$$renderer.push(`<!--]--></main>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map