import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import "./config-B2bSneS2.js";
import "./constants-CZykxrCI.js";
import "./tool-policy-DOd4V1E7.js";
import "./config-CfIhW1Vb.js";
import "./runtime-status-Jg1T3gN6.js";
import "./sanitize-env-vars-DrKKX-jQ.js";
import { _ as readBrowserRegistry, b as removeBrowserRegistryEntry, x as removeRegistryEntry, y as readRegistry } from "./docker-Cvt4DYNi.js";
import { n as resolveSandboxAgentId } from "./shared-BYKW6NFa.js";
import { M as dockerSandboxBackendManager } from "./ssh-backend-DEoOHhAa.js";
import { o as getSandboxBackendManager, r as stopCachedBrowserBridgesForContainer } from "./browser-bridges-DS9Ipg9y.js";
import "./context-kK2b0dAi.js";
//#region src/agents/sandbox/manage.ts
/**
* CLI-facing sandbox management helpers.
*
* Lists and removes registered runtime and browser containers using backend manager status.
*/
function toBrowserDockerRuntimeEntry(entry) {
	return {
		...entry,
		backendId: "docker",
		runtimeLabel: entry.containerName,
		configLabelKind: "BrowserImage"
	};
}
/** Lists registered sandbox containers with live backend status and config-label match state. */
async function listSandboxContainers() {
	const config = getRuntimeConfig();
	const registry = await readRegistry();
	const results = [];
	for (const entry of registry.entries) {
		const manager = getSandboxBackendManager(entry.backendId ?? "docker");
		if (!manager) {
			results.push({
				...entry,
				running: false,
				imageMatch: true
			});
			continue;
		}
		const agentId = resolveSandboxAgentId(entry.sessionKey);
		const runtime = await manager.describeRuntime({
			entry,
			config,
			agentId
		});
		results.push({
			...entry,
			image: runtime.actualConfigLabel ?? entry.image,
			running: runtime.running,
			imageMatch: runtime.configLabelMatch
		});
	}
	return results;
}
/** Lists registered browser sandbox containers with live Docker status. */
async function listSandboxBrowsers() {
	const config = getRuntimeConfig();
	const registry = await readBrowserRegistry();
	const results = [];
	for (const entry of registry.entries) {
		const agentId = resolveSandboxAgentId(entry.sessionKey);
		const runtime = await dockerSandboxBackendManager.describeRuntime({
			entry: toBrowserDockerRuntimeEntry(entry),
			config,
			agentId
		});
		results.push({
			...entry,
			image: runtime.actualConfigLabel ?? entry.image,
			running: runtime.running,
			imageMatch: runtime.configLabelMatch
		});
	}
	return results;
}
/** Removes one sandbox container from its backend and registry. */
async function removeSandboxContainer(containerName) {
	const config = getRuntimeConfig();
	const entry = (await readRegistry()).entries.find((item) => item.containerName === containerName);
	if (entry) {
		const backendId = entry.backendId ?? "docker";
		const manager = getSandboxBackendManager(backendId);
		if (!manager) throw new Error(`Sandbox backend "${backendId}" is unavailable; enable its plugin before removing this runtime.`);
		await manager.removeRuntime({
			entry,
			config,
			agentId: resolveSandboxAgentId(entry.sessionKey)
		});
	}
	await removeRegistryEntry(containerName);
}
/** Removes one browser sandbox container, registry entry, and any in-process bridge server. */
async function removeSandboxBrowserContainer(containerName) {
	const config = getRuntimeConfig();
	const entry = (await readBrowserRegistry()).entries.find((item) => item.containerName === containerName);
	await stopCachedBrowserBridgesForContainer(containerName);
	if (entry) await dockerSandboxBackendManager.removeRuntime({
		entry: toBrowserDockerRuntimeEntry(entry),
		config
	});
	await removeBrowserRegistryEntry(containerName);
}
//#endregion
export { removeSandboxContainer as i, listSandboxContainers as n, removeSandboxBrowserContainer as r, listSandboxBrowsers as t };
