import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-D7ikroCS.js";
import { t as isBunRuntime } from "./runtime-BefyhPWv.js";
//#region extensions/matrix/src/matrix/client-bootstrap.ts
const loadMatrixSharedClientRuntimeDeps = createLazyRuntimeModule(() => import("./client-Bz2Pa0mJ.js").then((clientModule) => ({
	acquireSharedMatrixClient: clientModule.acquireSharedMatrixClient,
	resolveMatrixAuthContext: clientModule.resolveMatrixAuthContext
})));
async function ensureResolvedClientReadiness(params) {
	if (params.readiness === "started") {
		if (params.lease) await params.lease.start();
		else await params.client.start();
		return;
	}
	if (params.readiness === "prepared" || !params.readiness && params.preparedByDefault) await params.client.prepareForOneOff();
}
function ensureMatrixNodeRuntime() {
	if (isBunRuntime()) throw new Error("Matrix support requires Node (bun runtime not supported)");
}
async function resolveRuntimeMatrixClientWithReadiness(opts) {
	ensureMatrixNodeRuntime();
	if (opts.client) {
		await ensureResolvedClientReadiness({
			client: opts.client,
			readiness: opts.readiness,
			preparedByDefault: false
		});
		return { client: opts.client };
	}
	if (!opts.cfg) throw new Error("Matrix runtime client requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const cfg = requireRuntimeConfig(opts.cfg, "Matrix runtime client");
	const { acquireSharedMatrixClient, resolveMatrixAuthContext } = await loadMatrixSharedClientRuntimeDeps();
	const authContext = resolveMatrixAuthContext({
		cfg,
		accountId: opts.accountId
	});
	const lease = await acquireSharedMatrixClient({
		cfg,
		timeoutMs: opts.timeoutMs,
		accountId: authContext.accountId,
		startClient: false,
		role: "transient"
	});
	try {
		await ensureResolvedClientReadiness({
			client: lease.client,
			lease,
			readiness: opts.readiness,
			preparedByDefault: true
		});
	} catch (err) {
		await lease.release({ mode: "stop" });
		throw err;
	}
	return {
		client: lease.client,
		lease
	};
}
async function withResolvedRuntimeMatrixClient(opts, run, stopMode = "stop") {
	const resolved = await resolveRuntimeMatrixClientWithReadiness(opts);
	try {
		return await run(resolved.client, resolved.lease?.abortSignal);
	} finally {
		await resolved.lease?.release({ mode: stopMode });
	}
}
//#endregion
export { withResolvedRuntimeMatrixClient as n, resolveRuntimeMatrixClientWithReadiness as t };
