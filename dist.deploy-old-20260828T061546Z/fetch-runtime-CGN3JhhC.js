import "./proxy-env-TVpcGZHW.js";
import "./managed-proxy-undici-CXxQCcU1.js";
import "./undici-runtime-CWs3Ll9x.js";
import "./ssrf-arYIaOWE.js";
import "./fetch-guard-Dt4YqBT2.js";
import "./node-proxy-agent-Cppbz0uI.js";
import "./proxy-fetch-CIh_-v0I.js";
import "./fetch-jHqzOheu.js";
//#region src/plugin-sdk/fetch-runtime.ts
const NULL_BODY_STATUSES = /* @__PURE__ */ new Set([
	101,
	103,
	204,
	205,
	304
]);
function responseWithRelease(response, release) {
	let released = false;
	let canceling;
	const releaseOnce = async () => {
		if (released) return;
		released = true;
		await release();
	};
	if (!response.body || NULL_BODY_STATUSES.has(response.status)) {
		releaseOnce();
		return response;
	}
	const reader = response.body.getReader();
	const body = new ReadableStream({
		async pull(controller) {
			try {
				const next = await reader.read();
				if (canceling) {
					await canceling;
					await releaseOnce();
					return;
				}
				if (next.done) {
					controller.close();
					await releaseOnce();
					return;
				}
				controller.enqueue(next.value);
			} catch (error) {
				if (canceling) {
					await canceling;
					await releaseOnce();
					return;
				}
				await releaseOnce();
				throw error;
			}
		},
		async cancel(reason) {
			canceling = reader.cancel(reason).catch(() => void 0);
			await canceling;
			await releaseOnce();
		}
	});
	return new Response(body, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
//#endregion
export { responseWithRelease as t };
