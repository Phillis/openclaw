import { $t as loadSessionEntryReadOnly } from "./session-accessor-CIiPoGwM.js";
import { g as resolveFreshSessionTotalTokens } from "./restart-recovery-state-YPGO30LK.js";
import { a as enqueueSystemEvent } from "./system-events-DecgSLEt.js";
import { D as waitForEmbeddedAgentRunEnd, n as abortEmbeddedAgentRun, s as isEmbeddedAgentRunAbortableForCompaction } from "./runs-CQbSP9aq.js";
import { t as formatTokenCount } from "./token-format-D942KbWN.js";
import "./sessions-Bh837xaa.js";
import { n as compactEmbeddedAgentSession } from "./embedded-agent--FS7CHhs.js";
import { n as incrementCompactionCount } from "./session-updates-BD7iCj-f.js";
import { r as formatContextUsageShort } from "./status-message-rjGaJSQz.js";
import "./status-CJN57ROh.js";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function isCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isCurrentSessionEntry, isEmbeddedAgentRunAbortableForCompaction, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
