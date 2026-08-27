import { d as parseBuzzTarget, r as resolveBuzzAccount, s as buildBuzzTarget } from "./types-D-Az035w.js";
//#region extensions/buzz/src/directory-config.ts
function applyQueryAndLimit(entries, params) {
	const query = params.query?.trim().toLowerCase() ?? "";
	const limit = typeof params.limit === "number" && params.limit > 0 ? Math.floor(params.limit) : void 0;
	const results = [];
	for (const entry of entries) {
		if (query && !entry.id.toLowerCase().includes(query) && !entry.name?.toLowerCase().includes(query)) continue;
		results.push(entry);
		if (limit !== void 0 && results.length >= limit) break;
	}
	return results;
}
async function listBuzzDirectoryPeersFromConfig(_params) {
	return [];
}
async function listBuzzDirectoryGroupsFromConfig(params) {
	const account = resolveBuzzAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return applyQueryAndLimit(Object.entries(account.config.groups ?? {}).filter(([, config]) => config.enabled !== false).map(([roomId]) => {
		const id = parseBuzzTarget(roomId);
		return {
			kind: "group",
			id: buildBuzzTarget(id),
			name: id,
			raw: { roomId: id }
		};
	}).toSorted((a, b) => a.id.localeCompare(b.id)), params);
}
//#endregion
export { listBuzzDirectoryPeersFromConfig as n, listBuzzDirectoryGroupsFromConfig as t };
