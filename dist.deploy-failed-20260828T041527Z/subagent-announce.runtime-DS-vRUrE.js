import "./config-B_0xOnKq.js";
import "./call-BFtOrd_w.js";
import { f as loadSessionEntry } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import "./session-accessor-fcDZuc2H.js";
import "./sessions-BI8dPUCI.js";
import "./runs-eqaxGmoQ.js";
import "./server-plugin-in-process-dispatch-BdIxABXU.js";
import "./session-transcript-readers-fCOIrclF.js";
//#region src/agents/subagents/announce/subagent-announce.runtime.ts
/**
* Runtime dependency barrel for subagent announcement/output collection.
*
* Keeping these imports behind one module lets tests replace gateway/session
* IO without changing the announce logic itself.
*/
function readSubagentSessionEntry(storePath, sessionKey) {
	return loadSessionEntry({
		storePath,
		sessionKey
	});
}
//#endregion
export { readSubagentSessionEntry as t };
