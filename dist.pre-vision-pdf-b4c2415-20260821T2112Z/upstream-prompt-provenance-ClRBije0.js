//#region extensions/codex/src/app-server/upstream-prompt-provenance.ts
const UPSTREAM_USER_TEXT_META_KEY = "upstreamUserText";
const MIRROR_IDENTITY_META_KEY = "mirrorIdentity";
function attachCodexMirrorIdentity(message, identity) {
	const record = message;
	const existing = record["__openclaw"];
	const baseMeta = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...record,
		__openclaw: {
			...baseMeta,
			[MIRROR_IDENTITY_META_KEY]: identity
		}
	};
}
function readMirrorIdentity(message) {
	const meta = message["__openclaw"];
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
	const id = meta[MIRROR_IDENTITY_META_KEY];
	return typeof id === "string" && id ? id : void 0;
}
function attachUpstreamUserText(message, text) {
	const record = message;
	const existing = record["__openclaw"];
	const baseMeta = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...record,
		__openclaw: {
			...baseMeta,
			[UPSTREAM_USER_TEXT_META_KEY]: text
		}
	};
}
function readUpstreamUserText(message) {
	const meta = message?.["__openclaw"];
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
	const text = meta[UPSTREAM_USER_TEXT_META_KEY];
	return typeof text === "string" && text ? text : void 0;
}
//#endregion
export { readUpstreamUserText as i, attachUpstreamUserText as n, readMirrorIdentity as r, attachCodexMirrorIdentity as t };
