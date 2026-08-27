import { $t as loadSessionEntryReadOnly } from "./session-accessor-Bi6bzKQE.js";
import { g as resolveFreshSessionTotalTokens } from "./restart-recovery-state-BoowPFT5.js";
import { a as enqueueSystemEvent } from "./system-events-kSFsVzdG.js";
import { D as waitForEmbeddedAgentRunEnd, n as abortEmbeddedAgentRun, s as isEmbeddedAgentRunAbortableForCompaction } from "./runs-CS8YarJf.js";
import { t as formatTokenCount } from "./token-format-D942KbWN.js";
import "./sessions-D-jhKYGW.js";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-Bcpo9BJw.js";
import { n as incrementCompactionCount } from "./session-updates-BO2OUmj2.js";
import { r as formatContextUsageShort } from "./status-message-eVbt1HMg.js";
import "./status-AumPy8B8.js";
//#region src/auto-reply/reply/commands-compact.runtime.ts
function isCurrentSessionEntry(params) {
	const current = loadSessionEntryReadOnly(params);
	return current?.sessionId === params.expected.sessionId && current.lifecycleRevision === params.expected.lifecycleRevision;
}
//#endregion
export { abortEmbeddedAgentRun, compactEmbeddedAgentSession, enqueueSystemEvent, formatContextUsageShort, formatTokenCount, incrementCompactionCount, isCurrentSessionEntry, isEmbeddedAgentRunAbortableForCompaction, resolveFreshSessionTotalTokens, waitForEmbeddedAgentRunEnd };
