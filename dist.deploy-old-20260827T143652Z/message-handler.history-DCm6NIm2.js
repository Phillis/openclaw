import "./security-runtime-Bm9RUgAZ.js";
import { n as filterSupplementalContextItems } from "./context-visibility-C5CaKMWO.js";
//#region extensions/discord/src/monitor/message-handler.history.ts
function createDiscordHistorySenderProvenance(params) {
	return Object.freeze({
		id: params.sender.id,
		name: params.sender.name,
		tag: params.sender.tag,
		memberRoleIds: Object.freeze([...params.memberRoleIds])
	});
}
function filterDiscordHistoryEntriesForContext(params) {
	if (params.mode === "all") return {
		entries: [...params.entries],
		omitted: 0
	};
	const filtered = filterSupplementalContextItems({
		items: params.entries,
		mode: params.mode,
		kind: "history",
		isSenderAllowed: (entry) => Boolean(entry.senderProvenance) && params.isSenderAllowed(entry.senderProvenance)
	});
	return {
		entries: filtered.items,
		omitted: filtered.omitted
	};
}
//#endregion
export { filterDiscordHistoryEntriesForContext as n, createDiscordHistorySenderProvenance as t };
