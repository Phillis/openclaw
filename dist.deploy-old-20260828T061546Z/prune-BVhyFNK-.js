import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import "./config-B_0xOnKq.js";
import { _ as readBrowserRegistry, b as removeBrowserRegistryEntry, x as removeRegistryEntry, y as readRegistry } from "./docker-BiEQ_-7J.js";
import { M as dockerSandboxBackendManager } from "./ssh-backend-B38eKhNZ.js";
import { o as getSandboxBackendManager, r as stopCachedBrowserBridgesForContainer } from "./browser-bridges-DL4W3pOx.js";
//#region src/agents/sandbox/prune.ts
/**
* Sandbox registry pruning.
*
* Removes stale runtime containers and browser bridges on a best-effort schedule.
*/
let lastPruneAtMs = 0;
function shouldPruneSandboxEntry(cfg, now, entry) {
	const idleHours = cfg.prune.idleHours;
	const maxAgeDays = cfg.prune.maxAgeDays;
	if (idleHours === 0 && maxAgeDays === 0) return false;
	const nowMs = asDateTimestampMs(now) ?? 0;
	const lastUsedAtMs = asDateTimestampMs(entry.lastUsedAtMs) ?? 0;
	const createdAtMs = asDateTimestampMs(entry.createdAtMs) ?? 0;
	const idleMs = nowMs - lastUsedAtMs;
	const ageMs = nowMs - createdAtMs;
	return idleHours > 0 && idleMs > idleHours * 60 * 60 * 1e3 || maxAgeDays > 0 && ageMs > maxAgeDays * 24 * 60 * 60 * 1e3;
}
/** Removes expired registry entries and their backing runtime resources. */
async function pruneSandboxRegistryEntries(params) {
	const now = Date.now();
	if (params.cfg.prune.idleHours === 0 && params.cfg.prune.maxAgeDays === 0) return;
	const registry = await params.read();
	for (const entry of registry.entries) {
		if (!shouldPruneSandboxEntry(params.cfg, now, entry)) continue;
		try {
			await params.beforeRemove?.(entry);
			await params.removeRuntime(entry);
			await params.remove(entry.containerName);
		} catch (error) {
			const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
			defaultRuntime.error?.(`Sandbox prune failed to remove ${entry.containerName}: ${message ?? "unknown error"}`);
		}
	}
}
/** Prunes ordinary sandbox runtime containers from the configured backend manager. */
async function pruneSandboxContainers(cfg) {
	const config = getRuntimeConfig();
	await pruneSandboxRegistryEntries({
		cfg,
		read: readRegistry,
		remove: removeRegistryEntry,
		removeRuntime: async (entry) => {
			const backendId = entry.backendId ?? "docker";
			const manager = getSandboxBackendManager(backendId);
			if (!manager) throw new Error(`Sandbox backend "${backendId}" is unavailable; enable its plugin before removing this runtime.`);
			await manager.removeRuntime({
				entry,
				config
			});
		}
	});
}
/** Prunes browser bridge containers and closes matching in-process bridge servers. */
async function pruneSandboxBrowsers(cfg) {
	const config = getRuntimeConfig();
	await pruneSandboxRegistryEntries({
		cfg,
		read: readBrowserRegistry,
		remove: removeBrowserRegistryEntry,
		removeRuntime: async (entry) => {
			await dockerSandboxBackendManager.removeRuntime({
				entry: {
					...entry,
					backendId: "docker",
					runtimeLabel: entry.containerName,
					configLabelKind: "Image"
				},
				config
			});
		},
		beforeRemove: async (entry) => {
			await stopCachedBrowserBridgesForContainer(entry.containerName);
		}
	});
}
/** Runs sandbox pruning at most once per throttle window. */
async function maybePruneSandboxes(cfg) {
	const now = Date.now();
	if (now - lastPruneAtMs < 300 * 1e3) return;
	lastPruneAtMs = now;
	try {
		await pruneSandboxContainers(cfg);
		await pruneSandboxBrowsers(cfg);
	} catch (error) {
		const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
		defaultRuntime.error?.(`Sandbox prune failed: ${message ?? "unknown error"}`);
	}
}
//#endregion
export { maybePruneSandboxes };
