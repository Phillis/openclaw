import { n as resolveAcpSessionCwd } from "./session-identifiers-B5CDFQVW.js";
import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { $t as loadSessionEntryReadOnly } from "./session-accessor-CIiPoGwM.js";
import "./sessions-Bh837xaa.js";
import { l as persistAcpTurnTranscript } from "./attempt-execution-q6CLCwqf.js";
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
