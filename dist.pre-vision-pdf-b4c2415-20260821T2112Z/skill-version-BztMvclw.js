import { o as sha256HexPrefixCore } from "./crypto-digest-PR8Utwzg.js";
//#region src/agents/sessions/source-info.ts
/** Converts package-manager path metadata into the session source-info shape. */
function createSourceInfo(path, metadata) {
	return {
		path,
		source: metadata.source,
		scope: metadata.scope,
		origin: metadata.origin,
		baseDir: metadata.baseDir
	};
}
/** Builds source metadata for generated or synthetic session entries. */
function createSyntheticSourceInfo(path, options) {
	return {
		path,
		source: options.source,
		scope: options.scope ?? "temporary",
		origin: options.origin ?? "top-level",
		baseDir: options.baseDir
	};
}
//#endregion
//#region src/skills/loading/skill-version.ts
function computeSkillPromptVersion(content) {
	return `sha256:${sha256HexPrefixCore(content, 16)}`;
}
//#endregion
export { createSourceInfo as n, createSyntheticSourceInfo as r, computeSkillPromptVersion as t };
