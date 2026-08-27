import { l as clearLoadInstalledPluginIndexInstallRecordsCache } from "./installed-plugin-index-record-reader-DArXGVRI.js";
import { r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { n as withOpenClawStateLease, t as OpenClawStateLeaseError } from "./openclaw-state-lease-uU0VhaXS.js";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-lifecycle-lease.ts
const PLUGIN_LIFECYCLE_LEASE_SCOPE = "core:plugin-lifecycle";
const PLUGIN_LIFECYCLE_LEASE_KEY = "global";
const DEFAULT_PLUGIN_LIFECYCLE_LEASE_MS = 5 * 6e4;
const DEFAULT_PLUGIN_LIFECYCLE_WAIT_MS = 10 * 6e4;
const activePluginLifecycleLease = new AsyncLocalStorage();
function resolveLifecycleLeaseEnv(env) {
	const requested = env ?? process.env;
	if (!process.env.VITEST || requested.VITEST || requested.OPENCLAW_STATE_DIR) return requested;
	return {
		...requested,
		VITEST: process.env.VITEST,
		VITEST_WORKER_ID: process.env.VITEST_WORKER_ID,
		VITEST_POOL_ID: process.env.VITEST_POOL_ID
	};
}
/** Serialize plugin artifact, install-index, and config mutations across processes. */
async function withPluginLifecycleLease(options, run) {
	const active = activePluginLifecycleLease.getStore();
	if (active && options.env === void 0 && options.path === void 0 && options.database === void 0) {
		options.signal?.throwIfAborted();
		active.lease.assertOwned();
		return await run(active.lease);
	}
	const env = resolveLifecycleLeaseEnv(options.env);
	const databasePath = path.resolve(options.database?.path ?? options.path ?? resolveOpenClawStateSqlitePath(env));
	if (active) {
		if (active.databasePath !== databasePath) throw new OpenClawStateLeaseError("nested plugin lifecycle lease cannot switch the shared state database", { code: "OPENCLAW_STATE_LEASE_INVALID_INPUT" });
		options.signal?.throwIfAborted();
		active.lease.assertOwned();
		return await run(active.lease);
	}
	return await withOpenClawStateLease({
		scope: PLUGIN_LIFECYCLE_LEASE_SCOPE,
		key: PLUGIN_LIFECYCLE_LEASE_KEY,
		database: {
			scope: "shared",
			options: {
				env,
				...options.path ? { path: options.path } : {},
				...options.database ? { database: options.database } : {}
			}
		},
		leaseMs: options.leaseMs ?? DEFAULT_PLUGIN_LIFECYCLE_LEASE_MS,
		waitMs: options.waitMs ?? DEFAULT_PLUGIN_LIFECYCLE_WAIT_MS,
		...options.signal ? { signal: options.signal } : {},
		leaseLabel: "plugin lifecycle lease",
		operationLabel: "plugins.lifecycle.lease"
	}, async (lease) => {
		const pluginLease = {
			databasePath,
			signal: lease.signal,
			assertOwned: () => lease.assertOwned(),
			assertOwnedInTransaction: (database) => lease.assertOwnedInTransaction(database)
		};
		clearLoadInstalledPluginIndexInstallRecordsCache();
		return await activePluginLifecycleLease.run({
			databasePath,
			lease: pluginLease
		}, async () => await run(pluginLease));
	});
}
//#endregion
export { withPluginLifecycleLease as t };
