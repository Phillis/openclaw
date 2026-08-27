import { S as resolveMatrixRoomId } from "./send-DKkv-QOm.js";
import { n as withResolvedRuntimeMatrixClient } from "./client-bootstrap-BifXwXw6.js";
//#region extensions/matrix/src/matrix/actions/client.ts
async function withResolvedActionClient(opts, run, mode = "stop") {
	return await withResolvedRuntimeMatrixClient(opts, run, mode);
}
async function withStartedActionClient(opts, run) {
	return await withResolvedActionClient({
		...opts,
		readiness: "started"
	}, run, "persist");
}
async function withResolvedRoomAction(roomId, opts, run) {
	return await withResolvedActionClient(opts, async (client, abortSignal) => {
		return await run(client, await resolveMatrixRoomId(client, roomId), abortSignal);
	});
}
//#endregion
export { withResolvedRoomAction as n, withStartedActionClient as r, withResolvedActionClient as t };
