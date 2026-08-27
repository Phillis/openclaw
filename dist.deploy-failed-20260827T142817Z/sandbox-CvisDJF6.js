import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import "./config-CW-q_d35.js";
import "./constants-B8EtrfM_.js";
import "./tool-policy-qVmQ4P1r.js";
import "./config-l_EuSzmS.js";
import "./runtime-status-DwfYu5UM.js";
import "./sanitize-env-vars-Cs0Tdu9P.js";
import { _ as readBrowserRegistry, b as removeBrowserRegistryEntry, x as removeRegistryEntry, y as readRegistry } from "./docker-OaJzvWRJ.js";
import { n as resolveSandboxAgentId } from "./shared-CiBmkGZf.js";
import { j as dockerSandboxBackendManager } from "./ssh-backend-DVQ-nxjR.js";
import { o as getSandboxBackendManager, r as stopCachedBrowserBridgesForContainer } from "./browser-bridges-BTDT8AHg.js";
import "./context-C5jzJkKC.js";
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
	if (entry) await getSandboxBackendManager(entry.backendId ?? "docker")?.removeRuntime({
		entry,
		config,
		agentId: resolveSandboxAgentId(entry.sessionKey)
	});
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
