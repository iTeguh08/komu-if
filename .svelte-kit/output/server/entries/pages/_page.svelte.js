import { n as rooms, t as roomUrl } from "../../chunks/rooms.js";
import { i as ensure_array_like, l as attr, n as attr_style, r as derived, s as stringify, t as attr_class, u as escape_html } from "../../chunks/server2.js";
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
				$$renderer.push(`<li class="reveal mb-4 break-inside-avoid"${attr_style("", { "--i": i })}><a${attr("href", roomUrl(r))} data-sveltekit-reload="" class="group relative flex w-full flex-col justify-end overflow-hidden rounded-xs border border-line bg-line/40 transition-colors duration-200 hover:border-(--glow) focus-visible:border-(--glow)"${attr_style("", {
					"--glow": r.accent ?? "var(--color-accent)",
					"aspect-ratio": r.thumb ? `${r.thumb.w} / ${r.thumb.h}` : "4 / 5"
				})}>`);
				if (r.thumb) $$renderer.push(`<!--[0--><img${attr("src", roomUrl(r, r.thumb.src))}${attr("alt", `${stringify(r.name)}'s room`)}${attr("width", r.thumb.w)}${attr("height", r.thumb.h)} loading="lazy" class="absolute inset-0 size-full object-cover transition duration-200 group-hover:brightness-50 group-focus-visible:brightness-50"/>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div${attr_class(`relative p-4 ${r.thumb ? "bg-linear-to-t from-wall/90 to-transparent pt-12 transition-opacity duration-200 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-visible:opacity-100" : ""}`)}><h2 class="font-display text-2xl leading-tight">${escape_html(r.name)}</h2> <p class="mt-1 text-sm text-mute">${escape_html(r.tagline)}</p></div></a></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		}
		$$renderer.push(`<!--]--></main>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map