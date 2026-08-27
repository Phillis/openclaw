import { p as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { o as resolveFreshSessionTotalTokens } from "./types-BEJRKmOU.js";
import "./session-accessor-B-FKZX9M.js";
import { a as enqueueSystemEvent } from "./system-events-BVZAS_Ok.js";
import { D as formatTokenCount } from "./sessions-CdrF1uzY.js";
import { A as waitForEmbeddedAgentRunEnd, c as isEmbeddedAgentRunAbortableForCompaction, n as abortEmbeddedAgentRun } from "./runs-DpT-JSmi.js";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-B-kid8Al.js";
import { n as incrementCompactionCount } from "./session-updates-DSmIoeOu.js";
import { r as formatContextUsageShort } from "./status-message-B1xN6f1K.js";
import "./status-CGfpopKj.js";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function isCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isCurrentSessionEntry, isEmbeddedAgentRunAbortableForCompaction, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
