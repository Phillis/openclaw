import "../../fs-safe-CmrQUApq.js";
import { t as appendRegularFile } from "../../regular-file-Dwz6p59y.js";
import { w as resolveStateDir } from "../../paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "../../errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "../../subsystem-a4KzJVZG.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/hooks/bundled/command-logger/handler.ts
/**
* Example hook handler: Log command lifecycle events to a file
*
* This handler demonstrates how to create a hook that logs emitted command events
* to a centralized log file for audit/debugging purposes.
*
* Enable this bundled hook with `openclaw hooks enable command-logger` or config:
*
* ```json
* {
*   "hooks": {
*     "internal": {
*       "entries": {
*         "command-logger": { "enabled": true }
*       }
*     }
*   }
* }
* ```
*/
const log = createSubsystemLogger("command-logger");
/**
* Log emitted command events to a file
*/
const logCommand = async (event) => {
	if (event.type !== "command") return;
	try {
		const stateDir = resolveStateDir(process.env, os.homedir);
		const logDir = path.join(stateDir, "logs");
		await fs.mkdir(logDir, { recursive: true });
		await appendRegularFile({
			filePath: path.join(logDir, "commands.log"),
			content: JSON.stringify({
				timestamp: event.timestamp.toISOString(),
				action: event.action,
				sessionKey: event.sessionKey,
				senderId: event.context.senderId ?? "unknown",
				source: event.context.commandSource ?? "unknown"
			}) + "\n",
			rejectSymlinkParents: true
		});
	} catch (err) {
		const message = formatErrorMessage(err);
		log.error(`Failed to log command: ${message}`);
	}
};
//#endregion
export { logCommand as default };
