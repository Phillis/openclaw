import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Rr as validateSessionsDiffParams } from "./src-4dv5TpeQ.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-Dmx2MxPy.js";
import "./session-utils-uVsFjoXC.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { r as loadCheckoutDiff, t as applySessionDiffBaseline } from "./session-diff-p5Px6woS.js";
//#region src/gateway/server-methods/sessions-diff.ts
async function loadSessionDiff(params) {
	const empty = (unavailableReason) => ({
		sessionKey: params.sessionKey,
		files: [],
		additions: 0,
		deletions: 0,
		...unavailableReason ? { unavailableReason } : {}
	});
	const { cfg, agentId: loadedAgentId, entry, storePath, canonicalKey } = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
	if (!entry?.sessionId || !storePath) return empty("unknown_session");
	const agentId = normalizeAgentId(loadedAgentId ?? parseAgentSessionKey(canonicalKey)?.agentId ?? params.agentId ?? parseAgentSessionKey(params.sessionKey)?.agentId);
	const cwd = normalizeOptionalString(entry.spawnedCwd) ?? normalizeOptionalString(entry.spawnedWorkspaceDir) ?? normalizeOptionalString(resolveAgentWorkspaceDir(cfg, agentId));
	if (!cwd) return empty("unknown_session");
	if (params.scope === "commit") {
		if (!params.commit) throw new TypeError("commit scope requires a commit");
		return await loadCheckoutDiff({
			commit: params.commit,
			cwd,
			scope: "commit",
			sessionKey: params.sessionKey
		});
	}
	return await applySessionDiffBaseline({
		baseline: entry.sessionDiffBaseline,
		diff: await loadCheckoutDiff({
			cwd,
			scope: params.scope ?? "all",
			sessionKey: params.sessionKey
		}),
		sessionId: entry.sessionId
	});
}
const sessionsDiffHandlers = { "sessions.diff": async ({ params, respond, context }) => {
	if (!assertValidParams(params, validateSessionsDiffParams, "sessions.diff", respond)) return;
	if ((params.scope ?? "all") === "commit" !== (params.commit !== void 0)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid sessions.diff params: commit must be set if and only if scope is commit"));
		return;
	}
	const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	respond(true, await loadSessionDiff({
		...params,
		...requestedAgent.agentId ? { agentId: requestedAgent.agentId } : {}
	}));
} };
//#endregion
export { sessionsDiffHandlers };
