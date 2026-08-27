import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import "./registry-DbgR8dhg.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-Dbglb2uR.js";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext, r as isAuthorizedTextSlashCommandTurn } from "./command-turn-context-CmPEYNmV.js";
import { i as stripTargetTopicSuffix, n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-Bxdln32l.js";
import { m as replyRunRegistry } from "./reply-run-registry-Ch9Ye6re.js";
import { g as resolveActiveEmbeddedRunSessionId } from "./run-state-CmAt4u6E.js";
import { m as resolveMainSessionAlias, p as resolveInternalSessionKey } from "./sessions-helpers-Cr-lJimL.js";
//#region src/auto-reply/reply/explicit-steer-routing.ts
function parseSteerMessage(raw) {
	const match = raw.trim().match(/^\/(?:steer|tell)(?:\s+([\s\S]*))?$/i);
	if (!match) return null;
	return (match[1] ?? "").trim();
}
function listSteerCandidateSessionKeys(targetSessionKey) {
	const candidates = [targetSessionKey];
	if (targetSessionKey.includes(":slash:")) candidates.push(targetSessionKey.replace(":slash:", ":direct:"), targetSessionKey.replace(":slash:", ":dm:"));
	return [...new Set(candidates)];
}
function resolveSteerSourceSessionKey(params) {
	const commandTarget = normalizeOptionalString(params.ctx.CommandTargetSessionKey);
	const commandSession = normalizeOptionalString(params.sessionKey ?? params.ctx.SessionKey);
	const raw = isNativeCommandTurn(resolveCommandTurnContext(params.ctx)) ? commandTarget || commandSession : commandSession || commandTarget;
	if (!raw) return;
	const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
	return resolveInternalSessionKey({
		key: raw,
		alias,
		mainKey
	});
}
/**
* Resolve an authorized explicit steer command to the exact session that owns
* an injectable active reply. This is intentionally read-only: callers decide
* whether to retarget session preparation or continue as an ordinary prompt.
*/
function resolveActiveExplicitSteerSessionKey(params) {
	const commandTurn = resolveCommandTurnContext(params.ctx);
	if (!isNativeCommandTurn(commandTurn) && !isAuthorizedTextSlashCommandTurn(commandTurn)) return;
	if (!parseSteerMessage(params.commandBody ?? commandTurn.body ?? normalizeOptionalString(params.ctx.CommandBody) ?? normalizeOptionalString(params.ctx.BodyForCommands) ?? normalizeOptionalString(params.ctx.Body) ?? "")) return;
	const sourceSessionKey = resolveSteerSourceSessionKey(params);
	if (!sourceSessionKey) return;
	for (const candidateKey of listSteerCandidateSessionKeys(sourceSessionKey)) if (replyRunRegistry.get(candidateKey) ? replyRunRegistry.resolveCurrentMessageInjectionTarget(candidateKey) !== void 0 : resolveActiveEmbeddedRunSessionId(candidateKey) !== void 0) return candidateKey;
}
//#endregion
//#region src/auto-reply/reply/group-id-simple.ts
/** Extracts a simple group/channel id from stable group-like source ids. */
function extractSimpleExplicitGroupId(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed) return;
	const parts = trimmed.split(":").filter(Boolean);
	if (parts.length >= 3 && (parts[1] === "group" || parts[1] === "channel")) return parts.slice(2).join(":").replace(/:topic:.*$/, "") || void 0;
	if (parts.length >= 2 && (parts[0] === "group" || parts[0] === "channel")) return parts.slice(1).join(":").replace(/:topic:.*$/, "") || void 0;
}
//#endregion
//#region src/auto-reply/reply/group-id.ts
/** Extracts group/channel ids from explicit message targets. */
function extractInferredGroupTargetId(params) {
	const normalized = params.messaging?.normalizeTarget?.(params.raw);
	const candidates = uniqueStrings([normalized, params.raw].filter((candidate) => Boolean(candidate)));
	for (const candidate of candidates) {
		const chatType = params.messaging?.inferTargetChatType?.({ to: candidate });
		if (chatType === "direct" || chatType == null) continue;
		const target = stripTargetTopicSuffix(stripOutboundTargetKindPrefix(stripTargetProviderPrefix(candidate, params.channelId), [
			"group",
			"channel",
			"conversation",
			"room",
			"thread"
		]), { allowNumericShorthand: params.messaging?.numericTopicShorthand === true });
		if (target) return target;
	}
}
/** Extracts a group/channel target id from explicit channel target syntax. */
function extractExplicitGroupId(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed) return;
	const simple = extractSimpleExplicitGroupId(trimmed);
	if (simple) return simple;
	const firstPart = trimmed.split(":").find(Boolean);
	const channelId = normalizeAnyChannelId(firstPart ?? "") ?? normalizeOptionalLowercaseString(firstPart);
	const messaging = channelId ? getLoadedChannelPluginForRead(channelId)?.messaging : void 0;
	if (!channelId) return;
	return extractInferredGroupTargetId({
		raw: trimmed,
		channelId,
		messaging
	});
}
//#endregion
//#region src/auto-reply/reply/elevated-unavailable.ts
function formatElevatedUnavailableMessage(params) {
	const lines = [];
	lines.push(`elevated is not available right now (runtime=${params.runtimeSandboxed ? "sandboxed" : "direct"}).`);
	if (params.failures.length > 0) lines.push(`Failing gates: ${params.failures.map((f) => `${f.gate} (${f.key})`).join(", ")}`);
	else lines.push("Failing gates: enabled (tools.elevated.enabled / agents.entries.*.tools.elevated.enabled), allowFrom (tools.elevated.allowFrom.<provider>).");
	lines.push("Fix-it keys:");
	lines.push("- tools.elevated.enabled");
	lines.push("- tools.elevated.allowFrom.<provider>");
	lines.push("- agents.entries.*.tools.elevated.enabled");
	lines.push("- agents.entries.*.tools.elevated.allowFrom.<provider>");
	if (params.sessionKey) lines.push(`See: ${formatCliCommand(`openclaw sandbox explain --session ${params.sessionKey}`)}`);
	return lines.join("\n");
}
//#endregion
export { resolveActiveExplicitSteerSessionKey as i, extractExplicitGroupId as n, parseSteerMessage as r, formatElevatedUnavailableMessage as t };
