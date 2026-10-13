import { bt as asset, xt as resolve } from "../../chunks/internal.js";
import { n as rooms, t as roomUrl } from "../../chunks/rooms.js";
import { a as head, i as ensure_array_like, l as attr, t as attr_class, u as escape_html } from "../../chunks/server2.js";
//#region src/lib/assets/favicon.svg
var favicon_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='107'%20height='128'%20viewBox='0%200%20107%20128'%3e%3ctitle%3esvelte-logo%3c/title%3e%3cpath%20d='M94.157%2022.819c-10.4-14.885-30.94-19.297-45.792-9.835L22.282%2029.608A29.92%2029.92%200%200%200%208.764%2049.65a31.5%2031.5%200%200%200%203.108%2020.231%2030%2030%200%200%200-4.477%2011.183%2031.9%2031.9%200%200%200%205.448%2024.116c10.402%2014.887%2030.942%2019.297%2045.791%209.835l26.083-16.624A29.92%2029.92%200%200%200%2098.235%2078.35a31.53%2031.53%200%200%200-3.105-20.232%2030%2030%200%200%200%204.474-11.182%2031.88%2031.88%200%200%200-5.447-24.116'%20style='fill:%23ff3e00'/%3e%3cpath%20d='M45.817%20106.582a20.72%2020.72%200%200%201-22.237-8.243%2019.17%2019.17%200%200%201-3.277-14.503%2018%2018%200%200%201%20.624-2.435l.49-1.498%201.337.981a33.6%2033.6%200%200%200%2010.203%205.098l.97.294-.09.968a5.85%205.85%200%200%200%201.052%203.878%206.24%206.24%200%200%200%206.695%202.485%205.8%205.8%200%200%200%201.603-.704L69.27%2076.28a5.43%205.43%200%200%200%202.45-3.631%205.8%205.8%200%200%200-.987-4.371%206.24%206.24%200%200%200-6.698-2.487%205.7%205.7%200%200%200-1.6.704l-9.953%206.345a19%2019%200%200%201-5.296%202.326%2020.72%2020.72%200%200%201-22.237-8.243%2019.17%2019.17%200%200%201-3.277-14.502%2017.99%2017.99%200%200%201%208.13-12.052l26.081-16.623a19%2019%200%200%201%205.3-2.329%2020.72%2020.72%200%200%201%2022.237%208.243%2019.17%2019.17%200%200%201%203.277%2014.503%2018%2018%200%200%201-.624%202.435l-.49%201.498-1.337-.98a33.6%2033.6%200%200%200-10.203-5.1l-.97-.294.09-.968a5.86%205.86%200%200%200-1.052-3.878%206.24%206.24%200%200%200-6.696-2.485%205.8%205.8%200%200%200-1.602.704L37.73%2051.72a5.42%205.42%200%200%200-2.449%203.63%205.79%205.79%200%200%200%20.986%204.372%206.24%206.24%200%200%200%206.698%202.486%205.8%205.8%200%200%200%201.602-.704l9.952-6.342a19%2019%200%200%201%205.295-2.328%2020.72%2020.72%200%200%201%2022.237%208.242%2019.17%2019.17%200%200%201%203.277%2014.503%2018%2018%200%200%201-8.13%2012.053l-26.081%2016.622a19%2019%200%200%201-5.3%202.328'%20style='fill:%23fff'/%3e%3c/svg%3e";
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		let open = false;
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>komu-if · IF B Pagi 14</title>`);
			});
			$$renderer.push(`<link rel="icon"${attr("href", favicon_default)}/> <meta name="description" content="One class, every room different. IF B Pagi, angkatan 14."/>`);
		});
		$$renderer.push(`<header class="border-b border-line"><nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4"><a${attr("href", resolve("/"))} class="font-display text-2xl leading-none">komu-if</a> <div class="flex items-center gap-6 text-sm text-mute"><span class="hidden sm:block">IF B Pagi · Angkatan 14</span> <details class="relative"${attr("open", open, true)}><summary class="flex cursor-pointer list-none items-center gap-1.5 text-ink [&amp;::-webkit-details-marker]:hidden">Rooms <span class="font-mono text-xs text-mute tabular-nums">${escape_html(rooms.length)}</span> <svg viewBox="0 0 16 16"${attr_class(`size-3.5 transition-transform duration-200 `)} fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 6 4 4 4-4"></path></svg></summary> <ul class="absolute right-0 z-10 mt-3 max-h-80 w-60 overflow-y-auto rounded-xs border border-line bg-wall p-1">`);
		const each_array = ensure_array_like(rooms);
		if (each_array.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let r = each_array[$$index];
				$$renderer.push(`<li><a${attr("href", roomUrl(r))} data-sveltekit-reload="" class="block rounded-xs px-3 py-2 text-ink hover:bg-line">${escape_html(r.name)}</a></li>`);
			}
		} else $$renderer.push(`<!--[!--><li class="px-3 py-2">No rooms yet.</li>`);
		$$renderer.push(`<!--]--></ul></details></div></nav></header> `);
		children($$renderer);
		$$renderer.push(`<!----> <footer class="mt-16 border-t border-line"><figure class="relative w-full aspect-[1200/404] overflow-hidden bg-wall"><img${attr("src", asset("footer.webp"))} alt="Teman-teman IF B Pagi Angkatan 14 berfoto di kelas" width="1200" height="404" loading="lazy" class="absolute inset-0 size-full object-cover"/> <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_90%,rgb(255_170_70_/_0.22),transparent_62%),radial-gradient(ellipse_at_82%_70%,rgb(120_100_200_/_0.15),transparent_66%),linear-gradient(rgb(8_6_12_/_0.45),rgb(8_6_12_/_0.85))]" aria-hidden="true"></div> <figcaption class="absolute inset-x-0 bottom-0 p-6 font-display text-2xl text-ink sm:text-3xl md:p-8">IF B Pagi · Angkatan 14</figcaption></figure> <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-mute"><a href="https://github.com/iTeguh08/komu-if" class="hover:text-ink">Source on GitHub</a> <a href="https://github.com/iTeguh08/komu-if/blob/master/docs/RULES.md" class="text-ink underline decoration-line underline-offset-4 hover:decoration-accent">Add your room</a></div></footer>`);
	});
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map