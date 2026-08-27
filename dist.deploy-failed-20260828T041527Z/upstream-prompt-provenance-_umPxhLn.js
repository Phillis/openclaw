import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-C8jKEm3h.js";
//#region extensions/codex/src/app-server/upstream-prompt-provenance.ts
const UPSTREAM_USER_TEXT_META_KEY = "upstreamUserText";
const MIRROR_IDENTITY_META_KEY = "mirrorIdentity";
const CODEX_META_KEY = "__openclaw";
function attachCodexMirrorIdentity(message, identity) {
	const baseMeta = asOptionalRecord(CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0) ?? {};
	return {
		...message,
		__openclaw: {
			...baseMeta,
			[MIRROR_IDENTITY_META_KEY]: identity
		}
	};
}
function readMirrorIdentity(message) {
	const record = asOptionalRecord(CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0);
	if (!record) return;
	const id = record[MIRROR_IDENTITY_META_KEY];
	return typeof id === "string" && id ? id : void 0;
}
function attachUpstreamUserText(message, text) {
	const baseMeta = asOptionalRecord(CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0) ?? {};
	return {
		...message,
		__openclaw: {
			...baseMeta,
			[UPSTREAM_USER_TEXT_META_KEY]: text
		}
	};
}
function readUpstreamUserText(message) {
	const record = asOptionalRecord(message && CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0);
	if (!record) return;
	const text = record[UPSTREAM_USER_TEXT_META_KEY];
	return typeof text === "string" && text ? text : void 0;
}
//#endregion
export { readUpstreamUserText as i, attachUpstreamUserText as n, readMirrorIdentity as r, attachCodexMirrorIdentity as t };
