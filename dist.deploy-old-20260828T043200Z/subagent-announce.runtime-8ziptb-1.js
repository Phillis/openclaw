import "./config-B2bSneS2.js";
import "./call-Bwn2P4nz.js";
import { f as loadSessionEntry } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import "./session-accessor-B-FKZX9M.js";
import "./sessions-CdrF1uzY.js";
import "./runs-DpT-JSmi.js";
import "./server-plugin-in-process-dispatch-CbWBpml7.js";
import "./session-transcript-readers-CgCxlOAj.js";
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
