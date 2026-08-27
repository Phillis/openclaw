import { n as buildChannelKeyCandidates } from "./channel-config-D5i_K0JA.js";
import "./channel-outbound-0oFCMpw9.js";
import "./channel-inbound-BllqRtTK.js";
import "./media-local-roots-vtm-WEVG.js";
import "./allow-from-C78YI2I3.js";
import "./channel-targets-BC_CjDVw.js";
//#region extensions/matrix/src/matrix/monitor/rooms.ts
function readLegacyRoomAllowAlias(room) {
	const rawRoom = room;
	return typeof rawRoom?.allow === "boolean" ? rawRoom.allow : void 0;
}
function buildMatrixRoomScopeTree(rooms) {
	const scopes = {};
	for (const [key, room] of Object.entries(rooms ?? {})) scopes[key] = {
		requireMention: typeof room.autoReply === "boolean" ? !room.autoReply : room.requireMention,
		tools: room.tools
	};
	return { scopes };
}
function resolveMatrixRoomScopePath(params) {
	const key = buildChannelKeyCandidates(params.roomId, `room:${params.roomId}`, ...params.aliases).find((candidate) => Object.hasOwn(params.tree.scopes, candidate)) ?? (Object.hasOwn(params.tree.scopes, "*") ? "*" : void 0);
	return key ? [key] : [];
}
function resolveMatrixRoomConfig(params) {
	const rooms = params.rooms ?? {};
	const tree = { scopes: rooms };
	const [matchKey] = resolveMatrixRoomScopePath({
		...params,
		tree
	});
	const resolved = matchKey ? rooms[matchKey] : void 0;
	const legacyAllow = readLegacyRoomAllowAlias(resolved);
	return {
		allowed: resolved ? resolved.enabled !== false && legacyAllow !== false : false,
		allowlistConfigured: Object.keys(rooms).length > 0,
		config: resolved,
		matchKey,
		matchSource: resolved ? matchKey === "*" ? "wildcard" : "direct" : void 0
	};
}
//#endregion
export { resolveMatrixRoomConfig as n, resolveMatrixRoomScopePath as r, buildMatrixRoomScopeTree as t };
