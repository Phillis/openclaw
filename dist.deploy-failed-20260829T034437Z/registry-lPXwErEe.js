import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { v as getPluginRegistryForContext } from "./runtime-DMlUh4Cg.js";
//#region src/agents/harness/registry.ts
/**
* Registry for native agent harness implementations and lifecycle cleanup.
*/
const log = createSubsystemLogger("agents/harness");
const CODEX_NATIVE_COMPACTION_OWNER_ID = "codex";
function getAgentHarnesses() {
	return getPluginRegistryForContext()?.agentHarnesses ?? [];
}
/** Returns the harness plus plugin ownership metadata for registry diagnostics. */
function getRegisteredAgentHarness(id) {
	const registration = getAgentHarnesses().find((entry) => entry.harness.id === id.trim());
	return registration ? {
		harness: registration.harness,
		ownerPluginId: registration.pluginId === "core" ? void 0 : registration.pluginId
	} : void 0;
}
/** Resolves the registry-owned approval identity for the exact registered harness object. */
function resolveAgentHarnessOwnerPluginId(harness) {
	const registration = getRegisteredAgentHarness(harness.id);
	if (registration?.harness !== harness) throw new Error(`Agent harness ${harness.id} changed during owner resolution.`);
	return registration.ownerPluginId ?? "core";
}
/** Resolves the private Codex compaction bridge from exact registry-owned capability state. */
function resolveCodexAgentHarnessNativeCompaction(harness) {
	if (harness.id !== CODEX_NATIVE_COMPACTION_OWNER_ID) return;
	const registration = getAgentHarnesses().find((entry) => entry.harness.id === CODEX_NATIVE_COMPACTION_OWNER_ID);
	if (registration?.harness !== harness) throw new Error(`Agent harness ${harness.id} changed during native compaction resolution.`);
	return registration.pluginId === CODEX_NATIVE_COMPACTION_OWNER_ID ? registration.nativeCompaction : void 0;
}
/** Lists registered harness records for selection and lifecycle fan-out. */
function listRegisteredAgentHarnesses() {
	return getAgentHarnesses().map((entry) => ({
		harness: entry.harness,
		ownerPluginId: entry.pluginId === "core" ? void 0 : entry.pluginId
	}));
}
/** Calls each registered harness session-reset hook without letting one failure stop the fan-out. */
async function resetRegisteredAgentHarnessSessions(params) {
	await Promise.all(listRegisteredAgentHarnesses().map(async (entry) => {
		if (!entry.harness.reset) return;
		try {
			await entry.harness.reset(params);
		} catch (error) {
			log.warn(`${entry.harness.label} session reset hook failed`, {
				harnessId: entry.harness.id,
				error
			});
		}
	}));
}
/** Calls each registered harness dispose hook during registry shutdown or reload. */
async function disposeRegisteredAgentHarnesses() {
	await Promise.all(listRegisteredAgentHarnesses().map(async (entry) => {
		if (!entry.harness.dispose) return;
		try {
			await entry.harness.dispose();
		} catch (error) {
			log.warn(`${entry.harness.label} dispose hook failed`, {
				harnessId: entry.harness.id,
				error
			});
		}
	}));
}
//#endregion
export { resolveAgentHarnessOwnerPluginId as a, resetRegisteredAgentHarnessSessions as i, getRegisteredAgentHarness as n, resolveCodexAgentHarnessNativeCompaction as o, listRegisteredAgentHarnesses as r, disposeRegisteredAgentHarnesses as t };
