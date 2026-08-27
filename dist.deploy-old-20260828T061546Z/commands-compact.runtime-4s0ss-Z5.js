import { p as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { a as enqueueSystemEvent } from "./system-events-BVZAS_Ok.js";
import { o as resolveFreshSessionTotalTokens } from "./types-gVK8DqPC.js";
import "./session-accessor-fcDZuc2H.js";
import { D as formatTokenCount } from "./sessions-BI8dPUCI.js";
import { A as waitForEmbeddedAgentRunEnd, c as isEmbeddedAgentRunAbortableForCompaction, n as abortEmbeddedAgentRun } from "./runs-eqaxGmoQ.js";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-uA4hl59E.js";
import { n as incrementCompactionCount } from "./session-updates-VgqA-Oq9.js";
import { r as formatContextUsageShort } from "./status-message-BSgFXrGc.js";
import "./status-CMUycIa3.js";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function isCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isCurrentSessionEntry, isEmbeddedAgentRunAbortableForCompaction, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
