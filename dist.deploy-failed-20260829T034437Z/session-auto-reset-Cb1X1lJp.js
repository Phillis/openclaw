import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { v as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-CTDt7IQ1.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { i as hasInternalHookListeners, n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks--fsrYuTN.js";
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
