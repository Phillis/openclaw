import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import { n as isErrno } from "./errno-CkbDOfLk.js";
import "./errors-Ccx0R-_Z.js";
import net from "node:net";
//#region src/infra/ports-probe.ts
const PORT_PROBE_HOSTS = [
	"127.0.0.1",
	"0.0.0.0",
	"::1",
	"::"
];
const LOOPBACK_PORT_PROBE_HOSTS = ["127.0.0.1"];
async function tryListenOnPort(params) {
	if (params.signal?.aborted) throw params.signal.reason;
	const listenOptions = { port: params.port };
	if (params.host) listenOptions.host = params.host;
	if (typeof params.exclusive === "boolean") listenOptions.exclusive = params.exclusive;
	if (params.signal) listenOptions.signal = params.signal;
	return await new Promise((resolve, reject) => {
		const clearAbort = () => params.signal?.removeEventListener("abort", onAbort);
		const onAbort = () => {
			clearAbort();
			reject(toErrorObject(params.signal?.reason, "Port probe aborted"));
		};
		params.signal?.addEventListener("abort", onAbort, { once: true });
		const tester = net.createServer().once("error", (error) => {
			clearAbort();
			reject(error);
		}).once("listening", () => {
			const address = tester.address();
			if (!address || typeof address === "string") {
				tester.close(() => {
					clearAbort();
					reject(/* @__PURE__ */ new Error("expected TCP listener address"));
				});
				return;
			}
			tester.close(() => {
				clearAbort();
				resolve(params.port === 0 ? address.port : void 0);
			});
		}).listen(listenOptions);
	});
}
async function probePortOnHost(port, host) {
	try {
		await tryListenOnPort({
			port,
			host,
			exclusive: true
		});
		return "free";
	} catch (err) {
		if (isErrno(err) && err.code === "EADDRINUSE") return "busy";
		if (isErrno(err) && (err.code === "EADDRNOTAVAIL" || err.code === "EAFNOSUPPORT")) return "skip";
		return "unknown";
	}
}
/** Checks selected local addresses without resolving listener diagnostics. */
async function probePortUsage(port, probeHosts = PORT_PROBE_HOSTS) {
	let sawUnknown = false;
	for (const host of probeHosts) {
		const result = await probePortOnHost(port, host);
		if (result === "busy") return "busy";
		if (result === "unknown") sawUnknown = true;
	}
	return sawUnknown ? "unknown" : "free";
}
//#endregion
export { probePortUsage as n, tryListenOnPort as r, LOOPBACK_PORT_PROBE_HOSTS as t };
