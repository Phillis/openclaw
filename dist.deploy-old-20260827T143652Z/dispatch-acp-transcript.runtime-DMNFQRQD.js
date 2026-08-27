import { n as resolveAcpSessionCwd } from "./session-identifiers-B5CDFQVW.js";
import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { $t as loadSessionEntryReadOnly } from "./session-accessor-Bi6bzKQE.js";
import "./sessions-D-jhKYGW.js";
import { l as persistAcpTurnTranscript } from "./attempt-execution-Dn4Qf-LV.js";
//#region src/auto-reply/reply/dispatch-acp-transcript.runtime.ts
async function persistAcpDispatchTranscript(params) {
	const promptText = params.promptText.trim();
	const finalText = params.finalText.trim();
	if (!promptText && !finalText) return;
	const sessionAgentId = resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: sessionAgentId });
	const sessionEntry = loadSessionEntryReadOnly({
		agentId: sessionAgentId,
		sessionKey: params.sessionKey,
		storePath
	});
	const sessionId = sessionEntry?.sessionId;
	if (!sessionId) throw new Error(`unknown ACP session key: ${params.sessionKey}`);
	await persistAcpTurnTranscript({
		body: promptText,
		transcriptBody: promptText,
		finalText,
		sessionId,
		sessionKey: params.sessionKey,
		sessionEntry,
		storePath,
		sessionAgentId,
		threadId: params.threadId,
		sessionCwd: resolveAcpSessionCwd(params.meta) ?? process.cwd(),
		config: params.cfg
	});
}
//#endregion
export { persistAcpDispatchTranscript };
