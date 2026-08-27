import { en as patchSessionEntryCore } from "./session-accessor-CVnxp3UM.js";
import { n as captureSessionDiffBaseline } from "./session-diff-BGY3GbqX.js";
//#region src/sessions/session-diff-baseline.ts
async function ensureSessionDiffBaseline(params) {
	if (!params.isNewSession || params.entry.execNode || !params.force && params.entry.createdVia !== "operator" || params.entry.sessionDiffBaseline?.sessionId === params.entry.sessionId) return params.entry;
	const baseline = await captureSessionDiffBaseline({
		cwd: params.cwd,
		sessionId: params.entry.sessionId
	});
	if (!baseline) return params.entry;
	return await patchSessionEntryCore({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (current) => {
		if (current.sessionId !== params.entry.sessionId || current.sessionDiffBaseline?.sessionId === current.sessionId) return null;
		return { sessionDiffBaseline: baseline };
	}, {
		preserveActivity: true,
		skipMaintenance: true
	}) ?? params.entry;
}
//#endregion
export { ensureSessionDiffBaseline as t };
