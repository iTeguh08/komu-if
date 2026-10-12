import { n as rooms } from "../../../chunks/rooms.js";
import { json } from "@sveltejs/kit";
//#region src/routes/rooms.json/+server.ts
var prerender = true;
var GET = () => json(rooms.map(({ handle, name, entry }) => ({
	handle,
	name,
	entry
})));
//#endregion
export { GET, prerender };

//# sourceMappingURL=_server.ts.js.map