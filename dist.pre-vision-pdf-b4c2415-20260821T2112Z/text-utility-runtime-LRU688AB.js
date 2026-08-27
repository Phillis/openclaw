import { r as withTimeout } from "./timing-8WD1In27.js";
import "./utils-DEqefz4f.js";
import "./fetch-timeout-ZPVdVVLc.js";
import "./with-timeout-qJ3MshnP.js";
//#region src/plugin-sdk/text-utility-runtime.ts
/** Run a channel probe with shared timeout, elapsed-time, and error-result handling. */
async function runChannelProbe(timeoutMs, run, onError) {
	const startedAt = Date.now();
	const elapsedMs = () => Date.now() - startedAt;
	const finish = (result) => ({
		...result,
		elapsedMs: result.elapsedMs ?? elapsedMs()
	});
	try {
		return finish(await withTimeout(run({
			startedAt,
			elapsedMs
		}), timeoutMs ?? 0));
	} catch (error) {
		if (!onError) throw error;
		return finish(onError(error));
	}
}
//#endregion
export { runChannelProbe as t };
