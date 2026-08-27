import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CsnnOL14.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { n as isAvatarDataUrl, o as isWindowsAbsolutePath, r as isAvatarHttpUrl, t as hasAvatarUriScheme } from "./avatar-policy-palR8nY7.js";
import { i as resolveLocalAgentAvatarPath } from "./identity-avatar-file-Chg3kLVD.js";
import { n as resolveAgentIdentity } from "./identity-C85RCD_6.js";
import { i as loadAgentIdentityFromWorkspace } from "./identity-file-DD6W9JSd.js";
import path from "node:path";
//#region src/agents/identity-avatar.ts
/**
* Resolves public avatar sources for configured agent identities.
*/
const PUBLIC_AVATAR_SOURCE_MAX_CHARS = 256;
const PUBLIC_DATA_AVATAR_HEADER_MAX_CHARS = 64;
function resolveAvatarSource(cfg, agentId, opts) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const fromUiConfig = normalizeOptionalString(cfg.ui?.assistant?.avatar) ?? null;
	if (opts?.includeUiOverride) {
		if (normalizedAgentId === tryResolveLegacyCompatibilityAgentId(cfg) && fromUiConfig) return fromUiConfig;
	}
	const fromConfig = normalizeOptionalString(resolveAgentIdentity(cfg, normalizedAgentId)?.avatar) ?? null;
	if (fromConfig) return fromConfig;
	const fromIdentity = normalizeOptionalString(loadAgentIdentityFromWorkspace(resolveAgentWorkspaceDir(cfg, normalizedAgentId))?.avatar) ?? null;
	if (fromIdentity) return fromIdentity;
	return null;
}
function isSafeRelativeAvatarSource(source) {
	if (source.length > PUBLIC_AVATAR_SOURCE_MAX_CHARS || source.startsWith("~") || path.isAbsolute(source) || isWindowsAbsolutePath(source) || hasAvatarUriScheme(source) && !isWindowsAbsolutePath(source) || source.includes("\0")) return false;
	return source.replace(/\\/g, "/").split("/").every((part) => part !== "..");
}
/** Return a safe public description of the configured avatar source. */
function resolvePublicAgentAvatarSource(resolved) {
	const source = normalizeOptionalString(resolved.source) ?? null;
	if (!source) return;
	if (isAvatarDataUrl(source)) {
		const commaIndex = source.indexOf(",");
		return `${commaIndex > 0 ? source.slice(0, Math.min(commaIndex, PUBLIC_DATA_AVATAR_HEADER_MAX_CHARS)) : source.slice(0, PUBLIC_DATA_AVATAR_HEADER_MAX_CHARS)},...`;
	}
	if (isAvatarHttpUrl(source)) return "remote URL";
	return isSafeRelativeAvatarSource(source) ? source : void 0;
}
/** Resolve the effective avatar for an agent, including config and IDENTITY.md. */
function resolveAgentAvatar(cfg, agentId, opts) {
	const source = resolveAvatarSource(cfg, agentId, opts);
	if (!source) return {
		kind: "none",
		reason: "missing"
	};
	if (isAvatarHttpUrl(source)) return {
		kind: "remote",
		url: source,
		source
	};
	if (isAvatarDataUrl(source)) return {
		kind: "data",
		url: source,
		source
	};
	const resolved = resolveLocalAgentAvatarPath({
		raw: source,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	});
	if (!resolved.ok) return {
		kind: "none",
		reason: resolved.reason,
		source
	};
	return {
		kind: "local",
		filePath: resolved.value.filePath,
		source
	};
}
//#endregion
export { resolvePublicAgentAvatarSource as n, resolveAgentAvatar as t };
