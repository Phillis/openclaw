import { $t as loadSessionEntryReadOnly } from "./session-accessor-CVnxp3UM.js";
import { a as enqueueSystemEvent } from "./system-events-B0eLVp5j.js";
import { g as resolveFreshSessionTotalTokens } from "./restart-recovery-state-DDUaUjgV.js";
import { D as waitForEmbeddedAgentRunEnd, n as abortEmbeddedAgentRun, s as isEmbeddedAgentRunAbortableForCompaction } from "./runs-DdjJNEQM.js";
import { t as formatTokenCount } from "./token-format-D942KbWN.js";
import "./sessions-B_ifzq5W.js";
import { n as compactEmbeddedAgentSession } from "./embedded-agent--GrdaB8E.js";
import { n as incrementCompactionCount } from "./session-updates-CPQH46CI.js";
import { r as formatContextUsageShort } from "./status-message-C_r-HYL-.js";
import "./status-HdNOAD4v.js";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function isCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isCurrentSessionEntry, isEmbeddedAgentRunAbortableForCompaction, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
