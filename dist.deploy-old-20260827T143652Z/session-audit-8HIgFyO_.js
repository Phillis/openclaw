import { t as SessionManager } from "./session-manager-CmaH_Zw4.js";
//#region src/gateway/server-methods/session-audit.ts
async function appendSessionAudit(params) {
	const identity = {
		agentId: params.target.agentId,
		sessionId: params.target.entry.sessionId,
		storePath: params.target.storePath
	};
	SessionManager.appendMessageToTranscript({
		...identity,
		sessionKey: params.target.sessionKey
	}, {
		role: "custom",
		customType: "openclaw.system-note",
		content: `System note: ${params.text}`,
		display: true,
		timestamp: params.now
	}, { config: params.cfg });
}
//#endregion
export { appendSessionAudit as t };
