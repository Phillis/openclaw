import { t as filterStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { E as resolveDirectPluginRegistrationOwner, w as requireActivePluginRegistry } from "./runtime-B2KAtS3O.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/memory-state.ts
/** Registry state for plugin memory runtimes, prompt supplements, and flush planning. */
const log = createSubsystemLogger("plugins/memory-state");
function resolveMemoryCapabilityRegistration(registrations) {
	let effective;
	for (const registration of registrations) {
		const existing = effective?.capability;
		const preserveExisting = existing && Boolean(registration.capability.publicArtifacts) && !registration.capability.promptBuilder && !registration.capability.flushPlanResolver && !registration.capability.runtime;
		effective = {
			pluginId: registration.pluginId,
			capability: {
				...preserveExisting ? existing : {},
				...registration.capability
			}
		};
	}
	return effective;
}
const getMemoryCapability = () => resolveMemoryCapabilityRegistration(requireActivePluginRegistry().memoryCapabilities);
const preparedMemoryPromptSections = /* @__PURE__ */ new WeakSet();
const activePreparedMemoryPromptSection = new AsyncLocalStorage();
function registerMemoryCorpusSupplement(requestedPluginId, supplement) {
	const pluginId = resolveDirectPluginRegistrationOwner(requestedPluginId) ?? requestedPluginId;
	const registry = requireActivePluginRegistry();
	registry.memoryCorpusSupplements = registry.memoryCorpusSupplements.filter((registration) => registration.pluginId !== pluginId).concat({
		pluginId,
		supplement
	});
}
function registerMemoryCapability(requestedPluginId, capability) {
	const pluginId = resolveDirectPluginRegistrationOwner(requestedPluginId) ?? requestedPluginId;
	requireActivePluginRegistry().memoryCapabilities.push({
		pluginId,
		capability
	});
}
function getMemoryCapabilityRegistration() {
	const capability = getMemoryCapability();
	return capability ? {
		pluginId: capability.pluginId,
		capability: { ...capability.capability }
	} : void 0;
}
function listMemoryCorpusSupplements() {
	return [...requireActivePluginRegistry().memoryCorpusSupplements];
}
function registerMemoryPromptSupplement(requestedPluginId, builder) {
	const pluginId = resolveDirectPluginRegistrationOwner(requestedPluginId) ?? requestedPluginId;
	const registry = requireActivePluginRegistry();
	registry.memoryPromptSupplements = registry.memoryPromptSupplements.filter((registration) => registration.pluginId !== pluginId).concat({
		pluginId,
		builder
	});
}
function registerMemoryPromptPreparation(requestedPluginId, prepare) {
	const pluginId = resolveDirectPluginRegistrationOwner(requestedPluginId) ?? requestedPluginId;
	const registry = requireActivePluginRegistry();
	registry.memoryPromptPreparations = registry.memoryPromptPreparations.filter((registration) => registration.pluginId !== pluginId).concat({
		pluginId,
		prepare
	});
}
function buildSynchronousMemoryPromptSection(params) {
	const registry = requireActivePluginRegistry();
	return {
		primary: filterStringEntries(resolveMemoryCapabilityRegistration(registry.memoryCapabilities)?.capability.promptBuilder?.(params) ?? []),
		supplements: registry.memoryPromptSupplements.toSorted((left, right) => left.pluginId.localeCompare(right.pluginId)).map((registration) => ({
			pluginId: registration.pluginId,
			lines: filterStringEntries(registration.builder(params))
		}))
	};
}
function cloneMemoryPromptSectionParams(params) {
	return {
		availableTools: new Set(params.availableTools),
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed
	};
}
function snapshotMemoryPromptContext(params) {
	return Object.freeze({
		availableTools: Object.freeze([...params.availableTools].toSorted()),
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed === true
	});
}
function preparedMemoryPromptContextMatches(prepared, params) {
	const current = snapshotMemoryPromptContext(params);
	return prepared.context.citationsMode === current.citationsMode && prepared.context.agentId === current.agentId && prepared.context.agentSessionKey === current.agentSessionKey && prepared.context.sandboxed === current.sandboxed && prepared.context.availableTools.length === current.availableTools.length && prepared.context.availableTools.every((tool, index) => tool === current.availableTools[index]);
}
/** Prepare one immutable memory prompt snapshot for a run. */
async function prepareMemoryPromptSection(params) {
	const runParams = cloneMemoryPromptSectionParams(params);
	const context = snapshotMemoryPromptContext(runParams);
	const synchronous = buildSynchronousMemoryPromptSection(cloneMemoryPromptSectionParams(runParams));
	const preparationRegistrations = [...requireActivePluginRegistry().memoryPromptPreparations];
	const preparedSupplements = await Promise.all(preparationRegistrations.map(async (registration) => ({
		pluginId: registration.pluginId,
		lines: filterStringEntries(await registration.prepare(cloneMemoryPromptSectionParams(runParams)))
	})));
	const lines = Object.freeze([...synchronous.primary, ...[...synchronous.supplements, ...preparedSupplements].toSorted((left, right) => left.pluginId.localeCompare(right.pluginId)).flatMap((registration) => registration.lines)]);
	const prepared = Object.freeze({
		context,
		lines
	});
	preparedMemoryPromptSections.add(prepared);
	return prepared;
}
/** Keep async preparation run-scoped while a context engine assembles synchronously. */
async function runWithPreparedMemoryPromptSection(params, run) {
	const prepared = await prepareMemoryPromptSection(params);
	return activePreparedMemoryPromptSection.run(prepared, run);
}
function getActivePreparedMemoryPromptSection() {
	return activePreparedMemoryPromptSection.getStore();
}
function buildMemoryPromptSection(params, prepared) {
	if (prepared) {
		if (!preparedMemoryPromptSections.has(prepared) || !preparedMemoryPromptContextMatches(prepared, params)) throw new Error("prepared memory prompt section does not match the current run");
		return [...prepared.lines];
	}
	const synchronous = buildSynchronousMemoryPromptSection(params);
	return [...synchronous.primary, ...synchronous.supplements.flatMap((entry) => entry.lines)];
}
function listMemoryPromptSupplements() {
	return [...requireActivePluginRegistry().memoryPromptSupplements];
}
function listMemoryPromptPreparations() {
	return [...requireActivePluginRegistry().memoryPromptPreparations];
}
function resolveMemoryFlushPlan(params) {
	return getMemoryCapability()?.capability.flushPlanResolver?.(params) ?? null;
}
function getMemoryRuntime() {
	return getMemoryCapability()?.capability.runtime;
}
let standaloneMemoryManagerActive = false;
function setStandaloneMemoryManagerActive(active) {
	standaloneMemoryManagerActive = active;
}
function hasMemoryRuntime() {
	return standaloneMemoryManagerActive || getMemoryRuntime() !== void 0;
}
function cloneMemoryPublicArtifact(artifact) {
	const agentIds = Array.isArray(artifact.agentIds) ? artifact.agentIds : [];
	return {
		...artifact,
		agentIds: [...agentIds]
	};
}
function isValidMemoryPublicArtifact(artifact) {
	return typeof artifact?.kind === "string" && typeof artifact.workspaceDir === "string" && typeof artifact.relativePath === "string" && typeof artifact.absolutePath === "string" && typeof artifact.contentType === "string";
}
async function listActiveMemoryPublicArtifacts(params) {
	const capability = getMemoryCapability();
	const pluginId = capability?.pluginId;
	const listed = await capability?.capability.publicArtifacts?.listArtifacts(params) ?? [];
	if (!Array.isArray(listed)) {
		log.warn(`ignoring public memory artifacts from plugin "${pluginId}": not an array`);
		return [];
	}
	const artifacts = listed.filter(isValidMemoryPublicArtifact);
	if (artifacts.length < listed.length) log.warn(`ignoring ${listed.length - artifacts.length} malformed public memory artifact(s) from plugin "${pluginId}": artifacts must include string kind, workspaceDir, relativePath, absolutePath, and contentType`);
	return artifacts.map(cloneMemoryPublicArtifact).toSorted((left, right) => {
		const workspaceOrder = left.workspaceDir.localeCompare(right.workspaceDir);
		if (workspaceOrder !== 0) return workspaceOrder;
		const relativePathOrder = left.relativePath.localeCompare(right.relativePath);
		if (relativePathOrder !== 0) return relativePathOrder;
		const kindOrder = left.kind.localeCompare(right.kind);
		if (kindOrder !== 0) return kindOrder;
		const contentTypeOrder = left.contentType.localeCompare(right.contentType);
		if (contentTypeOrder !== 0) return contentTypeOrder;
		const agentOrder = left.agentIds.join("\0").localeCompare(right.agentIds.join("\0"));
		if (agentOrder !== 0) return agentOrder;
		return left.absolutePath.localeCompare(right.absolutePath);
	});
}
function clearMemoryPluginState() {
	const registry = requireActivePluginRegistry();
	registry.memoryCapabilities = [];
	registry.memoryCorpusSupplements = [];
	registry.memoryPromptPreparations = [];
	registry.memoryPromptSupplements = [];
}
//#endregion
export { resolveMemoryFlushPlan as _, getMemoryRuntime as a, listMemoryCorpusSupplements as c, prepareMemoryPromptSection as d, registerMemoryCapability as f, resolveMemoryCapabilityRegistration as g, registerMemoryPromptSupplement as h, getMemoryCapabilityRegistration as i, listMemoryPromptPreparations as l, registerMemoryPromptPreparation as m, clearMemoryPluginState as n, hasMemoryRuntime as o, registerMemoryCorpusSupplement as p, getActivePreparedMemoryPromptSection as r, listActiveMemoryPublicArtifacts as s, buildMemoryPromptSection as t, listMemoryPromptSupplements as u, runWithPreparedMemoryPromptSection as v, setStandaloneMemoryManagerActive as y };
