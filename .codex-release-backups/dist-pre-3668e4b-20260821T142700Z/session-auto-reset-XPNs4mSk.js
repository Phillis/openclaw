import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CsnnOL14.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { r as logVerbose } from "./globals-DD_xHyf6.js";
import { h as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-BNrqZgKC.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { i as hasInternalHookListeners, m as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks-KjqRukQs.js";
//#region src/hooks/session-auto-reset.ts
function isSessionAutoResetReason(reason) {
	return reason === "daily" || reason === "idle";
}
function hasSessionAutoResetListeners() {
	return hasInternalHookListeners("session", "auto-reset");
}
function emitSessionAutoResetHook(params) {
	if (!isSessionAutoResetReason(params.reason) || !hasSessionAutoResetListeners()) return;
	const marker = parseSqliteSessionFileMarker(params.sessionFile);
	const agentId = params.agentId ?? marker?.agentId ?? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const event = createInternalHookEvent("session", "auto-reset", params.sessionKey, {
		cfg: params.cfg,
		agentId,
		workspaceDir: params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId),
		storePath: params.storePath ?? marker?.storePath ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
		sessionEntry: {
			sessionId: params.sessionId,
			sessionFile: params.sessionFile
		},
		reason: params.reason,
		transcriptArchived: params.transcriptArchived,
		nextSessionId: params.nextSessionId,
		nextSessionKey: params.nextSessionKey
	});
	runWithGatewayIndependentRootWorkContinuation(() => triggerInternalHook(event)).catch((error) => {
		logVerbose(`session:auto-reset hook failed: ${String(error)}`);
	});
}
//#endregion
export { hasSessionAutoResetListeners as n, isSessionAutoResetReason as r, emitSessionAutoResetHook as t };
