

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.C1nVJTNk.js","_app/immutable/chunks/DUIbgsNx.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/BFmZl2zT.js"];
export const stylesheets = [];
export const fonts = [];
