import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, r as listAgentEntries } from "./agent-scope-config-BdXMWufB.js";
import "./legacy.default-agent-owner-D8ws5hED.js";
import { d as isRenderableAvatarImageDataUrl, o as isWindowsAbsolutePath, r as isAvatarHttpUrl, s as looksLikeAvatarPath, t as hasAvatarUriScheme, u as AVATAR_MAX_DATA_URL_CHARS } from "./avatar-policy-h0-yTt3d.js";
import { n as resolveAgentIdentity } from "./identity-hPPJEi06.js";
import { i as loadAgentIdentity } from "./agents.config-C5ikYlLh.js";
//#region src/gateway/assistant-identity.ts
const ASSISTANT_IDENTITY_LIMITS = {
	name: 50,
	emoji: 16
};
const DEFAULT_ASSISTANT_IDENTITY = {
	name: "Assistant",
	avatar: "A"
};
function normalizeIdentityValue(field, value) {
	const trimmed = normalizeOptionalString(value);
	return trimmed ? truncateUtf16Safe(trimmed, ASSISTANT_IDENTITY_LIMITS[field]) : void 0;
}
function isAvatarUrl(value) {
	return isAvatarHttpUrl(value) || isRenderableAvatarImageDataUrl(value);
}
function normalizeAvatarValue(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed || trimmed.length > AVATAR_MAX_DATA_URL_CHARS) return;
	if (isAvatarUrl(trimmed)) return trimmed;
	if (hasAvatarUriScheme(trimmed) && !isWindowsAbsolutePath(trimmed)) return;
	if (looksLikeAvatarPath(trimmed)) return trimmed;
	if (!/\s/.test(trimmed) && trimmed.length <= 4) return trimmed;
}
function normalizeEmojiValue(value) {
	if (!value) return;
	let hasNonAscii = false;
	for (let i = 0; i < value.length; i += 1) if (value.charCodeAt(i) > 127) {
		hasNonAscii = true;
		break;
	}
	if (!hasNonAscii) return;
	if (isAvatarUrl(value) || hasAvatarUriScheme(value) && !isWindowsAbsolutePath(value) || looksLikeAvatarPath(value)) return;
	return value;
}
/** Resolve the display name/avatar/emoji for an agent-facing assistant identity. */
function resolveAssistantIdentity(params) {
	const compatibilityAgentId = tryResolveLegacyCompatibilityAgentId(params.cfg);
	const agentId = normalizeAgentId(params.agentId ?? compatibilityAgentId ?? listAgentEntries(params.cfg)[0]?.id ?? "main");
	const isDefaultAgent = compatibilityAgentId !== void 0 && agentId === normalizeAgentId(compatibilityAgentId);
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
	const configAssistant = params.cfg.ui?.assistant;
	const agentIdentity = resolveAgentIdentity(params.cfg, agentId);
	const fileIdentity = workspaceDir ? loadAgentIdentity(workspaceDir) : null;
	const uiName = normalizeIdentityValue("name", configAssistant?.name);
	const agentName = normalizeIdentityValue("name", agentIdentity?.name);
	const fileName = normalizeIdentityValue("name", fileIdentity?.name);
	let resolvedName;
	if (isDefaultAgent) resolvedName = uiName ? [uiName, "config"] : agentName ? [agentName, "agent"] : fileName ? [fileName, "workspace"] : void 0;
	else resolvedName = agentName ? [agentName, "agent"] : fileName ? [fileName, "workspace"] : uiName ? [uiName, "config"] : void 0;
	const [name, nameSource] = resolvedName ?? [DEFAULT_ASSISTANT_IDENTITY.name, "default"];
	const uiAvatar = normalizeAvatarValue(configAssistant?.avatar);
	const agentAvatarCandidates = [
		normalizeAvatarValue(agentIdentity?.avatar),
		normalizeAvatarValue(agentIdentity?.emoji),
		normalizeAvatarValue(fileIdentity?.avatar),
		normalizeAvatarValue(fileIdentity?.emoji)
	];
	return {
		agentId,
		name,
		nameSource,
		avatar: (isDefaultAgent ? [uiAvatar, ...agentAvatarCandidates] : [...agentAvatarCandidates, uiAvatar]).find(Boolean) ?? DEFAULT_ASSISTANT_IDENTITY.avatar,
		emoji: [
			normalizeIdentityValue("emoji", agentIdentity?.emoji),
			normalizeIdentityValue("emoji", fileIdentity?.emoji),
			normalizeIdentityValue("emoji", agentIdentity?.avatar),
			normalizeIdentityValue("emoji", fileIdentity?.avatar)
		].map((candidate) => normalizeEmojiValue(candidate)).find(Boolean)
	};
}
//#endregion
export { resolveAssistantIdentity as n, DEFAULT_ASSISTANT_IDENTITY as t };
