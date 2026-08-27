import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Mr as validateSessionsDiffParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { E as loadGatewaySessionEntryReadOnly } from "./session-utils-row-pCr636Wc.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import "./session-utils-CCDcSRdK.js";
import { r as loadCheckoutDiff, t as applySessionDiffBaseline } from "./session-diff-BGY3GbqX.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
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
